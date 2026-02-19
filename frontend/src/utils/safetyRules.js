export const SAFETY_RULES = {
  squat: {
    ideal: { min: 80, max: 100 },
    risk: 60,
    joint: 'knee',
    tooLow: 'Too deep. Come up slightly.',
    tooHigh: 'Bend your knees more. Go lower.',
    perfect: 'Perfect squat depth. Hold it.',
    shiftLeft: 'Shift weight to your left leg.',
    shiftRight: 'Shift weight to your right leg.',
    keepBack: 'Keep your back straight.'
  },
  lunge: {
    ideal: { min: 80, max: 110 },
    risk: 60,
    joint: 'knee',
    tooLow: 'Not too deep. Come up.',
    tooHigh: 'Lower your back knee more.',
    perfect: 'Great lunge form. Hold steady.',
    shiftLeft: 'Balance on your left side.',
    shiftRight: 'Balance on your right side.',
    keepBack: 'Keep torso upright.'
  },
  bicepCurl: {
    ideal: { min: 50, max: 70 },
    risk: 30,
    joint: 'elbow',
    tooLow: 'Curl up more. Bring weight to shoulder.',
    tooHigh: 'Lower your arm. Extend fully.',
    perfect: 'Perfect curl. Squeeze at the top.',
    keepElbow: 'Keep elbow stable. Don\'t swing.',
    slowDown: 'Slow and controlled movement.'
  },
  shoulderPress: {
    ideal: { min: 160, max: 180 },
    risk: 140,
    joint: 'elbow',
    tooLow: 'Press arms up higher. Full extension.',
    tooHigh: 'Lower to shoulder level.',
    perfect: 'Perfect press. Arms fully extended.',
    keepCore: 'Engage your core. Don\'t arch back.',
    breathe: 'Breathe out as you press up.'
  },
  lateralRaise: {
    ideal: { min: 70, max: 110 },
    risk: 40,
    joint: 'shoulder',
    tooLow: 'Raise arms higher. To shoulder level.',
    tooHigh: 'Lower slightly. Don\'t go above shoulders.',
    perfect: 'Perfect height. Arms parallel to floor.',
    slowDown: 'Slow and controlled. Feel the burn.',
    keepStraight: 'Keep arms slightly bent.'
  },
  kneeRaise: {
    ideal: { min: 80, max: 100 },
    risk: 60,
    joint: 'hip',
    tooLow: 'Lift knee higher. To hip level.',
    tooHigh: 'Lower your knee slightly.',
    perfect: 'Perfect knee height. Hold balance.',
    balance: 'Focus on balance. Engage core.',
    keepBack: 'Stand tall. Don\'t lean back.'
  },
  calfRaise: {
    ideal: { min: 0, max: 0 },
    risk: 0,
    joint: 'ankle',
    tooLow: 'Rise higher on your toes.',
    tooHigh: 'Good height. Hold at the top.',
    perfect: 'Perfect calf raise. Squeeze at top.',
    balance: 'Keep your balance. Use wall if needed.',
    slowDown: 'Slow descent. Control the movement.'
  },
  armCircle: {
    ideal: { min: 150, max: 180 },
    risk: 120,
    joint: 'shoulder',
    tooLow: 'Make bigger circles. Full range.',
    tooHigh: 'Good range of motion.',
    perfect: 'Perfect circles. Keep arms straight.',
    slowDown: 'Slow and smooth circles.',
    keepStraight: 'Keep arms extended. Don\'t bend elbows.'
  }
};

export const validateSafety = (exerciseKey, angle, prevAngle) => {
  const rule = SAFETY_RULES[exerciseKey];
  if (!rule) return { status: 'neutral', message: '', color: '#4a5e80', voice: null };

  const angleDiff = prevAngle ? Math.abs(angle - prevAngle) : 0;
  
  // Risk zone
  if (angle < rule.risk && rule.risk > 0) {
    return { 
      status: 'risk', 
      message: rule.tooLow, 
      color: '#ff3366', 
      voice: rule.tooLow,
      priority: true
    };
  }
  
  // Ideal range
  if (angle >= rule.ideal.min && angle <= rule.ideal.max) {
    return { 
      status: 'ideal', 
      message: rule.perfect, 
      color: '#00ff9d', 
      voice: rule.perfect
    };
  }
  
  // Too high
  if (angle > rule.ideal.max) {
    return { 
      status: 'adjust', 
      message: rule.tooHigh, 
      color: '#ffaa00', 
      voice: rule.tooHigh
    };
  }
  
  // Additional form cues based on movement
  if (angleDiff > 20) {
    return {
      status: 'adjust',
      message: rule.slowDown || 'Slow down. Control the movement.',
      color: '#ffaa00',
      voice: rule.slowDown
    };
  }

  return { status: 'neutral', message: '', color: '#4a5e80', voice: null };
};
