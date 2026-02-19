import { calculateAngle, getLandmark, POSE_LANDMARKS } from './poseUtils';

// Exercise detector for Squat
export const detectSquat = (landmarks, prevState) => {
  const leftHip = getLandmark(landmarks, POSE_LANDMARKS.LEFT_HIP);
  const leftKnee = getLandmark(landmarks, POSE_LANDMARKS.LEFT_KNEE);
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
  const rightHip = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_HIP);
  const rightKnee = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_KNEE);
  const rightAnkle = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ANKLE);

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const kneeAngle = Math.min(leftKneeAngle, rightKneeAngle);

  const isDown = kneeAngle < 100;
  const isUp = kneeAngle > 160;

  let feedback = 'Stand ready';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'up';
  let status = 'neutral';

  // Only count rep if proper sequence: up -> down -> up
  if (isDown && stage === 'up') {
    stage = 'down';
    feedback = '✓ Good depth! Now stand up';
    status = 'correct';
  } else if (isUp && stage === 'down') {
    stage = 'up';
    reps++;
    feedback = '✓ Rep complete! Go down again';
    status = 'correct';
  } else if (stage === 'down' && kneeAngle >= 100 && kneeAngle < 160) {
    feedback = '△ Go lower (below 100°)';
    status = 'adjust';
  } else if (stage === 'down' && kneeAngle < 80) {
    feedback = '✗ Too deep - risk of injury';
    status = 'incorrect';
  } else if (stage === 'up') {
    feedback = 'Squat down';
  }

  const accuracy = (isDown && kneeAngle >= 80 && kneeAngle <= 100) || isUp ? 100 : Math.max(0, 100 - Math.abs(kneeAngle - 90));

  return { reps, stage, feedback, accuracy: Math.round(accuracy), angle: Math.round(kneeAngle), status };
};

// Exercise detector for Bicep Curl
export const detectBicepCurl = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const isCurled = elbowAngle < 60;
  const isExtended = elbowAngle > 160;

  let feedback = 'Arm at side';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isCurled && stage === 'down') {
    stage = 'up';
    feedback = 'Good curl! Lower down';
  } else if (isExtended && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Rep complete! Curl again';
  } else if (stage === 'down' && elbowAngle < 160) {
    feedback = 'Extend arm fully';
  } else if (stage === 'up' && elbowAngle > 60) {
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
    { x: leftHip.x, y: leftHip.y - 0.3 },
    leftHip,
    leftKnee
  );

  const isRaised = hipAngle < 90;
  const isDown = hipAngle > 170;

  let feedback = 'Stand straight';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isRaised && stage === 'down') {
    stage = 'up';
    feedback = 'Good! Lower leg';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Rep done! Raise again';
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
  const isPressed = elbowAngle > 165 && leftWrist.y < leftShoulder.y;
  const isDown = elbowAngle < 90;

  let feedback = 'Start position';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isPressed && stage === 'down') {
    stage = 'up';
    feedback = 'Great press! Lower down';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Rep complete! Press again';
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
  const isRaised = shoulderAngle > 75 && shoulderAngle < 105;
  const isDown = shoulderAngle < 25;

  let feedback = 'Arms at sides';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isRaised && stage === 'down') {
    stage = 'up';
    feedback = 'Hold! Lower slowly';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Rep done! Raise again';
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
  const isLunged = kneeAngle < 100;
  const isStanding = kneeAngle > 165;

  let feedback = 'Stand ready';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'up';

  if (isLunged && stage === 'up') {
    stage = 'down';
    feedback = 'Good lunge! Return up';
  } else if (isStanding && stage === 'down') {
    stage = 'up';
    reps++;
    feedback = 'Rep complete! Lunge again';
  }

  const accuracy = isLunged || isStanding ? 100 : 80;
  return { reps, stage, feedback, accuracy, angle: Math.round(kneeAngle) };
};

// Exercise detector for Arm Circles
export const detectArmCircle = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const armAngle = calculateAngle(
    { x: leftShoulder.x, y: leftShoulder.y + 0.2 },
    leftShoulder,
    leftWrist
  );

  const isTop = leftWrist.y < leftShoulder.y - 0.15;
  const isBottom = leftWrist.y > leftShoulder.y + 0.15;

  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'start';
  let lastPosition = prevState?.lastPosition || 'none';

  if (isTop && lastPosition !== 'top') {
    lastPosition = 'top';
    if (stage === 'bottom') {
      reps++;
      stage = 'top';
    } else {
      stage = 'top';
    }
  } else if (isBottom && lastPosition !== 'bottom') {
    lastPosition = 'bottom';
    stage = 'bottom';
  }

  const feedback = 'Make slow circles';
  const accuracy = 85;
  return { reps, stage, feedback, accuracy, angle: Math.round(armAngle), lastPosition };
};

// Exercise detector for Calf Raises
export const detectCalfRaise = (landmarks, prevState) => {
  const leftAnkle = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ANKLE);
  const rightAnkle = getLandmark(landmarks, POSE_LANDMARKS.RIGHT_ANKLE);

  const avgAnkleY = (leftAnkle.y + rightAnkle.y) / 2;
  const baselineY = prevState?.baselineY || avgAnkleY;
  
  const isRaised = avgAnkleY < baselineY - 0.03;
  const isDown = avgAnkleY >= baselineY - 0.01;

  let feedback = 'Rise on toes';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';

  if (isRaised && stage === 'down') {
    stage = 'up';
    feedback = 'Hold! Lower heels';
  } else if (isDown && stage === 'up') {
    stage = 'down';
    reps++;
    feedback = 'Rep done! Raise again';
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
