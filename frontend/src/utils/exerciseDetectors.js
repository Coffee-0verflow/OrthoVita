import { calculateAngle, getLandmark, POSE_LANDMARKS } from './poseUtils';

// Exercise detector for Squat
export const detectSquat = (landmarks, prevState) => {
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
  const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);

  const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const isDown = kneeAngle >= 80 && kneeAngle <= 100; // Ideal squat range
  const isUp = kneeAngle > 160;

  let feedback = 'Stand with feet shoulder-width apart';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'up';
  let status = 'neutral';

  if (isDown && stage === 'up') {
    stage = 'down';
    feedback = '✓ Perfect squat! Now stand up';
    status = 'correct';
  } else if (isUp && stage === 'down') {
    stage = 'up';
    reps++;
    feedback = '✓ Great rep! Go down again';
    status = 'correct';
  } else if (stage === 'down' && kneeAngle > 100 && kneeAngle < 160) {
    feedback = '△ Bend more (80°-100° ideal)';
    status = 'adjust';
  } else if (stage === 'down' && kneeAngle < 80) {
    feedback = '✗ Too low - risk of injury';
    status = 'incorrect';
  } else if (stage === 'up') {
    feedback = 'Squat down to 90°';
  }

  const accuracy = isDown || isUp ? 100 : Math.max(0, 100 - Math.abs(kneeAngle - 90));

  return { reps, stage, feedback, accuracy: Math.round(accuracy), angle: Math.round(kneeAngle), status };
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

// Exercise detector for Lateral Raise
export const detectLateralRaise = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);

  const shoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
  const isRaised = shoulderAngle > 70 && shoulderAngle < 110;
  const isDown = shoulderAngle < 30;

  let feedback = 'Arms at sides';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isRaised && stage === 'down') {
    stage = 'up';
    feedback = 'Hold! Now lower slowly';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Good! Raise again';
  }

  const accuracy = isRaised || isDown ? 100 : 75;
  return { reps, stage, feedback, accuracy, angle: Math.round(shoulderAngle) };
};

// Exercise detector for Lunges
export const detectLunge = (landmarks, prevState) => {
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
  const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);

  const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const isLunged = kneeAngle < 110;
  const isStanding = kneeAngle > 160;

  let feedback = 'Stand ready';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'up';

  if (isLunged && stage === 'up') {
    stage = 'down';
    feedback = 'Good lunge! Return up';
  } else if (isStanding && stage === 'down') {
    stage = 'up';
    reps++;
    feedback = 'Perfect! Lunge again';
  }

  const accuracy = isLunged || isStanding ? 100 : 80;
  return { reps, stage, feedback, accuracy, angle: Math.round(kneeAngle) };
};

// Exercise detector for Arm Circles
export const detectArmCircle = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const armAngle = calculateAngle(
    { x: leftShoulder.x, y: leftShoulder.y + 0.2 },
    leftShoulder,
    leftWrist
  );

  const isExtended = armAngle > 150;
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'start';

  if (isExtended && leftWrist.y < leftShoulder.y) {
    if (stage !== 'top') {
      stage = 'top';
      reps++;
    }
  } else if (leftWrist.y > leftShoulder.y) {
    stage = 'bottom';
  }

  const feedback = 'Make slow circles';
  const accuracy = isExtended ? 100 : 85;
  return { reps, stage, feedback, accuracy, angle: Math.round(armAngle) };
};

// Exercise detector for Calf Raises
export const detectCalfRaise = (landmarks, prevState) => {
  const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);

  const hipToAnkle = Math.abs(leftHip.y - leftAnkle.y);
  const isRaised = leftAnkle.y < prevState?.baselineY - 0.02;
  const isDown = leftAnkle.y >= prevState?.baselineY - 0.01;

  let feedback = 'Stand on toes';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';
  let baselineY = prevState?.baselineY || leftAnkle.y;

  if (isRaised && stage === 'down') {
    stage = 'up';
    feedback = 'Hold! Lower heels';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Great! Raise again';
  }

  const accuracy = 90;
  return { reps, stage, feedback, accuracy, baselineY, angle: 0 };
};

// Exercise registry
export const EXERCISES = {
  squat: {
    name: 'Squat',
    detector: detectSquat,
    description: 'Lower body strength - Full body visible',
    category: 'Lower Body',
  },
  lunge: {
    name: 'Lunge',
    detector: detectLunge,
    description: 'Leg strength & balance - Side profile',
    category: 'Lower Body',
  },
  calfRaise: {
    name: 'Calf Raise',
    detector: detectCalfRaise,
    description: 'Ankle mobility - Face camera',
    category: 'Lower Body',
  },
  bicepCurl: {
    name: 'Bicep Curl',
    detector: detectBicepCurl,
    description: 'Arm strength - Side profile',
    category: 'Upper Body',
  },
  shoulderPress: {
    name: 'Shoulder Press',
    detector: detectShoulderPress,
    description: 'Shoulder strength - Side profile',
    category: 'Upper Body',
  },
  lateralRaise: {
    name: 'Lateral Raise',
    detector: detectLateralRaise,
    description: 'Shoulder mobility - Face camera',
    category: 'Upper Body',
  },
  armCircle: {
    name: 'Arm Circle',
    detector: detectArmCircle,
    description: 'Shoulder flexibility - Face camera',
    category: 'Upper Body',
  },
  kneeRaise: {
    name: 'Knee Raise',
    detector: detectKneeRaise,
    description: 'Hip flexor strength - Face camera',
    category: 'Core & Balance',
  },
};
