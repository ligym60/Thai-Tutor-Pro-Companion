import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { saveUserProfile } from "@/lib/storage";

interface LanguagePickerProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onLanguageChange?: (language: string) => void;
}

export function LanguagePicker({
  visible,
  onClose,
  currentLanguage,
  onLanguageChange,
}: LanguagePickerProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    await i18n.changeLanguage(languageCode);
    await saveUserProfile({ language: languageCode });
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{i18n.t("settings:selectLanguage")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageTextContainer}>
                  <Text style={styles.languageNativeName}>{language.nativeName}</Text>
                  <Text style={styles.languageName}>{language.name}</Text>
                </View>
                {selectedLanguage === language.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 30,
    color: "#666",
    fontWeight: "300",
  },
  languageList: {
    padding: 10,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
  },
  selectedLanguageItem: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#2196f3",
  },
  languageFlag: {
    fontSize: 30,
    marginRight: 15,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageNativeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  languageName: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  checkmark: {
    fontSize: 24,
    color: "#2196f3",
    fontWeight: "bold",
  },
});
