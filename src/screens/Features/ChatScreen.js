import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';
import { sendChatMessage } from '../../services/aiService';
import { ArrowLeft, Send, Bot } from 'lucide-react-native';

const ChatScreen = ({ navigation }) => {
  const { userProfile } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    { 
      id: '1', 
      role: 'model', 
      text: `Hello ${userProfile.name || 'Traveler'}. 🌿 \nI'm here to listen. How's your day going? `
    }
  ]);

  const flatListRef = useRef();

  const suggestions = [
   "I feel overwhelmed 😫",
   "I have no energy 🔋",
   "I just need to vent 🗣️",
   "Give me a quick tip 💡"
  ];

  const handleSend = async (textToSend) => {
    const msgContent = textToSend || message;
    if (msgContent.trim() === '') return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: msgContent };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    const aiResponseText = await sendChatMessage([...chatHistory, userMsg], userProfile);

    const aiMsg = { id: (Date.now() + 1).toString(), role: 'model', text: aiResponseText };
    setChatHistory(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, isLoading]);

  const renderItem = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!isUser && <Bot color="#6366F1" size={16} style={{marginBottom:5}}/>}
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#000000']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ArrowLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Friendly Chat</Text>
            <Text style={styles.headerStatus}>● Online</Text>
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={isLoading && (
            <View style={{marginLeft: 20, marginTop: 10}}>
                <Text style={{fontSize: 12, color: '#94A3B8', fontStyle: 'italic'}}>Writing...</Text>
            </View>
          )}
        />

        {/* Chips */}
        {!isLoading && (
          <View style={{height: 50}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 15}}>
              {suggestions.map((sug, index) => (
                <TouchableOpacity key={index} style={styles.chip} onPress={() => handleSend(sug)}>
                  <Text style={styles.chipText}>{sug}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write here..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity 
              style={[styles.sendBtn, { backgroundColor: message ? '#6366F1' : '#334155' }]} 
              onPress={() => handleSend()}
              disabled={!message || isLoading}
            >
              <Send color="white" size={20} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#334155', gap: 15 },
  iconBtn: { padding: 10, backgroundColor: '#1E293B', borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  headerTitle: { fontWeight: 'bold', fontSize: 18, color: '#FFF' },
  headerStatus: { fontSize: 12, color: '#10B981' }, 
  
  listContent: { padding: 15, paddingBottom: 20 },
  
  bubble: { maxWidth: '80%', padding: 14, borderRadius: 20, marginBottom: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6366F1', borderBottomRightRadius: 4 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#1E293B', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#334155' },
  
  bubbleText: { fontSize: 16, lineHeight: 22 },
  userText: { color: '#FFF' },
  botText: { color: '#E2E8F0' },
  
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#334155', alignItems: 'center', gap: 10 },
  
  // ✅ ESTILO INPUT FORZADO A OSCURO
  input: { 
      flex: 1, 
      backgroundColor: '#0F172A', // Fondo oscuro
      borderRadius: 24, 
      paddingHorizontal: 20, 
      paddingVertical: 12, 
      fontSize: 16, 
      color: '#FFFFFF', // Texto Blanco
      borderWidth: 1,
      borderColor: '#334155'
  },
  
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  
  chip: { 
      backgroundColor: '#1E293B', 
      paddingHorizontal: 16, 
      paddingVertical: 8, 
      borderRadius: 20, 
      marginRight: 8, 
      borderWidth: 1, 
      borderColor: '#334155' 
  },
  chipText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 }
});

export default ChatScreen;