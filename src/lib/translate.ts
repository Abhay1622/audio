import { SupportedLanguage } from '@/types/tts';

// Rule-based dictionary helpers for natural dialect translation between Hindi and Bhojpuri
const HINDI_TO_BHOJPURI_REPLACEMENTS: [RegExp, string][] = [
  [/(?<!\p{L})आपका स्वागत है(?!\p{L})/gu, 'राउर स्वागत बा'],
  [/(?<!\p{L})स्वागत है(?!\p{L})/gu, 'स्वागत बा'],
  [/(?<!\p{L})आप कैसे हैं(?!\p{L})/gu, 'राउर कइसन बानी'],
  [/(?<!\p{L})कैसे हैं(?!\p{L})/gu, 'कइसन बानी'],
  [/(?<!\p{L})कहाँ जा रहे हैं(?!\p{L})/gu, 'कहाँ जात बानी'],
  [/(?<!\p{L})का कर रहे हैं(?!\p{L})/gu, 'का करत बानी'],
  [/(?<!\p{L})क्या कर रहे हैं(?!\p{L})/gu, 'का करत बानी'],
  [/(?<!\p{L})बहुत अच्छा(?!\p{L})/gu, 'बहुत बढ़िया'],
  [/(?<!\p{L})बहुत अच्छी(?!\p{L})/gu, 'बहुत बढ़िया'],
  [/(?<!\p{L})आपका(?!\p{L})/gu, 'राउर'],
  [/(?<!\p{L})आपकी(?!\p{L})/gu, 'राउर'],
  [/(?<!\p{L})आपके(?!\p{L})/gu, 'राउर'],
  [/(?<!\p{L})आपको(?!\p{L})/gu, 'राउरके'],
  [/(?<!\p{L})आप(?!\p{L})/gu, 'रउआ'],
  [/(?<!\p{L})मेरा(?!\p{L})/gu, 'हमार'],
  [/(?<!\p{L})मेरी(?!\p{L})/gu, 'हमार'],
  [/(?<!\p{L})मेरे(?!\p{L})/gu, 'हमार'],
  [/(?<!\p{L})हमारा(?!\p{L})/gu, 'हमार'],
  [/(?<!\p{L})हमारी(?!\p{L})/gu, 'हमार'],
  [/(?<!\p{L})हमारे(?!\p{L})/gu, 'हमार'],
  [/(?<!\p{L})है(?!\p{L})/gu, 'बा'],
  [/(?<!\p{L})हैं(?!\p{L})/gu, 'बानी'],
  [/(?<!\p{L})था(?!\p{L})/gu, 'रहले'],
  [/(?<!\p{L})थी(?!\p{L})/gu, 'रहली'],
  [/(?<!\p{L})थे(?!\p{L})/gu, 'रहलें'],
  [/(?<!\p{L})नहीं(?!\p{L})/gu, 'ना'],
  [/(?<!\p{L})नमस्ते(?!\p{L})/gu, 'प्रणाम'],
  [/(?<!\p{L})नमस्कार(?!\p{L})/gu, 'प्रणाम'],
];

const BHOJPURI_TO_HINDI_REPLACEMENTS: [RegExp, string][] = [
  [/(?<!\p{L})राउर स्वागत बा(?!\p{L})/gu, 'आपका स्वागत है'],
  [/(?<!\p{L})स्वागत बा(?!\p{L})/gu, 'स्वागत है'],
  [/(?<!\p{L})राउर कइसन बानी(?!\p{L})/gu, 'आप कैसे हैं'],
  [/(?<!\p{L})कइसन बानी(?!\p{L})/gu, 'कैसे हैं'],
  [/(?<!\p{L})का करत बानी(?!\p{L})/gu, 'क्या कर रहे हैं'],
  [/(?<!\p{L})कहाँ जात बानी(?!\p{L})/gu, 'कहाँ जा रहे हैं'],
  [/(?<!\p{L})बहुत बढ़िया(?!\p{L})/gu, 'बहुत अच्छा'],
  [/(?<!\p{L})राउर(?!\p{L})/gu, 'आपका'],
  [/(?<!\p{L})रउआ(?!\p{L})/gu, 'आप'],
  [/(?<!\p{L})हमार(?!\p{L})/gu, 'मेरा'],
  [/(?<!\p{L})बाटे(?!\p{L})/gu, 'है'],
  [/(?<!\p{L})बा(?!\p{L})/gu, 'है'],
  [/(?<!\p{L})बानी(?!\p{L})/gu, 'हैं'],
  [/(?<!\p{L})प्रणाम(?!\p{L})/gu, 'नमस्ते'],
];

// Comprehensive Hindi whole words to natural, conversational Hinglish Roman spelling
const COMMON_HINGLISH_WORDS: Record<string, string> = {
  'नमस्ते': 'Namaste',
  'नमस्कार': 'Namaskar',
  'प्रणाम': 'Pranaam',
  'सुप्रभात': 'Suprabhat',
  'शुभ': 'shubh',
  'प्रभात': 'prabhat',
  'रात्रि': 'ratri',
  'दोपहर': 'dopahar',
  'शाम': 'shaam',
  'अलविदा': 'alvida',
  'धन्यवाद': 'dhanyavaad',
  'शुक्रिया': 'shukriya',
  'स्वागत': 'swagat',
  'आप': 'aap',
  'आपका': 'aapka',
  'आपकी': 'aapki',
  'आपके': 'aapke',
  'आपको': 'aapko',
  'तुम': 'tum',
  'तुम्हारा': 'tumhara',
  'तुम्हारी': 'tumhari',
  'तुम्हारे': 'tumhare',
  'तुम्हें': 'tumhein',
  'तू': 'tu',
  'मैं': 'main',
  'मेरा': 'mera',
  'मेरी': 'meri',
  'मेरे': 'mere',
  'मुझे': 'mujhe',
  'मुझको': 'mujhko',
  'हम': 'hum',
  'हमारा': 'hamara',
  'हमारी': 'hamari',
  'हमारे': 'hamare',
  'हमें': 'humein',
  'यह': 'yeh',
  'ये': 'ye',
  'वह': 'woh',
  'वे': 've',
  'वो': 'woh',
  'है': 'hai',
  'हैं': 'hain',
  'हो': 'ho',
  'हूँ': 'hoon',
  'हूं': 'hoon',
  'था': 'tha',
  'थी': 'thi',
  'थे': 'the',
  'बहुत': 'bahut',
  'अच्छा': 'achha',
  'अच्छी': 'achhi',
  'अच्छे': 'achhe',
  'बढ़िया': 'badhiya',
  'सुंदर': 'sundar',
  'दिन': 'din',
  'आज': 'aaj',
  'कल': 'kal',
  'परसों': 'parson',
  'कैसे': 'kaise',
  'कैसा': 'kaisa',
  'कैसी': 'kaisi',
  'कहाँ': 'kahan',
  'कहां': 'kahan',
  'क्या': 'kya',
  'क्यों': 'kyun',
  'कब': 'kab',
  'कौन': 'kaun',
  'कोई': 'koi',
  'कुछ': 'kuch',
  'नहीं': 'nahi',
  'ना': 'na',
  'हाँ': 'haan',
  'हां': 'haan',
  'में': 'mein',
  'से': 'se',
  'को': 'ko',
  'पर': 'par',
  'तक': 'tak',
  'और': 'aur',
  'लेकिन': 'lekin',
  'मगर': 'magar',
  'क्योंकि': 'kyunki',
  'ताकि': 'taaki',
  'अगर': 'agar',
  'यदि': 'yadi',
  'तो': 'to',
  'भी': 'bhi',
  'ही': 'hi',
  'दोस्त': 'dost',
  'दोस्तो': 'dosto',
  'दोस्तों': 'doston',
  'भाई': 'bhai',
  'बहिन': 'behan',
  'बहन': 'behan',
  'परिवार': 'parivaar',
  'घर': 'ghar',
  'काम': 'kaam',
  'समय': 'samay',
  'वक्त': 'waqt',
  'बात': 'baat',
  'बातें': 'baatein',
  'लोग': 'log',
  'जीवन': 'jeevan',
  'जिंदगी': 'zindagi',
  'आसान': 'aasan',
  'कठिन': 'kathin',
  'करना': 'karna',
  'करते': 'karte',
  'करती': 'karti',
  'करेंगे': 'karenge',
  'करो': 'karo',
  'करिए': 'kariye',
  'रहा': 'raha',
  'रही': 'rahi',
  'रहे': 'rahe',
  'गया': 'gaya',
  'गई': 'gayi',
  'गए': 'gaye',
  'जाना': 'jaana',
  'जाओ': 'jaao',
  'जाइए': 'jaiye',
  'आना': 'aana',
  'आओ': 'aao',
  'आइए': 'aaiye',
  'सुनो': 'suno',
  'सुनिए': 'suniye',
  'बोलो': 'bolo',
  'बोलिए': 'boliye',
  'कहो': 'kaho',
  'कहिए': 'kahiye',
  'चलो': 'chalo',
  'चलिए': 'chaliye',
  'मौसम': 'mausam',
  'पानी': 'paani',
  'खाना': 'khaana',
  'चाय': 'chai',
  'ऑडियो': 'audio',
  'वीडियो': 'video',
  'आवाज़': 'aawaaz',
  'आवाज': 'aawaaz',
  'दुनिया': 'duniya',
  'भारत': 'Bharat',
  'देश': 'desh',
  'प्यार': 'pyaar',
  'खुशी': 'khushi',
  'मज़ा': 'maza',
  'मजा': 'maza',
  'ज़रूर': 'zaroor',
  'जरूर': 'zaroor',
  'बिल्कुल': 'bilkul',
  'थोड़ा': 'thoda',
  'थोड़ी': 'thodi',
  'ज्यादा': 'zyada',
  'ज़्यादा': 'zyada',
  'कम': 'kam',
  'सही': 'sahi',
  'गलत': 'galat',
  'सच': 'sach',
  'झूठ': 'jhooth',
  'अब': 'ab',
  'जब': 'jab',
  'तब': 'tab',
  'सब': 'sab',
  'सभी': 'sabhi',
  'यहाँ': 'yahan',
  'यहां': 'yahan',
  'वहाँ': 'wahan',
  'वहां': 'wahan',
  'इधर': 'idhar',
  'उधर': 'udhar',
  'वॉइसक्राफ्ट': 'VoiceCraft',
};

/**
 * Intelligent Script and Language Detector
 */
export function detectLanguage(text: string, fallback: SupportedLanguage = 'hi'): SupportedLanguage {
  const trimmed = text.trim();
  if (!trimmed) return fallback;

  // 1. Check for Devanagari script (Hindi or Bhojpuri)
  const devanagariCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 0) {
    // Check if it has strong Bhojpuri dialect markers
    const bhojpuriMarkers = /\b(बानी|कइसन|राउर|हमार|बाटे|बा|रहली|रहले|कहाँ जात|का करत|रउआ)\b/;
    if (bhojpuriMarkers.test(trimmed)) {
      return 'bho';
    }
    return 'hi';
  }

  // 2. Text is Roman / Latin characters: Check if it's Hinglish or English
  const hinglishMarkers = /\b(aap|aapka|aapki|aapke|aapko|tum|tumhara|hum|hamara|mera|meri|mere|mujhe|kaise|kaisa|kaisi|namaste|pranam|kya|kyun|kyu|nahi|nahin|hai|hain|hoon|ho|tha|thi|the|achha|achhi|achhe|badhiya|bahut|dost|bhai|yaar|chalo|karna|karo|karenge|raha|rahi|rahe|hoga|hogi|hoge|lekin|aur|kahan|aaj|kal|shubh|suprabhat|dhanyavad|dhanyavaad|shukriya|zindagi|mausam|sahi|galat|accha|acha)\b/i;
  
  if (hinglishMarkers.test(trimmed)) {
    return 'hinglish';
  }

  // Default Roman text is English
  return 'en';
}

/**
 * High-accuracy Devanagari to Hinglish Roman Transliteration Engine
 */
export function devanagariToHinglish(text: string): string {
  if (!text || !text.trim()) return '';

  // Normalize Unicode to Canonical Composition (NFC)
  let working = text.normalize('NFC');

  // Replace common whole words with natural, conversational Roman spellings
  for (const [hindiWord, romanWord] of Object.entries(COMMON_HINGLISH_WORDS)) {
    // Delimiters include whitespace, ASCII punctuation, and Devanagari punctuation (।, ॥)
    const escaped = hindiWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(`(^|[\\s.,!?;—।॥"'()\\[\\]\\-])${escaped}(?=[\\s.,!?;—।॥"'()\\[\\]\\-]|$)`, 'g');
    working = working.replace(reg, (match, prefix) => (prefix ? prefix + romanWord : romanWord));
  }

  const consonants: Record<string, string> = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
    'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya',
    // Nukta letters
    'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'फ़': 'f', 'ड़': 'd', 'ढ़': 'dh'
  };

  const vowels: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
  };

  const matras: Record<string, string> = {
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
  };

  const virama = '्';
  const anusvara = 'ं';
  const chandrabindu = 'ँ';
  const visarga = 'ः';
  const nukta = '़';

  let res = '';
  const len = working.length;
  for (let i = 0; i < len; i++) {
    const ch = working[i];

    if (vowels[ch]) {
      res += vowels[ch];
    } else if (consonants[ch]) {
      let cons = consonants[ch];
      let nextIdx = i + 1;

      // Check if next character is a nukta
      if (working[nextIdx] === nukta) {
        if (ch === 'क') cons = 'q';
        else if (ch === 'ख') cons = 'kh';
        else if (ch === 'ग') cons = 'gh';
        else if (ch === 'ज') cons = 'z';
        else if (ch === 'फ') cons = 'f';
        else if (ch === 'ड') cons = 'd';
        else if (ch === 'ढ') cons = 'dh';
        i++;
        nextIdx++;
      }

      const next = working[nextIdx];
      if (next === virama) {
        res += cons;
        i = nextIdx; // skip virama
      } else if (matras[next]) {
        res += cons + matras[next];
        i = nextIdx; // skip matra
      } else if (consonants[next] || vowels[next] || /[\s.,!?।॥—"']/.test(next) || nextIdx >= len) {
        // Schwa deletion rule at word boundary or punctuation
        const isEndOfWord = (nextIdx >= len) || /[\s.,!?।॥—"']/.test(next);
        res += cons + (isEndOfWord ? '' : 'a');
      } else {
        res += cons + 'a';
      }
    } else if (ch === anusvara || ch === chandrabindu) {
      res += 'n';
    } else if (ch === visarga) {
      res += 'h';
    } else if (ch === '।' || ch === '॥') {
      res += '.';
    } else {
      res += ch;
    }
  }

  // Format sentence capitalization cleanly
  return res
    .replace(/\s+/g, ' ')
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
    .trim();
}

/**
 * Primary Free Google GTX Translation Engine
 * Highly reliable, fast (<300ms), no restrictive quota, handles complete paragraphs
 */
async function fetchGoogleGTX(text: string, sl: string, tl: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0]
        .map((segment: unknown[]) => (Array.isArray(segment) && typeof segment[0] === 'string' ? segment[0] : ''))
        .join('');
      return translated ? decodeHtmlEntities(translated) : null;
    }
  } catch (err) {
    console.warn(`Google GTX translation (${sl}->${tl}) warning:`, err);
  }
  return null;
}

/**
 * Reverse map from Roman Hinglish word to Devanagari Hindi
 */
const HINGLISH_TO_DEVANAGARI: Record<string, string> = {};
for (const [hindi, roman] of Object.entries(COMMON_HINGLISH_WORDS)) {
  HINGLISH_TO_DEVANAGARI[roman.toLowerCase()] = hindi;
}

export function hinglishToDevanagari(text: string): string {
  if (!text || !text.trim()) return '';
  return text
    .split(/(\s+|[.,!?;—"'])/)
    .map((token) => {
      const lower = token.toLowerCase();
      return HINGLISH_TO_DEVANAGARI[lower] || token;
    })
    .join('');
}

/**
 * Secondary Fallback: MyMemory API
 */
async function fetchMyMemory(text: string, sl: string, tl: string): Promise<string | null> {
  try {
    const langpair = `${sl}|${tl}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.responseData?.translatedText) {
      const translation = data.responseData.translatedText;
      if (
        !translation.startsWith('MYMEMORY WARNING:') &&
        !translation.includes('IS AN INVALID SOURCE LANGUAGE') &&
        !translation.includes('IS AN INVALID TARGET LANGUAGE')
      ) {
        return decodeHtmlEntities(translation);
      }
    }
  } catch {
    // Ignore fallback failures
  }
  return null;
}

/**
 * Unified Translation Helper with multi-tier fallback (Google GTX -> MyMemory)
 */
async function translateText(text: string, sl: string, tl: string): Promise<string | null> {
  const safeSl = sl === 'auto' ? (detectLanguage(text) === 'en' ? 'en' : 'hi') : sl;

  // 1. Try Google GTX
  const gtxResult = await fetchGoogleGTX(text, safeSl, tl);
  if (gtxResult && gtxResult.trim()) return gtxResult.trim();

  // 2. Try MyMemory
  const myMemResult = await fetchMyMemory(text, safeSl, tl);
  if (myMemResult && myMemResult.trim()) return myMemResult.trim();

  return null;
}

/**
 * Decode common HTML entities returned by translation APIs
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/**
 * Apply rule-based regex dictionary replacements
 */
function applyReplacements(input: string, rules: [RegExp, string][]): string {
  let result = input;
  for (const [regex, replacement] of rules) {
    result = result.replace(regex, replacement);
  }
  return result;
}

/**
 * Translate to all 4 supported languages in parallel with intelligent detection
 */
export async function translateAllLanguages(
  text: string,
  hintedSourceLang: SupportedLanguage = 'hi'
): Promise<{
  translations: Record<SupportedLanguage, string>;
  detectedSource: SupportedLanguage;
}> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      translations: { hi: '', bho: '', hinglish: '', en: '' },
      detectedSource: hintedSourceLang,
    };
  }

  // 1. Automatically detect what language was actually pasted or typed
  const detected = detectLanguage(trimmed, hintedSourceLang);

  const translations: Record<SupportedLanguage, string> = {
    hi: '',
    bho: '',
    hinglish: '',
    en: '',
  };

  // 2. Translate based on the detected source language
  if (detected === 'en') {
    // Source is English
    translations.en = trimmed;

    // Translate English -> Hindi
    const hiText = await translateText(trimmed, 'en', 'hi');
    translations.hi = hiText || trimmed;

    // Convert Hindi -> Hinglish (Authentic conversational Roman Hindi!)
    translations.hinglish = devanagariToHinglish(translations.hi);

    // Convert Hindi -> Bhojpuri
    translations.bho = applyReplacements(translations.hi, HINDI_TO_BHOJPURI_REPLACEMENTS);
  } else if (detected === 'hi') {
    // Source is Hindi (Devanagari)
    translations.hi = trimmed;

    // Direct transliteration to Hinglish
    translations.hinglish = devanagariToHinglish(trimmed);

    // Convert Hindi -> Bhojpuri
    translations.bho = applyReplacements(trimmed, HINDI_TO_BHOJPURI_REPLACEMENTS);

    // Translate Hindi -> English
    const enText = await translateText(trimmed, 'hi', 'en');
    translations.en = enText || trimmed;
  } else if (detected === 'bho') {
    // Source is Bhojpuri
    translations.bho = trimmed;

    // Convert Bhojpuri -> Hindi
    const hiText = applyReplacements(trimmed, BHOJPURI_TO_HINDI_REPLACEMENTS);
    translations.hi = hiText;

    // Transliterate to Hinglish
    translations.hinglish = devanagariToHinglish(hiText);

    // Translate Hindi -> English
    const enText = await translateText(hiText, 'hi', 'en');
    translations.en = enText || trimmed;
  } else if (detected === 'hinglish') {
    // Source is Hinglish (Roman Hindi)
    translations.hinglish = trimmed;

    // Convert Hinglish Roman words to Hindi Devanagari
    const convertedHindi = hinglishToDevanagari(trimmed);
    translations.hi = convertedHindi;

    // Translate converted Hindi -> English
    const enText = await translateText(convertedHindi, 'hi', 'en');
    translations.en = enText || trimmed;

    // Derive Bhojpuri from Hindi
    translations.bho = applyReplacements(convertedHindi, HINDI_TO_BHOJPURI_REPLACEMENTS);
  }

  return {
    translations,
    detectedSource: detected,
  };
}

/**
 * Single translation helper for backwards compatibility
 */
export async function translateSingle(
  text: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage
): Promise<string> {
  const result = await translateAllLanguages(text, sourceLang);
  return result.translations[targetLang] || text;
}
