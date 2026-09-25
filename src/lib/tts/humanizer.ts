import { SupportedLanguage } from '@/types/tts';

export type SpeakingEmotion =
  | 'natural'
  | 'cheerful'
  | 'storyteller'
  | 'empathetic'
  | 'formal'
  | 'whispering';

export interface EmotionProfile {
  id: SpeakingEmotion;
  label: string;
  icon: string;
  description: string;
  pitchOffset: number; // in Hz
  speedMultiplier: number;
}

export const EMOTION_PROFILES: Record<SpeakingEmotion, EmotionProfile> = {
  natural: {
    id: 'natural',
    label: 'Natural Human',
    icon: '🌟',
    description: 'Balanced, conversational tone with natural breath pauses',
    pitchOffset: 0,
    speedMultiplier: 1.0,
  },
  cheerful: {
    id: 'cheerful',
    label: 'Cheerful & Excited',
    icon: '🎉',
    description: 'Bright, energetic delivery with enthusiastic cadence',
    pitchOffset: 8,
    speedMultiplier: 1.06,
  },
  storyteller: {
    id: 'storyteller',
    label: 'Storyteller & Dramatic',
    icon: '📖',
    description: 'Deeper voice with deliberate, suspenseful dramatic pauses',
    pitchOffset: -10,
    speedMultiplier: 0.88,
  },
  empathetic: {
    id: 'empathetic',
    label: 'Calm & Empathetic',
    icon: '🧘',
    description: 'Gentle, soothing tempo ideal for warm, reassuring speech',
    pitchOffset: -4,
    speedMultiplier: 0.84,
  },
  formal: {
    id: 'formal',
    label: 'News & Professional',
    icon: '🎙️',
    description: 'Crisp, articulate broadcast tone with authoritative rhythm',
    pitchOffset: 2,
    speedMultiplier: 1.04,
  },
  whispering: {
    id: 'whispering',
    label: 'Soft & Intimate',
    icon: '🤫',
    description: 'Quiet, relaxed, close-mic vocal presence',
    pitchOffset: -6,
    speedMultiplier: 0.82,
  },
};

/**
 * Humanize text by inserting natural breath marks, clause cadence, and pauses.
 * Prevents the synthesizer from rattling off text like a robot without breathing.
 */
export function humanizeSpeechText(
  text: string,
  language: SupportedLanguage,
  emotion: SpeakingEmotion = 'natural'
): string {
  if (!text || text.trim().length === 0) return '';

  let cleaned = text.trim();

  // 1. Standardize existing punctuation spacing
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\s*([,।\.?!—])\s*/g, '$1 ')
    .replace(/\.{3,}/g, '... ');

  // 2. Hindi & Bhojpuri cadence enhancements
  if (language === 'hi' || language === 'bho') {
    // Add natural clause pauses after conjunctions if not already punctuated
    const hindiConjunctions = [
      'और',
      'लेकिन',
      'परन्तु',
      'किन्तु',
      'क्योंकि',
      'इसलिए',
      'जैसे',
      'दरअसल',
      'सचमुच',
      'बाकी',
    ];
    for (const conj of hindiConjunctions) {
      const regex = new RegExp(`(?<![,।!?.—])\\s+(${conj})\\s+`, 'g');
      cleaned = cleaned.replace(regex, `, $1 `);
    }

    // Add breathing pause after introductory greetings
    cleaned = cleaned.replace(/\b(नमस्ते|नमस्कार|प्रणाम|हैलो|जय श्री राम|सुप्रभात)\b(?![!।,])/gi, '$1!...');

    // Ensure sentence ending has proper Hindi Purna Viram if no ending punctuation exists
    if (!/[।!?.]$/.test(cleaned.trim())) {
      cleaned = cleaned.trim() + '।';
    }
  } else {
    // 3. English cadence enhancements
    const englishConjunctions = [
      'and',
      'but',
      'however',
      'because',
      'therefore',
      'furthermore',
      'meanwhile',
      'actually',
      'in fact',
    ];
    for (const conj of englishConjunctions) {
      const regex = new RegExp(`(?<![,!?.—])\\s+(${conj})\\s+`, 'gi');
      cleaned = cleaned.replace(regex, `, $1 `);
    }

    // Add breathing pause after introductory greetings
    cleaned = cleaned.replace(/\b(hello|hi there|welcome|good morning|hey)\b(?![!,])/gi, '$1!...');

    // Ensure sentence ending punctuation
    if (!/[!?.]$/.test(cleaned.trim())) {
      cleaned = cleaned.trim() + '.';
    }
  }

  // 4. Emotional punctuation adjustments
  if (emotion === 'cheerful') {
    // Add enthusiastic exclamation marks to upbeat sentences
    cleaned = cleaned.replace(/([।\.])(?=\s|$)/g, '!');
  } else if (emotion === 'storyteller') {
    // Add dramatic suspenseful breath pauses
    cleaned = cleaned.replace(/,\s+/g, '... ').replace(/([।\.])\s+/g, '$1 — ');
  } else if (emotion === 'empathetic' || emotion === 'whispering') {
    // Gentle soft pauses
    cleaned = cleaned.replace(/([।\.])\s+/g, '... ');
  }

  // Clean up any double spaces or duplicate punctuation
  return cleaned
    .replace(/\s+/g, ' ')
    .replace(/([!।\.?]){2,}/g, '$1')
    .trim();
}
