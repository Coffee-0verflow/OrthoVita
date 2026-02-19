// Calculate angle between three points
export const calculateAngle = (a, b, c) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

// Get specific landmark by index
export const getLandmark = (landmarks, index) => {
  return landmarks[index];
};

// MediaPipe Pose Landmark Indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE: 2,
  RIGHT_EYE: 5,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

// Draw skeleton with joint labels and angles
export const drawSkeleton = (ctx, landmarks, width, height, exerciseData = null) => {
  const connections = [
    [0, 7], [0, 8], // Nose to ears
    [7, 11], [8, 12], // Ears to shoulders
    [11, 13], [13, 15], // Left arm
    [12, 14], [14, 16], // Right arm
    [11, 12], // Shoulders
    [11, 23], [12, 24], // Torso
    [23, 24], // Hips
    [23, 25], [25, 27], // Left leg
    [24, 26], [26, 28], // Right leg
  ];

  // Draw connections
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 8;
  connections.forEach(([start, end]) => {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];
    if (startPoint && endPoint) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x * width, startPoint.y * height);
      ctx.lineTo(endPoint.x * width, endPoint.y * height);
      ctx.stroke();
    }
  });
  ctx.shadowBlur = 0;

  // Draw key joint points with labels
  const keyJoints = [
    { idx: POSE_LANDMARKS.NOSE, label: 'Nose' },
    { idx: POSE_LANDMARKS.LEFT_SHOULDER, label: 'Shoulder' },
    { idx: POSE_LANDMARKS.LEFT_ELBOW, label: 'Elbow' },
    { idx: POSE_LANDMARKS.LEFT_WRIST, label: 'Wrist' },
    { idx: POSE_LANDMARKS.LEFT_HIP, label: 'Hip' },
    { idx: POSE_LANDMARKS.LEFT_KNEE, label: 'Knee' },
    { idx: POSE_LANDMARKS.LEFT_ANKLE, label: 'Ankle' },
  ];

  keyJoints.forEach(({ idx, label }) => {
    const point = landmarks[idx];
    if (point) {
      const x = point.x * width;
      const y = point.y * height;
      
      // Draw joint circle
      ctx.fillStyle = '#00ff9d';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw label background
      ctx.fillStyle = 'rgba(6, 11, 20, 0.8)';
      ctx.fillRect(x + 10, y - 8, 60, 16);
      
      // Draw label text
      ctx.fillStyle = '#00e5ff';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(label, x + 14, y + 3);
    }
  });

  // Draw angle if available
  if (exerciseData?.angle) {
    ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
    ctx.font = 'bold 24px "Syne", sans-serif';
    ctx.fillText(`${exerciseData.angle}°`, 20, 40);
    
    ctx.fillStyle = '#4a5e80';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('JOINT ANGLE', 20, 60);
  }
};

// Validate posture and return feedback
export const validatePosture = (angle, idealMin, idealMax) => {
  if (angle >= idealMin && angle <= idealMax) {
    return { status: '✓', message: 'Perfect form!', color: '#00ff9d' };
  } else if (angle < idealMin) {
    return { status: '✗', message: 'Bend more', color: '#ff4444' };
  } else {
    return { status: '△', message: 'Adjust posture', color: '#ffaa00' };
  }
};
