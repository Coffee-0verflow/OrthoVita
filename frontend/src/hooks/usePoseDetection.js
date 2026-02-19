import { useEffect, useRef, useState } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const usePoseDetection = (onResults) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const poseLandmarkerRef = useRef(null);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const initializePoseDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        setIsReady(true);
      } catch (err) {
        setError(err.message);
        console.error('Failed to initialize pose detection:', err);
      }
    };

    initializePoseDetection();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startDetection = async (videoElement) => {
    if (!poseLandmarkerRef.current || !videoElement) return;

    videoRef.current = videoElement;

    const detectPose = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const startTimeMs = performance.now();
        const results = poseLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
          onResults(results.landmarks[0]);
        }
      }
      animationFrameRef.current = requestAnimationFrame(detectPose);
    };

    detectPose();
  };

  const stopDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  return { isReady, error, startDetection, stopDetection };
};
