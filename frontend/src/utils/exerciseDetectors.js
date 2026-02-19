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

  const isCorrectDown = kneeAngle >= 80 && kneeAngle <= 100;
  const isUp = kneeAngle > 160;

  let feedback = 'Stand ready';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'up';
  let status = 'neutral';
  let accuracy = 100;

  if (stage === 'up' && kneeAngle < 160) {
    if (isCorrectDown) {
      stage = 'down';
      feedback = '✓ Perfect depth! Now stand up';
      status = 'correct';
      accuracy = 100;
    } else if (kneeAngle < 80) {
      feedback = '✗ Too deep! Come up slightly (80-100°)';
      status = 'incorrect';
      accuracy = 50;
    } else if (kneeAngle > 100 && kneeAngle < 160) {
      feedback = '✗ Go lower! Reach 80-100° angle';
      status = 'incorrect';
      accuracy = 60;
    }
  } else if (stage === 'down' && isUp) {
    stage = 'up';
    reps++;
    feedback = '✓ Rep counted! Go down again';
    status = 'correct';
    accuracy = 100;
  } else if (stage === 'up') {
    feedback = 'Squat down to 90°';
  }

  return { reps, stage, feedback, accuracy, angle: Math.round(kneeAngle), status };
};

// Exercise detector for Bicep Curl
export const detectBicepCurl = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const isCorrectCurl = elbowAngle >= 50 && elbowAngle <= 70;
  const isExtended = elbowAngle > 160;

  let feedback = 'Arm at side';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';
  let status = 'neutral';
  let accuracy = 100;

  if (stage === 'down' && elbowAngle < 160) {
    if (isCorrectCurl) {
      stage = 'up';
      feedback = '✓ Perfect curl! Lower down';
      status = 'correct';
      accuracy = 100;
    } else if (elbowAngle < 50) {
      feedback = '✗ Too much curl! Relax slightly';
      status = 'incorrect';
      accuracy = 55;
    } else {
      feedback = '✗ Curl more! Reach 50-70°';
      status = 'incorrect';
      accuracy = 60;
    }
  } else if (stage === 'up' && isExtended) {
    stage = 'down';
    reps++;
    feedback = '✓ Rep counted! Curl again';
    status = 'correct';
    accuracy = 100;
  } else if (stage === 'down') {
    feedback = 'Curl arm up';
  } else if (stage === 'up' && !isExtended) {
    feedback = '✗ Extend arm fully (160°+)';
    status = 'incorrect';
    accuracy = 65;
  }

  return { reps, stage, feedback, accuracy, angle: Math.round(elbowAngle), status };
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

  const isCorrectRaise = hipAngle >= 70 && hipAngle <= 95;
  const isDown = hipAngle > 170;

  let feedback = 'Stand straight';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';
  let status = 'neutral';
  let accuracy = 100;

  if (stage === 'down' && hipAngle < 170) {
    if (isCorrectRaise) {
      stage = 'up';
      feedback = '✓ Perfect height! Lower leg';
      status = 'correct';
      accuracy = 100;
    } else if (hipAngle < 70) {
      feedback = '✗ Too high! Lower slightly';
      status = 'incorrect';
      accuracy = 60;
    } else {
      feedback = '✗ Raise higher! Reach hip level';
      status = 'incorrect';
      accuracy = 65;
    }
  } else if (stage === 'up' && isDown) {
    stage = 'down';
    reps++;
    feedback = '✓ Rep counted! Raise again';
    status = 'correct';
    accuracy = 100;
  } else if (stage === 'down') {
    feedback = 'Raise your knee to hip level';
  } else if (stage === 'up' && !isDown) {
    feedback = '✗ Lower leg completely';
    status = 'incorrect';
    accuracy = 70;
  }

  return { reps, stage, feedback, accuracy, angle: Math.round(hipAngle), status };
};

// Exercise detector for Shoulder Press
export const detectShoulderPress = (landmarks, prevState) => {
  const leftShoulder = getLandmark(landmarks, POSE_LANDMARKS.LEFT_SHOULDER);
  const leftElbow = getLandmark(landmarks, POSE_LANDMARKS.LEFT_ELBOW);
  const leftWrist = getLandmark(landmarks, POSE_LANDMARKS.LEFT_WRIST);

  const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const isCorrectPress = elbowAngle > 165 && leftWrist.y < leftShoulder.y;
  const isCorrectDown = elbowAngle >= 80 && elbowAngle <= 100;

  let feedback = 'Start position';
  let reps = prevState?.reps || 0;
  let stage = prevState?.stage || 'down';
  let status = 'neutral';
  let accuracy = 100;

  if (stage === 'down' && elbowAngle > 100) {
    if (isCorrectPress) {
      stage = 'up';
      feedback = '✓ Full extension! Lower down';
      status = 'correct';
      accuracy = 100;
    } else {
      feedback = '✗ Press higher! Fully extend arms';
      status = 'incorrect';
      accuracy = 65;
    }
  } else if (stage === 'up' && elbowAngle < 100) {
    if (isCorrectDown) {
      stage = 'down';
      reps++;
      feedback = '✓ Rep counted! Press again';
      status = 'correct';
      accuracy = 100;
    } else {
      feedback = '✗ Lower to shoulder level (80-100°)';
      status = 'incorrect';
      accuracy = 60;
    }
  } else if (stage === 'down') {
    feedback = 'Press arms overhead';
  } else if (stage === 'up') {
    feedback = 'Lower to shoulders';
  }

  return { reps, stage, feedback, accuracy, angle: Math.round(elbowAngle), status };
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
