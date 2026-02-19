import { calculateAngle, getLandmark, POSE_LANDMARKS } from './poseUtils';

// Exercise detector for Squat
export const detectSquat = (landmarks, prevState) => {
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
  const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);

  const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const isDown = kneeAngle < 100;
  const isUp = kneeAngle > 160;

  let feedback = 'Stand with feet shoulder-width apart';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'up';

  if (isDown && stage === 'up') {
    stage = 'down';
    feedback = 'Good! Now stand up';
  } else if (isUp && stage === 'down') {
    stage = 'up';
    reps++;
    feedback = 'Great rep! Go down again';
  } else if (stage === 'down' && kneeAngle > 100 && kneeAngle < 160) {
    feedback = 'Go lower for full squat';
  } else if (stage === 'up') {
    feedback = 'Squat down';
  }

  const accuracy = isDown || isUp ? 100 : Math.max(0, 100 - Math.abs(kneeAngle - 90));

  return { reps, stage, feedback, accuracy: Math.round(accuracy), angle: Math.round(kneeAngle) };
};

// Exercise detector for Bicep Curl
export const detectBicepCurl = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const isCurled = elbowAngle < 70;
  const isExtended = elbowAngle > 150;

  let feedback = 'Keep elbow stable';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isCurled && stage === 'down') {
    stage = 'up';
    feedback = 'Good curl! Now lower';
  } else if (isExtended && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Perfect! Curl again';
  } else if (stage === 'down' && elbowAngle < 150) {
    feedback = 'Extend arm fully';
  } else if (stage === 'up' && elbowAngle > 70) {
    feedback = 'Curl up more';
  }

  const accuracy = isCurled || isExtended ? 100 : 70;

  return { reps, stage, feedback, accuracy, angle: Math.round(elbowAngle) };
};

// Exercise detector for Knee Raise
export const detectKneeRaise = (landmarks, prevState) => {
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
  const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);

  const hipAngle = calculateAngle(
    { x: leftHip.x, y: leftHip.y - 0.2 },
    leftHip,
    leftKnee
  );

  const isRaised = hipAngle < 100;
  const isDown = hipAngle > 160;

  let feedback = 'Stand straight';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isRaised && stage === 'down') {
    stage = 'up';
    feedback = 'Good! Lower your leg';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Nice! Raise again';
  } else if (stage === 'down') {
    feedback = 'Raise your knee';
  } else if (stage === 'up') {
    feedback = 'Lower your leg';
  }

  const accuracy = isRaised || isDown ? 100 : 75;

  return { reps, stage, feedback, accuracy, angle: Math.round(hipAngle) };
};

// Exercise detector for Shoulder Press
export const detectShoulderPress = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const isPressed = elbowAngle > 160 && leftWrist.y < leftShoulder.y;
  const isDown = elbowAngle < 100;

  let feedback = 'Start position';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isPressed && stage === 'down') {
    stage = 'up';
    feedback = 'Great press! Lower down';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Perfect! Press again';
  } else if (stage === 'down') {
    feedback = 'Press arms up';
  } else if (stage === 'up') {
    feedback = 'Lower to shoulders';
  }

  const accuracy = isPressed || isDown ? 100 : 80;

  return { reps, stage, feedback, accuracy, angle: Math.round(elbowAngle) };
};

// Exercise registry
export const EXERCISES = {
  squat: {
    name: 'Squat',
    detector: detectSquat,
    description: 'Stand 6-8 feet from camera, full body visible',
  },
  bicepCurl: {
    name: 'Bicep Curl',
    detector: detectBicepCurl,
    description: 'Show your side profile to camera',
  },
  kneeRaise: {
    name: 'Knee Raise',
    detector: detectKneeRaise,
    description: 'Face the camera, stand straight',
  },
  shoulderPress: {
    name: 'Shoulder Press',
    detector: detectShoulderPress,
    description: 'Show your side profile to camera',
  },
};
