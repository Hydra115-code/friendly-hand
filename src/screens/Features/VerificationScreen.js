import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView, Animated, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av'; // Importar Audio

import { UserContext } from '../../context/UserContext';
import { verifyTaskWithVision } from '../../services/aiService';
// Importamos solo lo estructural de theme, los colores los forzamos para el look espacial
import { spacing, shadows } from '../../config/theme';
import { Camera, ArrowLeft, CheckCircle, XCircle, Sparkles } from 'lucide-react-native';

const VerificationScreen = ({ navigation, route }) => {
  const { dailyPlan, markTaskCompleted } = useContext(UserContext);
  const [selectedTask, setSelectedTask] = useState(null);
  const [photo, setPhoto] = useState(null); 
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [sound, setSound] = useState();

  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.8)).current;

  // 1. CARGAR SONIDO (Ruta Corregida)
  useEffect(() => {
    async function loadSound() {
        try {
            // CORRECCIÓN: Ajustamos la ruta relativa a src/screens/Features/
            const { sound } = await Audio.Sound.createAsync( require('../../assets/sounds/success.mp3') );
            setSound(sound);
        } catch (error) { 
            console.log("Sound error (ignoring for demo):", error); 
        }
    }
    loadSound();
    return () => sound ? sound.unloadAsync() : undefined;
  }, []);

  useEffect(() => {
      if (route.params?.taskToVerify) {
          setSelectedTask(route.params.taskToVerify);
      }
  }, [route.params]);

  const triggerSuccess = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (sound) try { await sound.replayAsync(); } catch(e) {}

    Animated.parallel([
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1, friction: 5, useNativeDriver: true })
    ]).start();

    markTaskCompleted(selectedTask.id);
    setTimeout(() => { navigation.navigate('Dashboard'); }, 2500); 
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) { Alert.alert("Permission", "I need vision!"); return; }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true, 
    });
    if (!result.canceled) { setPhoto(result.assets[0]); }
  };

  const handleVerify = async () => {
    if (!photo || !selectedTask) return;
    setVerifying(true);
    const aiResponse = await verifyTaskWithVision(photo.base64, selectedTask.title);
    setVerifying(false);
    setResult(aiResponse);
    if (aiResponse.approved) { triggerSuccess(); } else { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); }
  };

  const reset = () => { setPhoto(null); setResult(null); };

  // COLORES GALÁCTICOS (Hardcoded para asegurar el estilo)
  const themeColors = {
      bg: ['#0F172A', '#1E293B', '#000000'],
      card: '#1E293B',
      accent: '#6366F1',
      text: '#FFFFFF',
      subText: '#94A3B8',
      border: '#334155'
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeColors.bg} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ArrowLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Mission</Text>
        </View>

        <ScrollView contentContainerStyle={{padding: spacing.l, paddingBottom: 50}}>
          
          {/* STEP 1: Lista de Tareas */}
          {!photo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. What did you achieve?</Text>
              
              {dailyPlan.tasks && dailyPlan.tasks.filter(t => !t.completed).map((task) => (
                <TouchableOpacity 
                  key={task.id} 
                  style={[
                      styles.taskCard, 
                      selectedTask?.id === task.id && { borderColor: themeColors.accent, backgroundColor: 'rgba(99, 102, 241, 0.1)' }
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTask(task)}
                >
                  {/* TEXTO (Flex 1 para ocupar espacio disponible) */}
                  <View style={{flex: 1, paddingRight: 10}}>
                      <Text style={[styles.taskText, selectedTask?.id === task.id && { color: themeColors.accent, fontWeight:'bold' }]}>
                          {task.title}
                      </Text>
                  </View>
                  
                  {/* CÍRCULO (Tamaño fijo, no se aplasta) */}
                  <View style={[
                      styles.radioCircle, 
                      selectedTask?.id === task.id && { borderColor: themeColors.accent, backgroundColor: themeColors.accent }
                  ]}>
                      {selectedTask?.id === task.id && <Sparkles color="white" size={12} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* STEP 2: Cámara */}
          {selectedTask && !photo && (
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>2. Show me the proof</Text>
               <TouchableOpacity style={styles.scanZone} onPress={takePhoto} activeOpacity={0.8}>
                  <View style={styles.scanIconContainer}><Camera color={themeColors.accent} size={40} /></View>
                  <Text style={styles.scanTitle}>Open Camera</Text>
                  <Text style={styles.scanSubtitle}>Aim for your achievement. The AI will judge.</Text>
               </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: Análisis */}
          {photo && !result && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: photo.uri }} style={styles.previewImage} />
              <Text style={styles.analyzingText}>Analyzing evidence...</Text>
              <TouchableOpacity style={[styles.verifyButton, verifying && {opacity: 0.7}]} onPress={handleVerify} disabled={verifying}>
                {verifying ? <ActivityIndicator color="white"/> : <><Sparkles color="white" size={20} /><Text style={styles.verifyText}>Verify with AI</Text></>}
              </TouchableOpacity>
              <TouchableOpacity onPress={reset} style={styles.retryLink} disabled={verifying}><Text style={styles.retryText}>Cancel</Text></TouchableOpacity>
            </View>
          )}

          {/* Fallo */}
          {result && !result.approved && (
            <View style={[styles.resultCard, { borderColor: '#F87171' }]}>
              <XCircle color="#F87171" size={50} style={{marginBottom:10}}/>
              <Text style={styles.resultTitle}>Not quite...</Text>
              <Text style={styles.resultFeedback}>{result.feedback}</Text>
              <TouchableOpacity style={[styles.verifyButton, {backgroundColor: '#F87171', marginTop: 20}]} onPress={reset}><Text style={styles.verifyText}>Try Again</Text></TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <Animated.View pointerEvents="none" style={[styles.successOverlay, { opacity: successOpacity }]}>
            <Animated.View style={{ transform: [{ scale: successScale }], alignItems: 'center' }}>
              <CheckCircle color="white" size={120} />
              <Text style={styles.successTitle}>MISSION COMPLETE!</Text>
              <Text style={styles.successSubtitle}>+10 XP Growth</Text>
              {result && <Text style={styles.successFeedback}>AI: "{result.feedback}"</Text>}
            </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  iconBtn: { padding: 10, backgroundColor: '#1E293B', borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  section: { marginBottom: 30 },
  sectionTitle: { color: '#94A3B8', fontSize: 16, fontWeight: '600', marginBottom: 15 },
  
  // FIXED CARD ALIGNMENT
  taskCard: { 
      padding: 20, 
      backgroundColor: '#1E293B', 
      borderRadius: 16, 
      marginBottom: 10, 
      flexDirection: 'row', 
      alignItems: 'center', // Alineación vertical centrada
      justifyContent: 'space-between', // Separa texto y círculo
      borderWidth: 1, 
      borderColor: '#334155' 
  },
  taskText: { fontSize: 16, color: '#FFF', lineHeight: 22 },
  radioCircle: { 
      width: 24, 
      height: 24, 
      borderRadius: 12, 
      borderWidth: 2, 
      borderColor: '#475569', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginLeft: 10 // Margen seguro
  },
  
  scanZone: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 24, borderWidth: 2, borderColor: '#6366F1', borderStyle: 'dashed', padding: 40, alignItems: 'center', justifyContent: 'center', height: 250 },
  scanIconContainer: { width: 70, height: 70, backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  scanTitle: { color: '#6366F1', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  scanSubtitle: { textAlign: 'center', color: '#94A3B8', fontSize: 14 },
  previewContainer: { alignItems: 'center', marginTop: 10 },
  previewImage: { width: '100%', height: 400, borderRadius: 24, marginBottom: 20, backgroundColor:'#334155' },
  analyzingText: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 20 },
  verifyButton: { backgroundColor: '#6366F1', paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 },
  verifyText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  retryLink: { marginTop: 20, padding: 10 },
  retryText: { color: '#94A3B8', textDecorationLine: 'underline' },
  resultCard: { padding: 30, alignItems: 'center', borderRadius: 24, backgroundColor: '#1E293B', borderWidth: 2, marginTop: 20 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#FFF' },
  resultFeedback: { fontSize: 16, textAlign: 'center', lineHeight: 24, color: '#94A3B8' },
  successOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  successTitle: { color: 'white', fontSize: 32, fontWeight: '900', marginTop: 20, letterSpacing: 1 },
  successSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 20, marginTop: 10, fontWeight: '600' },
  successFeedback: { color: 'white', fontSize: 16, marginTop: 20, textAlign: 'center', paddingHorizontal: 40, fontStyle: 'italic' }
});

export default VerificationScreen;