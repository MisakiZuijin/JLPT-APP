"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type SpeechRecResultItem = { transcript: string };
type SpeechRecResult = { 0: SpeechRecResultItem; isFinal: boolean };
type SpeechRecEvent = { results: ArrayLike<SpeechRecResult> };
type SpeechRecErrorEvent = { error: string };

interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((ev: SpeechRecEvent) => void) | null;
  onerror: ((ev: SpeechRecErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecConstructor(): SpeechRecConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecConstructor;
    webkitSpeechRecognition?: SpeechRecConstructor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function useSpeechPractice(onFinalTranscript?: (text: string) => void) {
  const speechSupported = useSyncExternalStore(
    () => () => {},
    () => Boolean(getSpeechRecConstructor()),
    () => false,
  );

  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      recRef.current?.abort();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      stopTracks();
    };
  }, [stopTracks]);

  const stopRecording = useCallback(() => {
    recRef.current?.stop();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    stopTracks();
    setListening(false);
  }, [stopTracks]);

  const startRecording = useCallback(async () => {
    const SpeechRec = getSpeechRecConstructor();
    if (!SpeechRec) {
      setMicError(
        "Browser ini belum mendukung pengenalan suara otomatis. Gunakan Chrome/Edge atau ketik transkrip latihan di bawah.",
      );
      return;
    }

    setMicError(null);
    setInterimText("");
    finalRef.current = "";

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        if (typeof MediaRecorder !== "undefined") {
          const recorder = new MediaRecorder(stream);
          const chunks: BlobPart[] = [];
          recorder.ondataavailable = (ev) => {
            if (ev.data.size > 0) chunks.push(ev.data);
          };
          recorder.onstop = () => {
            if (chunks.length > 0) {
              const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
              const nextUrl = URL.createObjectURL(blob);
              setAudioUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return nextUrl;
              });
            }
          };
          mediaRecorderRef.current = recorder;
          recorder.start();
        }
      }
    } catch {
      setMicError(
        "Izin mikrofon ditolak atau perangkat audio tidak tersedia. Kamu tetap bisa menguji transkrip manual di bawah.",
      );
      return;
    }

    const rec = new SpeechRec();
    rec.lang = "ja-JP";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (event) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i]?.[0]?.transcript ?? "";
      }
      finalRef.current = combined.trim();
      setInterimText(combined.trim());
    };

    rec.onerror = (ev) => {
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        setMicError("Akses mikrofon diblokir oleh browser.");
      } else if (ev.error === "no-speech") {
        setMicError("Suara tidak terdeteksi. Coba ucapkan lebih dekat ke mikrofon.");
      } else {
        setMicError(`Gagal memproses suara (${ev.error}).`);
      }
    };

    rec.onend = () => {
      setListening(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      stopTracks();
      if (finalRef.current) {
        onFinalRef.current?.(finalRef.current);
      }
    };

    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [stopTracks]);

  return {
    speechSupported,
    listening,
    interimText,
    micError,
    audioUrl,
    startRecording,
    stopRecording,
    clearMicError: () => setMicError(null),
  };
}
