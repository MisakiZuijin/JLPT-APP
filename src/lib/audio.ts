export type SpeechRate = 0.75 | 0.85 | 1.0;

const RATE_STORAGE_KEY = "jlpt-speech-rate";
const RATE_EVENT = "jlpt-speech-rate-change";

export function readSpeechRate(): SpeechRate {
  if (typeof window === "undefined") return 0.85;
  try {
    const raw = localStorage.getItem(RATE_STORAGE_KEY);
    if (raw === "0.75") return 0.75;
    if (raw === "1" || raw === "1.0") return 1.0;
    if (raw === "0.85") return 0.85;
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
  return 0.85;
}

export function saveSpeechRate(rate: SpeechRate): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RATE_STORAGE_KEY, String(rate));
  } catch {
    // Abaikan jika storage diblokir
  }
  window.dispatchEvent(new Event(RATE_EVENT));
}

export function subscribeSpeechRate(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(RATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(RATE_EVENT, callback);
  };
}

export function speakJapanese(text: string, rateOverride?: SpeechRate): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = rateOverride ?? readSpeechRate();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
