import * as Speech from "expo-speech";
import { useCallback, useState, useEffect } from "react";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        setIsAvailable(voices.length > 0);
      } catch (error) {
        console.warn("Speech not available:", error);
        setIsAvailable(false);
      }
    };
    checkAvailability();
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isAvailable || isSpeaking) return;

      setIsSpeaking(true);
      Speech.speak(text, {
        language: "th-TH",
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("Speech error:", error);
          setIsSpeaking(false);
        },
      });
    },
    [isSpeaking, isAvailable],
  );

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, isAvailable };
}
