// Map injuries to recommended exercises
export const INJURY_EXERCISE_MAP = {
  'knee pain': ['squat', 'calfRaise', 'lateralRaise', 'armCircle', 'bicepCurl', 'shoulderPress'],
  'lower back pain': ['kneeRaise', 'bicepCurl', 'shoulderPress', 'lateralRaise', 'armCircle'],
  'shoulder pain': ['squat', 'lunge', 'calfRaise', 'kneeRaise'],
  'hip pain': ['bicepCurl', 'shoulderPress', 'lateralRaise', 'armCircle'],
  'ankle pain': ['bicepCurl', 'shoulderPress', 'lateralRaise', 'armCircle', 'kneeRaise'],
  'general': ['squat', 'lunge', 'calfRaise', 'bicepCurl', 'shoulderPress', 'lateralRaise', 'armCircle', 'kneeRaise']
};

export const getRecommendedExercises = (injury) => {
  if (!injury) return INJURY_EXERCISE_MAP['general'];
  
  const lowerInjury = injury.toLowerCase();
  
  if (lowerInjury.includes('knee')) return INJURY_EXERCISE_MAP['knee pain'];
  if (lowerInjury.includes('back') || lowerInjury.includes('spine')) return INJURY_EXERCISE_MAP['lower back pain'];
  if (lowerInjury.includes('shoulder')) return INJURY_EXERCISE_MAP['shoulder pain'];
  if (lowerInjury.includes('hip')) return INJURY_EXERCISE_MAP['hip pain'];
  if (lowerInjury.includes('ankle') || lowerInjury.includes('foot')) return INJURY_EXERCISE_MAP['ankle pain'];
  
  return INJURY_EXERCISE_MAP['general'];
};
