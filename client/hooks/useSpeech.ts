import * as Speech from "expo-speech";
import { useCallback, useState, useEffect } from "react";
import { Platform, Alert } from "react-native";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasThaiVoice, setHasThaiVoice] = useState<boolean | null>(null);

  useEffect(() => {
    const checkVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        const thaiVoice = voices.find(v => 
          v.language.startsWith("th") || 
          v.language.toLowerCase().includes("thai")
        );
        setHasThaiVoice(!!thaiVoice);
      } catch {
        setHasThaiVoice(false);
      }
    };
    checkVoices();
  }, []);

  const speak = useCallback(async (text: string, options?: { rate?: number }) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      const isSpeechAvailable = await Speech.isSpeakingAsync().catch(() => false);
      
      if (Platform.OS === "web" && hasThaiVoice === false) {
        Alert.alert(
          "Thai Voice Not Available",
          "Your browser doesn't have a Thai voice installed. For the best experience, use the Expo Go app on your phone.",
          [{ text: "OK" }]
        );
        return;
      }

      setIsSpeaking(true);
      
      Speech.speak(text, {
        language: "th-TH",
        rate: options?.rate ?? 0.8,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: (error) => {
          console.log("Speech error:", error);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.log("Speech initialization error:", error);
      setIsSpeaking(false);
    }
  }, [isSpeaking, hasThaiVoice]);

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, hasThaiVoice };
}
