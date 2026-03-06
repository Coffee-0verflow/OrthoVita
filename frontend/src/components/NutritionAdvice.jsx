import { useState, useEffect } from 'react';
import { EXERCISES } from '../utils/exerciseDetectors';

const NUTRITION_DATA = {
  'Knee Pain': {
    description: 'Anti-inflammatory foods to reduce knee joint inflammation and support cartilage health',
    foodsToEat: [
      'Fatty fish (salmon, mackerel) - Omega-3 reduces inflammation',
      'Leafy greens (spinach, kale) - Vitamin K for bone health',
      'Berries (blueberries, strawberries) - Antioxidants reduce joint pain',
      'Nuts and seeds - Vitamin E protects joint tissue',
      'Turmeric and ginger - Natural anti-inflammatory compounds',
      'Bone broth - Collagen for cartilage repair'
    ],
    foodsToAvoid: [
      'Processed foods high in trans fats',
      'Refined sugars and white bread',
      'Excessive red meat',
      'Fried foods',
      'Alcohol in excess'
    ],
    supplements: 'Glucosamine, Chondroitin, Vitamin D, Omega-3',
    hydration: 'Drink 8-10 glasses of water daily to maintain joint lubrication'
  },
  'Shoulder Pain': {
    description: 'Protein-rich foods for muscle repair and anti-inflammatory nutrients',
    foodsToEat: [
      'Lean chicken and turkey - Protein for muscle recovery',
      'Greek yogurt - Calcium and protein for bone strength',
      'Sweet potatoes - Vitamin A for tissue repair',
      'Citrus fruits - Vitamin C for collagen production',
      'Almonds - Magnesium for muscle relaxation',
      'Eggs - Complete protein and vitamin D'
    ],
    foodsToAvoid: [
      'High-sodium processed foods',
      'Sugary drinks and sodas',
      'Excessive caffeine',
      'Processed meats',
      'Artificial sweeteners'
    ],
    supplements: 'Magnesium, Vitamin B complex, Collagen peptides',
    hydration: 'Drink water before, during, and after exercises - aim for 2-3 liters daily'
  },
  'Lower Back Pain': {
    description: 'Foods that reduce inflammation and support spinal health',
    foodsToEat: [
      'Whole grains (quinoa, brown rice) - B vitamins for nerve health',
      'Avocados - Healthy fats reduce inflammation',
      'Dark chocolate (70%+) - Magnesium for muscle relaxation',
      'Cherries - Natural pain relief properties',
      'Green tea - Antioxidants reduce inflammation',
      'Pumpkin seeds - Zinc for tissue repair'
    ],
    foodsToAvoid: [
      'High-fat dairy products',
      'Refined carbohydrates',
      'Excessive salt',
      'Processed snacks',
      'Energy drinks'
    ],
    supplements: 'Magnesium, Vitamin D, Calcium, Turmeric extract',
    hydration: 'Maintain spinal disc hydration with 8-10 glasses of water daily'
  },
  'Hip Pain': {
    description: 'Joint-supporting nutrients and anti-inflammatory foods',
    foodsToEat: [
      'Olive oil - Oleocanthal reduces joint inflammation',
      'Broccoli - Sulforaphane protects cartilage',
      'Garlic - Reduces inflammatory markers',
      'Walnuts - Omega-3 for joint health',
      'Pineapple - Bromelain enzyme reduces swelling',
      'Chia seeds - Plant-based omega-3'
    ],
    foodsToAvoid: [
      'Nightshade vegetables (if sensitive)',
      'Excessive omega-6 oils',
      'Sugary desserts',
      'White pasta and bread',
      'Processed cheese'
    ],
    supplements: 'Glucosamine, MSM, Vitamin C, Collagen',
    hydration: 'Stay well-hydrated with 2.5-3 liters of water for joint lubrication'
  },
  'General': {
    description: 'Balanced nutrition for overall rehabilitation and recovery',
    foodsToEat: [
      'Lean proteins (chicken, fish, tofu) - Muscle repair',
      'Colorful vegetables - Vitamins and minerals',
      'Whole grains - Sustained energy',
      'Fruits - Natural antioxidants',
      'Healthy fats (nuts, seeds, avocado) - Reduce inflammation',
      'Legumes - Protein and fiber'
    ],
    foodsToAvoid: [
      'Ultra-processed foods',
      'Excessive sugar',
      'Trans fats',
      'High-sodium foods',
      'Alcohol'
    ],
    supplements: 'Multivitamin, Omega-3, Vitamin D',
    hydration: 'Drink 8-10 glasses of water daily, more during exercise'
  }
};

const EXERCISE_CALORIES = {
  'squat': { calories: 8, duration: 1 },
  'bicep-curl': { calories: 5, duration: 1 },
  'knee-raise': { calories: 6, duration: 1 },
  'shoulder-press': { calories: 7, duration: 1 },
  'lateral-raise': { calories: 6, duration: 1 },
  'leg-raise': { calories: 7, duration: 1 },
  'arm-raise': { calories: 5, duration: 1 },
  'jumping-jack': { calories: 10, duration: 1 },
  'lunge': { calories: 8, duration: 1 }
};

export const NutritionAdvice = ({ injury, sessionHistory, currentExercise, onClose }) => {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [selectedInjuries, setSelectedInjuries] = useState(injury ? [injury] : []);
  const [showSelection, setShowSelection] = useState(!injury);

  const availableInjuries = ['Knee Pain', 'Shoulder Pain', 'Lower Back Pain', 'Hip Pain', 'General'];

  const toggleInjury = (injuryName) => {
    setSelectedInjuries(prev => 
      prev.includes(injuryName) 
        ? prev.filter(i => i !== injuryName)
        : [...prev, injuryName]
    );
  };

  const handleContinue = () => {
    if (selectedInjuries.length === 0) {
      setSelectedInjuries(['General']);
    }
    setShowSelection(false);
  };

  useEffect(() => {
    if (showSelection) return;

    const calculateNutrition = () => {
      // Merge nutrition data from all selected injuries
      const mergedData = {
        description: '',
        foodsToEat: [],
        foodsToAvoid: [],
        supplements: '',
        hydration: ''
      };

      const injuriesToUse = selectedInjuries.length > 0 ? selectedInjuries : ['General'];
      
      injuriesToUse.forEach((injuryKey, index) => {
        const data = NUTRITION_DATA[injuryKey] || NUTRITION_DATA['General'];
        
        if (index === 0) {
          mergedData.description = data.description;
          mergedData.hydration = data.hydration;
        } else {
          mergedData.description += ` | ${data.description}`;
        }
        
        // Merge foods without duplicates
        data.foodsToEat.forEach(food => {
          if (!mergedData.foodsToEat.includes(food)) {
            mergedData.foodsToEat.push(food);
          }
        });
        
        data.foodsToAvoid.forEach(food => {
          if (!mergedData.foodsToAvoid.includes(food)) {
            mergedData.foodsToAvoid.push(food);
          }
        });
        
        // Combine supplements
        if (mergedData.supplements) {
          mergedData.supplements += `, ${data.supplements}`;
        } else {
          mergedData.supplements = data.supplements;
        }
      });
      
      // Calculate total calories burned from history
      let totalCalories = 0;
      let exerciseBreakdown = {};
      
      if (sessionHistory && sessionHistory.length > 0) {
        sessionHistory.forEach(session => {
          const exerciseKey = session.exercise;
          const calorieData = EXERCISE_CALORIES[exerciseKey] || { calories: 6, duration: 1 };
          const sessionCalories = (session.reps || 0) * calorieData.calories;
          totalCalories += sessionCalories;
          
          if (!exerciseBreakdown[exerciseKey]) {
            exerciseBreakdown[exerciseKey] = { reps: 0, calories: 0 };
          }
          exerciseBreakdown[exerciseKey].reps += session.reps || 0;
          exerciseBreakdown[exerciseKey].calories += sessionCalories;
        });
      }
      
      // Calculate recommended calorie intake
      const baseCalories = 2000;
      const recommendedIntake = baseCalories + (totalCalories * 0.3);
      
      setNutritionPlan({
        ...mergedData,
        totalCaloriesBurned: Math.round(totalCalories),
        recommendedCalories: Math.round(recommendedIntake),
        exerciseBreakdown,
        currentExercise: currentExercise ? EXERCISES[currentExercise]?.name : null,
        selectedInjuries: injuriesToUse
      });
    };
    
    calculateNutrition();
  }, [showSelection, selectedInjuries, sessionHistory, currentExercise]);

  if (showSelection) {
    return (
      <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
                Select Your Injuries
              </h2>
              <p className="text-xs text-[#4a5e80] mt-1">
                Choose one or more conditions for personalized nutrition
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#060b14] border border-[#1c2e50] text-[#4a5e80]
                hover:bg-[#1c2e50] hover:text-[#e8f0ff] transition-all"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {availableInjuries.map((injuryName) => (
              <button
                key={injuryName}
                onClick={() => toggleInjury(injuryName)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedInjuries.includes(injuryName)
                    ? 'border-[#00e5ff] bg-[#00e5ff]/10'
                    : 'border-[#1c2e50] bg-[#060b14] hover:border-[#00e5ff]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#e8f0ff] font-semibold">{injuryName}</span>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedInjuries.includes(injuryName)
                      ? 'border-[#00e5ff] bg-[#00e5ff]'
                      : 'border-[#4a5e80]'
                  }`}>
                    {selectedInjuries.includes(injuryName) && (
                      <span className="text-[#060b14] text-xs">✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedInjuries.length === 0}
            className="w-full px-6 py-3 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold
              hover:bg-[#00ccee] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue {selectedInjuries.length > 0 && `(${selectedInjuries.length} selected)`}
          </button>
        </div>
      </div>
    );
  }

  if (!nutritionPlan) {
    return (
      <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1c2e50] border-t-[#00e5ff] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#060b14]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-[#0d1526] border border-[#1c2e50] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-[#1c2e50] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSelection(true)}
              className="w-8 h-8 rounded-lg bg-[#060b14] border border-[#1c2e50] text-[#4a5e80]
                hover:bg-[#1c2e50] hover:text-[#e8f0ff] transition-all flex items-center justify-center"
              title="Change injuries"
            >
              ←
            </button>
            <div>
              <h2 className="text-2xl font-black text-[#e8f0ff]" style={{ fontFamily: "'Syne', sans-serif" }}>
                🥗 Personalized Nutrition Plan
              </h2>
              <p className="text-xs text-[#4a5e80] mt-1">
                {nutritionPlan.selectedInjuries.join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#060b14] border border-[#1c2e50] text-[#4a5e80]
              hover:bg-[#1c2e50] hover:text-[#e8f0ff] transition-all flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* Activity Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#060b14] border border-[#00e5ff]/20 rounded-xl p-4">
              <div className="text-xs text-[#4a5e80] mb-1">Calories Burned</div>
              <div className="text-2xl font-bold text-[#00e5ff]">{nutritionPlan.totalCaloriesBurned}</div>
              <div className="text-xs text-[#6b7fa8] mt-1">From {sessionHistory?.length || 0} sessions</div>
            </div>
            <div className="bg-[#060b14] border border-[#00ff9d]/20 rounded-xl p-4">
              <div className="text-xs text-[#4a5e80] mb-1">Recommended Intake</div>
              <div className="text-2xl font-bold text-[#00ff9d]">{nutritionPlan.recommendedCalories}</div>
              <div className="text-xs text-[#6b7fa8] mt-1">Calories per day</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#c8d8f0]">{nutritionPlan.description}</p>
          </div>

          <div className="space-y-4 mb-6">
            {/* Foods to Eat */}
            <div className="bg-[#060b14] border border-[#00ff9d]/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-[#00ff9d] mb-3 flex items-center gap-2">
                <span>✓</span> Foods to Eat
              </h3>
              <ul className="space-y-2">
                {nutritionPlan.foodsToEat.map((food, i) => (
                  <li key={i} className="text-[#c8d8f0] text-sm flex items-start gap-2">
                    <span className="text-[#00ff9d] mt-0.5">•</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="bg-[#060b14] border border-[#ff3366]/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-[#ff3366] mb-3 flex items-center gap-2">
                <span>✗</span> Foods to Avoid
              </h3>
              <ul className="space-y-2">
                {nutritionPlan.foodsToAvoid.map((food, i) => (
                  <li key={i} className="text-[#c8d8f0] text-sm flex items-start gap-2">
                    <span className="text-[#ff3366] mt-0.5">•</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hydration */}
            <div className="bg-[#060b14] border border-[#00e5ff]/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-[#00e5ff] mb-2 flex items-center gap-2">
                <span>💧</span> Hydration
              </h3>
              <p className="text-[#c8d8f0] text-sm">{nutritionPlan.hydration}</p>
            </div>

            {/* Supplements */}
            <div className="bg-[#060b14] border border-[#ff6b35]/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-[#ff6b35] mb-2 flex items-center gap-2">
                <span>💊</span> Recommended Supplements
              </h3>
              <p className="text-[#c8d8f0] text-sm">{nutritionPlan.supplements}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-xl p-4 mb-4">
            <p className="text-xs text-[#ff6b35]">
              ⚠️ This is general guidance based on your injury and activity. Always consult a healthcare professional or registered dietitian for personalized nutrition advice.
            </p>
          </div>
        </div>

        {/* Footer Button - Fixed */}
        <div className="p-6 border-t border-[#1c2e50] flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#00e5ff] text-[#060b14] rounded-xl font-bold
              hover:bg-[#00ccee] transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
