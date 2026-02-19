import { useRef, useState, useCallback } from 'react';

export const useVoiceCoach = () => {
  const [enabled, setEnabled] = useState(true);
  const [language, setLanguage] = useState('en-US'); // 'en-US' or 'hi-IN'
  const lastSpeakTime = useRef(0);
  const lastMessage = useRef('');
  const isSpeaking = useRef(false);

  const speak = useCallback((text, priority = false) => {
    if (!enabled || !text) return;
    
    // Translate to Hindi if needed
    const translatedText = language === 'hi-IN' ? translateToHindi(text) : text;
    
    if (translatedText === lastMessage.current && !priority) return;
    
    const now = Date.now();
    const cooldown = priority ? 3000 : 8000;

    if (!priority && (now - lastSpeakTime.current < cooldown || isSpeaking.current)) {
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = language;

    utterance.onstart = () => {
      isSpeaking.current = true;
      lastSpeakTime.current = now;
      lastMessage.current = translatedText;
    };

    utterance.onend = () => {
      isSpeaking.current = false;
    };

    utterance.onerror = () => {
      isSpeaking.current = false;
    };

    window.speechSynthesis.speak(utterance);
  }, [enabled, language]);

  const toggle = () => setEnabled(!enabled);
  const toggleLanguage = () => setLanguage(lang => lang === 'en-US' ? 'hi-IN' : 'en-US');
  const stop = () => {
    window.speechSynthesis.cancel();
    isSpeaking.current = false;
  };

  return { speak, enabled, language, toggle, toggleLanguage, stop };
};

// Hindi translations for common phrases
const translateToHindi = (text) => {
  const translations = {
    // Squat
    'Too deep. Come up slightly.': 'बहुत नीचे। थोड़ा ऊपर आएं।',
    'Bend your knees more. Go lower.': 'घुटने और मोड़ें। नीचे जाएं।',
    'Perfect squat depth. Hold it.': 'बिल्कुल सही। इसे पकड़ें।',
    'Keep your back straight.': 'अपनी पीठ सीधी रखें।',
    
    // Lunge
    'Not too deep. Come up.': 'बहुत नीचे नहीं। ऊपर आएं।',
    'Lower your back knee more.': 'पिछला घुटना और नीचे करें।',
    'Great lunge form. Hold steady.': 'बहुत अच्छा। स्थिर रहें।',
    'Keep torso upright.': 'धड़ सीधा रखें।',
    
    // Bicep Curl
    'Curl up more. Bring weight to shoulder.': 'और ऊपर उठाएं। कंधे तक लाएं।',
    'Lower your arm. Extend fully.': 'हाथ नीचे करें। पूरा फैलाएं।',
    'Perfect curl. Squeeze at the top.': 'बिल्कुल सही। ऊपर दबाएं।',
    'Keep elbow stable. Don\'t swing.': 'कोहनी स्थिर रखें। झूलें नहीं।',
    
    // Shoulder Press
    'Press arms up higher. Full extension.': 'हाथ और ऊपर दबाएं। पूरा फैलाएं।',
    'Lower to shoulder level.': 'कंधे के स्तर तक नीचे करें।',
    'Perfect press. Arms fully extended.': 'बिल्कुल सही। हाथ पूरे फैले।',
    'Engage your core. Don\'t arch back.': 'पेट कस लें। पीठ मोड़ें नहीं।',
    
    // Lateral Raise
    'Raise arms higher. To shoulder level.': 'हाथ और ऊपर उठाएं। कंधे तक।',
    'Lower slightly. Don\'t go above shoulders.': 'थोड़ा नीचे करें। कंधे से ऊपर नहीं।',
    'Perfect height. Arms parallel to floor.': 'सही ऊंचाई। हाथ जमीन के समानांतर।',
    
    // Knee Raise
    'Lift knee higher. To hip level.': 'घुटना और ऊपर उठाएं। कूल्हे तक।',
    'Lower your knee slightly.': 'घुटना थोड़ा नीचे करें।',
    'Perfect knee height. Hold balance.': 'सही ऊंचाई। संतुलन बनाएं।',
    'Focus on balance. Engage core.': 'संतुलन पर ध्यान दें। पेट कसें।',
    'Stand tall. Don\'t lean back.': 'सीधे खड़े रहें। पीछे झुकें नहीं।',
    
    // Calf Raise
    'Rise higher on your toes.': 'पंजों पर और ऊपर उठें।',
    'Good height. Hold at the top.': 'अच्छी ऊंचाई। ऊपर रुकें।',
    'Perfect calf raise. Squeeze at top.': 'बिल्कुल सही। ऊपर दबाएं।',
    
    // General
    'Slow and controlled movement.': 'धीरे और नियंत्रित गति।',
    'Slow down. Control the movement.': 'धीरे करें। गति नियंत्रित करें।',
    'First rep complete. Keep going.': 'पहला पूरा हुआ। जारी रखें।',
    'Great work.': 'बहुत अच्छा।',
    'Keep going.': 'जारी रखें।',
  };

  // Check for rep count messages
  const repMatch = text.match(/(\d+) reps? (done|completed)/);
  if (repMatch) {
    return `${repMatch[1]} बार पूरे हुए। बहुत अच्छा।`;
  }

  return translations[text] || text;
};
