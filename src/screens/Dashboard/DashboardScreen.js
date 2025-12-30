import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Modal, TextInput, Alert, Image, ActivityIndicator, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Audio } from 'expo-av';
import { UserContext } from '../../context/UserContext';
import { generateDailyPlan, unblockMeWithVision } from '../../services/aiService'; 
import { Settings, UserCircle, Camera, MessageCircle, Moon, Sun, Image as ImageIcon, Sparkles, Plus, X, BedDouble, Wand2, CheckCircle, Calendar, Flame, Pill, Sprout, ChevronRight, TrendingUp } from 'lucide-react-native';

const DashboardScreen = ({ navigation }) => {
  const { userProfile, theme, updateTheme, dailyPlan, points, streak, isWithered, addManualTask, addTasksFromVision, markTaskCompleted, finishSetup, meds, takeMedication } = useContext(UserContext); 
  
  const [modalVisible, setModalVisible] = useState({ type: null }); 
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const playSound = async () => { try { const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/success.mp3')); await sound.playAsync(); } catch(e){} };

  // 🎨 GALACTIC THEME COLORS
  const themeColors = {
      bg: ['#0F172A', '#1E293B', '#000000'],
      card: '#1E293B',
      border: '#334155',
      text: '#FFFFFF',
      subText: '#94A3B8',
      accent: '#6EE7B7' // Mint Green
  };

  const getProgressImage = () => {
    // Basic placeholders, replace if you have the assets in 'THEME_ASSETS'
    return 'https://cdn-icons-png.flaticon.com/512/433/433535.png'; 
  };

  const handlePlanDay = async () => {
    if (!inputValue.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
        const newPlan = await generateDailyPlan(userProfile, inputValue);
        finishSetup({ ...userProfile, mainGoal: inputValue }, newPlan);
        setModalVisible({ type: null });
        setInputValue('');
        playSound();
        Alert.alert("Plan Ready! ✨", "AI has generated your tasks.");
    } catch(e) { Alert.alert("Error", "AI is busy."); }
    finally { setLoading(false); }
  };

  const handleMedsPress = () => {
      if (meds.takenToday) { Alert.alert("Done!", "You already took your dose today."); return; }
      if(takeMedication()) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); playSound(); }
  };

  const handleMagicUnblock = async () => {
    const r = await ImagePicker.requestCameraPermissionsAsync();
    if (!r.granted) return Alert.alert("Permission", "Camera needed.");
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5, base64: true });
    if (!result.canceled) {
        setLoading(true);
        try {
            const aiRes = await unblockMeWithVision(result.assets[0].base64);
            addTasksFromVision(aiRes.tasks, aiRes.tip);
            playSound();
        } catch(e) { Alert.alert("Error", "Analysis failed."); }
        finally { setLoading(false); }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeColors.bg} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.greeting, { color: themeColors.text }]}>Hello, {userProfile.name}.</Text>
              <View style={styles.streakBadge}>
                  <Flame size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.streakText}>{streak} Days Streak</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
                <UserCircle color="#FFF" size={28} />
            </TouchableOpacity>
          </View>

          {/* WIDGETS */}
          <View style={styles.widgetsRow}>
              {/* Space / Garden */}
              <TouchableOpacity style={[styles.card, {flex:1}]} activeOpacity={0.8} onPress={() => navigation.navigate('Garden')}>
                  <View style={styles.cardHeader}><Sprout color="#6EE7B7" size={20}/><Text style={styles.cardTitle}>Your Space</Text></View>
                  <Text style={styles.cardBigText}>{points} XP</Text>
                  <Text style={styles.cardSubText}>{isWithered ? "Needs help!" : "Growing..."}</Text>
                  <View style={styles.cornerIcon}><ChevronRight color="#475569" size={16}/></View>
              </TouchableOpacity>

              {/* Meds */}
              <TouchableOpacity 
                style={[styles.card, {flex:1, borderColor: meds.takenToday ? '#10B981' : themeColors.border}]} 
                activeOpacity={0.8} 
                onPress={handleMedsPress}
              >
                   <View style={styles.cardHeader}>
                      <Pill color={meds.takenToday ? '#10B981' : '#F472B6'} size={20}/>
                      <Text style={[styles.cardTitle, meds.takenToday && {color:'#10B981'}]}>Medikit</Text>
                  </View>
                  <Text numberOfLines={1} style={[styles.cardBigText, {fontSize:16}]}>{meds.name}</Text>
                  <Text style={[styles.cardSubText, meds.takenToday && {color:'#10B981', fontWeight:'bold'}]}>
                      {meds.takenToday ? "Completed!" : `Next: ${meds.nextDose}`}
                  </Text>
              </TouchableOpacity>
          </View>

          {/* MISSIONS */}
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Today's Missions</Text>
             <View style={{flexDirection:'row', gap:10}}>
                 <TouchableOpacity onPress={handleMagicUnblock} style={styles.iconBtn}><Wand2 color="#C084FC" size={20} /></TouchableOpacity>
                 <TouchableOpacity onPress={() => { setModalVisible({type:'task'}); setInputValue(''); }} style={styles.iconBtn}><Plus color="#FFF" size={20} /></TouchableOpacity>
             </View>
          </View>

          <View style={{gap: 10}}>
            {dailyPlan.tasks?.filter(t => !t.completed).map((task, i) => (
               <TouchableOpacity key={i} style={styles.taskCard} onPress={() => navigation.navigate('Verification', { taskToVerify: task })}>
                 <View style={styles.checkCircle} />
                 <View style={{flex: 1}}>
                     <Text style={styles.taskText}>{task.title}</Text>
                     <Text style={styles.taskSub}>{task.time}</Text>
                 </View>
               </TouchableOpacity>
            ))}
            {dailyPlan.tasks?.filter(t => !t.completed).length === 0 && (
              <View style={[styles.card, {alignItems:'center', padding:20}]}>
                  <CheckCircle color="#6EE7B7" size={30} />
                  <Text style={{color:'#94A3B8', marginTop:10}}>All done for today!</Text>
              </View>
            )}
          </View>

          {/* GRID TOOLS */}
          <Text style={[styles.sectionTitle, {marginTop: 30}]}>Command Center</Text>
          <View style={styles.grid}>
             <ToolBtn icon={<Calendar color="#FBBF24"/>} label="Plan Day" onPress={() => { setModalVisible({type:'plan'}); setInputValue(''); }} />
             <ToolBtn icon={<Camera color="#38BDF8"/>} label="Verify" onPress={() => navigation.navigate('Verification')} />
             <ToolBtn icon={<MessageCircle color="#F472B6"/>} label="Vent" onPress={() => navigation.navigate('Chat')} />
             <ToolBtn icon={<TrendingUp color="#6EE7B7"/>} label="Stats" onPress={() => navigation.navigate('Stats')} />
          </View>

        </ScrollView>

        {/* MODAL */}
        <Modal visible={!!modalVisible.type} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalVisible.type === 'plan' ? '☀️ New Day' : '⚡ New Task'}</Text>
              <TextInput 
                style={styles.input} 
                placeholder={modalVisible.type === 'plan' ? "Main focus today?" : "Task description..."} 
                placeholderTextColor="#64748B"
                value={inputValue} onChangeText={setInputValue} autoFocus
              />
              <View style={{flexDirection:'row', gap:10, marginTop:15}}>
                  <TouchableOpacity style={[styles.modalBtn, {backgroundColor:'#334155'}]} onPress={() => setModalVisible({type:null})}>
                      <Text style={{color:'#FFF'}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalBtn, {backgroundColor:'#6366F1', flex:1}]} 
                    onPress={modalVisible.type === 'plan' ? handlePlanDay : () => { addManualTask(inputValue); setModalVisible({type:null}); }}
                  >
                      {loading ? <ActivityIndicator color="#FFF"/> : <Text style={{color:'#FFF', fontWeight:'bold'}}>Save</Text>}
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
};

const ToolBtn = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.toolCard} onPress={onPress}>
        {React.cloneElement(icon, {size: 26})}
        <Text style={styles.toolLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 80 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 28, fontWeight: '800' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, alignSelf: 'flex-start', marginTop: 5 },
  streakText: { color: '#F59E0B', fontWeight: 'bold', fontSize: 12 },
  profileBtn: { padding: 8, backgroundColor: '#1E293B', borderRadius: 50, borderWidth: 1, borderColor: '#334155' },
  
  widgetsRow: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  card: { backgroundColor: '#1E293B', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitle: { color: '#94A3B8', fontWeight: '600', fontSize: 14 },
  cardBigText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  cardSubText: { color: '#64748B', fontSize: 12, marginTop: 4 },
  cornerIcon: { position: 'absolute', top: 12, right: 12 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  iconBtn: { backgroundColor: '#1E293B', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },

  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#6EE7B7', marginRight: 15 },
  taskText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  taskSub: { color: '#64748B', fontSize: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  toolCard: { width: '48%', backgroundColor: '#1E293B', padding: 20, borderRadius: 16, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#334155' },
  toolLabel: { color: '#FFF', fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E293B', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#0F172A', color: '#FFF', padding: 15, borderRadius: 12, fontSize: 16 },
  modalBtn: { padding: 15, borderRadius: 12, alignItems: 'center' }
});

export default DashboardScreen;