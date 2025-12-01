import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isOpen]);

  const loadUserData = async () => {
    try {
      const savedName = await AsyncStorage.getItem('abDeliveriesUserName');
      const savedPhone = await AsyncStorage.getItem('abDeliveriesUserPhone');
      
      if (savedName && savedPhone) {
        setUserName(savedName);
        setUserPhone(savedPhone);
        setIsSetup(true);
        setMessages([
          {
            role: 'assistant',
            content: `שלום ${savedName}! איך אפשר לעזור לך היום? 😊`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSetup = async () => {
    if (userName.trim() && userPhone.trim()) {
      try {
        await AsyncStorage.setItem('abDeliveriesUserName', userName);
        await AsyncStorage.setItem('abDeliveriesUserPhone', userPhone);
        setIsSetup(true);
        setMessages([
          {
            role: 'assistant',
            content: `שלום ${userName}! איך אפשר לעזור לך היום? 😊`,
          },
        ]);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      
      // Android Emulator: http://10.0.2.2:4000
      // iOS Simulator: http://localhost:4000
      //  http://YOUR_COMPUTER_IP:4000
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      
      const response = await fetch('https://registration-bot-node-bfb7g2gscyghg4gc.israelcentral-01.azurewebsites.net/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          phone: userPhone,
          message: userMessage,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'מצטער, אירעה שגיאה. אנא נסה שוב מאוחר יותר.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'החיבור לשרת נכשל (timeout). בדוק שהשרת רץ ושהכתובת נכונה.';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'לא ניתן להתחבר לשרת. בדוק את החיבור לאינטרנט והגדרות הרשת.';
        }
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = async () => {
    try {
      await AsyncStorage.removeItem('abDeliveriesUserName');
      await AsyncStorage.removeItem('abDeliveriesUserPhone');
      setUserName('');
      setUserPhone('');
      setIsSetup(false);
      setMessages([]);
    } catch (error) {
      console.error('Error resetting chat:', error);
    }
  };

  const toggleChat = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setIsOpen(!isOpen);
  };

  const setQuickMessage = (message: string) => {
    setInput(message);
  };

  return (
    <>
      {/* כפתור פתיחת הצ'אט */}
      <Animated.View style={[styles.chatButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={toggleChat}
          style={[styles.chatButtonInner, isOpen && styles.chatButtonOpen]}
        >
          <Text style={styles.chatButtonText}>{isOpen ? '✕' : '💬'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* חלון הצ'אט */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.chatWindow}>
            {/* כותרת */}
            <View style={styles.chatHeader}>
              <View>
                <Text style={styles.headerTitle}>A.B Deliveries</Text>
                <Text style={styles.headerSubtitle}>נציג וירטואלי</Text>
              </View>
              <View style={styles.headerButtons}>
                {isSetup && (
                  <TouchableOpacity onPress={resetChat} style={styles.resetButton}>
                    <Text style={styles.resetButtonText}>🔄</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* תוכן */}
            {!isSetup ? (
              // מסך הגדרה
              <View style={styles.setupContainer}>
                <Text style={styles.setupIcon}>👋</Text>
                <Text style={styles.setupTitle}>שלום! נעים להכיר</Text>
                <Text style={styles.setupSubtitle}>בואו נתחיל - ספרו לי מי אתם:</Text>
                
                <TextInput
                  style={styles.setupInput}
                  placeholder="שם מלא"
                  value={userName}
                  onChangeText={setUserName}
                  textAlign="right"
                />
                
                <TextInput
                  style={styles.setupInput}
                  placeholder="מספר טלפון (050-1234567)"
                  value={userPhone}
                  onChangeText={setUserPhone}
                  keyboardType="phone-pad"
                  textAlign="right"
                />
                
                <TouchableOpacity
                  style={styles.setupButton}
                  onPress={handleSetup}
                  disabled={!userName.trim() || !userPhone.trim()}
                >
                  <Text style={styles.setupButtonText}>התחל שיחה</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* הודעות */}
                <ScrollView
                  ref={scrollViewRef}
                  style={styles.messagesContainer}
                  contentContainerStyle={styles.messagesContent}
                  onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                  }
                >
                  {messages.map((msg, index) => (
                    <View
                      key={index}
                      style={[
                        styles.messageWrapper,
                        msg.role === 'user'
                          ? styles.messageWrapperUser
                          : styles.messageWrapperAssistant,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          msg.role === 'user'
                            ? styles.messageBubbleUser
                            : styles.messageBubbleAssistant,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            msg.role === 'user'
                              ? styles.messageTextUser
                              : styles.messageTextAssistant,
                          ]}
                        >
                          {msg.content}
                        </Text>
                      </View>
                    </View>
                  ))}
                  
                  {isTyping && (
                    <View style={styles.messageWrapperAssistant}>
                      <View style={styles.messageBubbleAssistant}>
                        <View style={styles.typingIndicator}>
                          <View style={styles.typingDot} />
                          <View style={styles.typingDot} />
                          <View style={styles.typingDot} />
                        </View>
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* כפתורים מהירים */}
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickMessage('אני רוצה לבדוק משלוח')}
                  >
                    <Text style={styles.quickButtonText}>📦 בדיקת משלוח</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => setQuickMessage('מה המחיר למשלוח?')}
                  >
                    <Text style={styles.quickButtonText}>💰 מחירון</Text>
                  </TouchableOpacity>
                </View>

                {/* אזור הקלדה */}
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={[styles.sendButton, (!input.trim() || isTyping) && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!input.trim() || isTyping}
                  >
                    <Text style={styles.sendButtonText}>↵</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    placeholder="הקלד הודעה..."
                    value={input}
                    onChangeText={setInput}
                    multiline
                    textAlign="right"
                    editable={!isTyping}
                  />
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  chatButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  chatButtonOpen: {
    backgroundColor: '#e74c3c',
  },
  chatButtonText: {
    fontSize: 28,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatWindow: {
    backgroundColor: 'white',
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  chatHeader: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  resetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  setupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  setupIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  setupTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2b3a55',
    marginBottom: 10,
  },
  setupSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  setupInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    marginBottom: 15,
    backgroundColor: '#f9fafb',
  },
  setupButton: {
    width: '100%',
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  setupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesContent: {
    padding: 15,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  messageWrapperUser: {
    alignItems: 'flex-end',
  },
  messageWrapperAssistant: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#4a90e2',
    borderTopRightRadius: 4,
  },
  messageBubbleAssistant: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: 'white',
  },
  messageTextAssistant: {
    color: '#2b3a55',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 5,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: 'white',
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});

