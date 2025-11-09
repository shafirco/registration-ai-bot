import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import ChatBot from "../../components/ChatBot";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function App() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "נא למלא את כל השדות",
      });
      return;
    }

    try {
      const res = await fetch("http://10.0.0.5:5000/register", {
        // ⚠️ Android Emulator = 10.0.2.2
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: data.ai_message || "נרשמת בהצלחה!",
        });
        setForm({ name: "", email: "", password: "" });
      } else {
        Toast.show({
          type: "error",
          text1: data.detail || "שגיאה בהרשמה",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "שרת לא זמין",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>צור חשבון חדש</Text>

        <TextInput
          placeholder="שם מלא"
          style={styles.input}
          value={form.name}
          onChangeText={(v) => handleChange("name", v)}
        />

        <TextInput
          placeholder="אימייל"
          style={styles.input}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />

        <TextInput
          placeholder="סיסמה"
          style={styles.input}
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>הרשמה</Text>
        </TouchableOpacity>
      </View>

      <Toast />
      <ChatBot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "85%",
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    color: "#2b3a55",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f7f9fb",
    borderWidth: 1,
    borderColor: "#cfd8dc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
