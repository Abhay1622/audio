import { SupportedLanguage } from '@/types/tts';

// Rule-based dictionary helpers for fallback / refinement between Hindi and Bhojpuri
const HINDI_TO_BHOJPURI_REPLACEMENTS: [RegExp, string][] = [
  [/\bआपका स्वागत है\b/gi, 'राउर स्वागत बा'],
  [/\bस्वागत है\b/gi, 'स्वागत बा'],
  [/\bआप कैसे हैं\b/gi, 'राउर कइसन बानी'],
  [/\bकैसे हैं\b/gi, 'कइसन बानी'],
  [/\bकहाँ जा रहे हैं\b/gi, 'कहाँ जात बानी'],
  [/\bक्या कर रहे हैं\b/gi, 'का करत बानी'],
  [/\bबहुत अच्छा\b/gi, 'बहुत बढ़िया'],
  [/\bआपका\b/gi, 'राउर'],
  [/\bआपके\b/gi, 'राउर'],
  [/\bआपको\b/gi, 'राउरके'],
  [/\bमेरा\b/gi, 'हमार'],
  [/\bमेरी\b/gi, 'हमार'],
  [/\bमेरे\b/gi, 'हमार'],
  [/\bहमारा\b/gi, 'हमार'],
  [/\bहै\b/g, 'बा'],
  [/\bहैं\b/g, 'बानी'],
  [/\bथा\b/g, 'रहले'],
  [/\bथी\b/g, 'रहली'],
  [/\bथे\b/g, 'रहलें'],
  [/\bनहीं\b/g, 'ना'],
  [/\bनमस्ते\b/gi, 'प्रणाम'],
  [/\bनमस्कार\b/gi, 'प्रणाम'],
];

const BHOJPURI_TO_HINDI_REPLACEMENTS: [RegExp, string][] = [
  [/\bराउर स्वागत बा\b/gi, 'आपका स्वागत है'],
  [/\bस्वागत बा\b/gi, 'स्वागत है'],
  [/\bराउर कइसन बानी\b/gi, 'आप कैसे हैं'],
  [/\bकइसन बानी\b/gi, 'कैसे हैं'],
  [/\bबहुत बढ़िया\b/gi, 'बहुत अच्छा'],
  [/\bराउर\b/gi, 'आपका'],
  [/\bहमार\b/gi, 'मेरा'],
  [/\bबाटे\b/g, 'है'],
  [/\bबा\b/g, 'है'],
  [/\bबानी\b/g, 'हैं'],
  [/\bप्रणाम\b/gi, 'नमस्ते'],
];

export async function translateSingle(
  text: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || sourceLang === targetLang) {
    return trimmed;
  }

  // Quick fallback if offline / for direct Hindi <-> Bhojpuri transformation
  if (sourceLang === 'hi' && targetLang === 'bho') {
    try {
      const apiResult = await fetchMyMemory(trimmed, 'hi', 'bho');
      if (apiResult) return apiResult;
    } catch {
      // Use phonetic / dialect rule replacement
    }
    return applyReplacements(trimmed, HINDI_TO_BHOJPURI_REPLACEMENTS);
  }

  if (sourceLang === 'bho' && targetLang === 'hi') {
    try {
      const apiResult = await fetchMyMemory(trimmed, 'bho', 'hi');
      if (apiResult) return apiResult;
    } catch {
      // Use reverse replacement
    }
    return applyReplacements(trimmed, BHOJPURI_TO_HINDI_REPLACEMENTS);
  }

  // English <-> Hindi or English <-> Bhojpuri
  try {
    const apiResult = await fetchMyMemory(trimmed, sourceLang, targetLang);
    if (apiResult) return apiResult;
  } catch (err) {
    console.warn(`Translation from ${sourceLang} to ${targetLang} failed:`, err);
  }

  // If Bhojpuri target and English source, try translating to Hindi first, then refine to Bhojpuri
  if (sourceLang === 'en' && targetLang === 'bho') {
    try {
      const hiText = await fetchMyMemory(trimmed, 'en', 'hi');
      if (hiText) {
        return applyReplacements(hiText, HINDI_TO_BHOJPURI_REPLACEMENTS);
      }
    } catch {
      // Fallback
    }
  }

  return trimmed;
}

async function fetchMyMemory(text: string, sl: string, tl: string): Promise<string | null> {
  const langpair = `${sl}|${tl}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    // 6 second timeout
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (data?.responseData?.translatedText) {
    const translation = data.responseData.translatedText;
    // Check if result is not an error string
    if (!translation.startsWith('MYMEMORY WARNING:')) {
      return translation;
    }
  }

  return null;
}

function applyReplacements(input: string, rules: [RegExp, string][]): string {
  let result = input;
  for (const [regex, replacement] of rules) {
    result = result.replace(regex, replacement);
  }
  return result;
}
