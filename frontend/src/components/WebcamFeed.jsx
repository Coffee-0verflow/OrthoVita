import { useEffect, useRef, useState, useCallback } from 'react';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { drawSkeleton } from '../utils/poseUtils';
import { EXERCISES } from '../utils/exerciseDetectors';
import { useStore } from '../store/useStore';

export const WebcamFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);          // keep stream in ref so cleanup always works
  const exerciseStateRef = useRef({});

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [videoReady, setVideoReady] = useState(false); // true once video is actually playing

  const { currentExercise, isActive, updateStats, stopSession } = useStore();

  // ── Pose detection callback ────────────────────────────────────────────────
  const onPoseResults = useCallback((landmarks) => {
    if (!isActive || !currentExercise) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Keep canvas size in sync
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSkeleton(ctx, landmarks, canvas.width, canvas.height);

    const detector = EXERCISES[currentExercise]?.detector;
    if (detector) {
      const result = detector(landmarks, exerciseStateRef.current);
      exerciseStateRef.current = result;
      updateStats(result.reps, result.accuracy, result.feedback);
    }
  }, [isActive, currentExercise, updateStats]);

  const { isReady, error: poseError, startDetection, stopDetection } = usePoseDetection(onPoseResults);

  // ── Start camera ───────────────────────────────────────────────────────────
  const startCamera = async () => {
    setCameraError(null);
    setVideoReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true); // render video element first, THEN assign srcObject in effect below
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Click the camera icon in your browser address bar and allow access.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a webcam.');
      } else {
        setCameraError(`Camera error: ${err.message}`);
      }
    }
  };

  // ── Assign stream to video element once it's mounted ──────────────────────
  // This effect runs when cameraOpen becomes true (video element now in DOM)
  useEffect(() => {
    if (!cameraOpen || !streamRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = streamRef.current;
    // playsInline + muted are required for autoplay in Chrome
    video.muted = true;
    video.playsInline = true;

    const onPlaying = () => {
      setVideoReady(true);
      // Set canvas dimensions once video is actually rendering frames
      if (canvasRef.current) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
      }
    };

    video.addEventListener('playing', onPlaying);
    video.play().catch(err => {
      console.error('video.play() failed:', err);
      setCameraError('Could not start video. Try refreshing the page.');
    });

    return () => {
      video.removeEventListener('playing', onPlaying);
    };
  }, [cameraOpen]);

  // ── Stop camera ────────────────────────────────────────────────────────────
  const stopCamera = () => {
    stopDetection();
    if (isActive) stopSession();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setCameraOpen(false);
    setVideoReady(false);
  };

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopDetection();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // ── Start/stop pose detection when session state changes ───────────────────
  useEffect(() => {
    if (isReady && videoReady && isActive && cameraOpen) {
      startDetection(videoRef.current);
    } else {
      stopDetection();
    }
  }, [isReady, videoReady, isActive, cameraOpen]);

  // ── Camera closed view ─────────────────────────────────────────────────────
  if (!cameraOpen) {
    return (
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl
          flex flex-col items-center justify-center gap-5 py-16 relative overflow-hidden">

          {/* Corner brackets */}
          {[['top-4 left-4','border-t-2 border-l-2'],['top-4 right-4','border-t-2 border-r-2'],
            ['bottom-4 left-4','border-b-2 border-l-2'],['bottom-4 right-4','border-b-2 border-r-2']
          ].map(([pos, border]) => (
            <div key={pos} className={`absolute ${pos} w-8 h-8 ${border} border-[#00e5ff]/20`} />
          ))}

          <div className="text-5xl opacity-20">📷</div>
          <div className="text-center">
            <p className="text-[#4a5e80] text-sm mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              CAMERA IS OFF
            </p>
            <p className="text-[#2d3f5c] text-xs">Select an exercise above, then open camera to begin</p>
          </div>

          {cameraError && (
            <div className="mx-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {cameraError}
            </div>
          )}

          <button
            onClick={startCamera}
            className="px-6 py-2.5 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold text-sm
              hover:bg-[#00ccee] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]
              transition-all duration-200 active:scale-95"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Open Camera
          </button>
        </div>
      </div>
    );
  }

  // ── Camera open view ───────────────────────────────────────────────────────
  return (
    <div className="relative w-full max-w-2xl mx-auto">

      {/* ✕ Close button */}
      <button
        onClick={stopCamera}
        title="Close Camera"
        className="absolute top-3 right-3 z-30 w-9 h-9 bg-[#060b14]/90 border border-[#1c2e50]
          text-[#4a5e80] rounded-xl flex items-center justify-center text-sm
          hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400
          transition-all duration-200 backdrop-blur-sm"
      >
        ✕
      </button>

      {/* LIVE badge */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2
        bg-[#060b14]/80 border border-[#1c2e50] px-3 py-1.5 rounded-lg backdrop-blur-sm">
        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00ff9d] animate-pulse' : 'bg-[#4a5e80]'}`} />
        <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace",
          color: isActive ? '#00ff9d' : '#4a5e80' }}>
          {isActive ? 'TRACKING' : 'LIVE'}
        </span>
      </div>

      {/* Corner brackets decoration */}
      {[['top-3 left-3','border-t-2 border-l-2'],['top-3 right-3','border-t-2 border-r-2'],
        ['bottom-3 left-3','border-b-2 border-l-2'],['bottom-3 right-3','border-b-2 border-r-2']
      ].map(([pos, border]) => (
        <div key={pos} className={`absolute ${pos} w-8 h-8 ${border} border-[#00e5ff]/40 z-20 pointer-events-none`} />
      ))}

      {/*
        IMPORTANT: video must be visible (not hidden) for the browser to
        decode frames. We keep it in the DOM always once cameraOpen=true.
        mirror with scaleX(-1) so it feels like a selfie camera.
      */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-2xl border border-[#1c2e50] block bg-[#0d1526]"
        style={{ transform: 'scaleX(-1)', minHeight: '320px' }}
      />

      {/* Canvas overlaid on top — same mirror transform */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Loading overlay — shown until video is actually playing */}
      {!videoReady && (
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center
          bg-[#060b14]/80 backdrop-blur-sm z-10 gap-3">
          <div className="w-8 h-8 border-2 border-[#1c2e50] border-t-[#00e5ff] rounded-full animate-spin" />
          <p className="text-[#00e5ff] text-sm animate-pulse" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            STARTING CAMERA...
          </p>
        </div>
      )}

      {/* Pose model loading overlay */}
      {videoReady && !isReady && (
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center
          bg-[#060b14]/70 backdrop-blur-sm z-10 gap-3">
          <div className="w-8 h-8 border-2 border-[#1c2e50] border-t-[#00e5ff] rounded-full animate-spin" />
          <p className="text-[#00e5ff] text-sm animate-pulse" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            LOADING POSE MODEL...
          </p>
        </div>
      )}

      {/* Pose error */}
      {poseError && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-[#060b14]/80 z-10">
          <p className="text-red-400 text-sm px-6 text-center">{poseError}</p>
        </div>
      )}
    </div>
  );
};