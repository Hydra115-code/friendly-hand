import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Modal, TextInput, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import * as Haptics from 'expo-haptics';
import { UserContext } from '../../context/UserContext';
import { colors, spacing, shadows } from '../../config/theme';
import { Pill, ArrowLeft, Clock, CheckCircle, Edit2, X, Activity } from 'lucide-react-native';

const MedsScreen = ({ navigation }) => {
  const { meds, takeMedication, userProfile } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados locales para edición (si quisieras conectarlo al context luego)
  const [tempName, setTempName] = useState(meds.name);
  const [tempTime, setTempTime] = useState(meds.nextDose);

  const handleTake = () => {
      if (meds.takenToday) return;
      
      const success = takeMedication();
      if (success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert("¡Dosis Registrada!", "Tu cuerpo te lo agradece. 🌱");
      }
  };

  const handleSaveEdit = () => {
      // Aquí podrías llamar a una función updateMeds(tempName, tempTime) si la añades al context
      setModalVisible(false);
      Alert.alert("Updated Info", "Your preferences have been saved.");
  };

  // Colores del Tema Espacial
  const themeColors = {
      bg: ['#0F172A', '#1E293B', '#000000'],
      card: '#1E293B',
      border: '#334155',
      text: '#FFFFFF',
      subText: '#94A3B8',
      accent: '#6EE7B7', // Verde Menta
      danger: '#F87171'   // Rojo suave
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeColors.bg} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <ArrowLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Kit</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconBtn}>
                <Edit2 color="#FFF" size={20} />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            
            {/* TARJETA DE ESTADO PRINCIPAL */}
            <View style={[styles.mainCard, meds.takenToday && {borderColor: themeColors.accent}]}>
                <View style={styles.statusBadge}>
                    <Activity size={16} color={meds.takenToday ? themeColors.accent : themeColors.danger} />
                    <Text style={[styles.statusText, {color: meds.takenToday ? themeColors.accent : themeColors.danger}]}>
                        {meds.takenToday ? "DOSE COMPLETED": "PENDING"}
                    </Text>
                </View>

                <View style={styles.iconContainer}>
                    <View style={[styles.glowCircle, {backgroundColor: meds.takenToday ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)'}]}>
                        <Pill size={60} color={meds.takenToday ? themeColors.accent : themeColors.danger} />
                    </View>
                </View>

                <Text style={styles.medName}>{meds.name || "Your Medicine"}</Text>
                <Text style={styles.medSchedule}>
                    {meds.takenToday 
                        ? `Well done!, ${userProfile.name}! come back tomorrow.` 
                        : `Scheduled for ${meds.nextDose}`}
                </Text>

                {/* BOTÓN DE ACCIÓN GIGANTE */}
                <TouchableOpacity 
                    style={[
                        styles.actionBtn, 
                        meds.takenToday ? {backgroundColor: '#334155'} : {backgroundColor: '#6366F1'}
                    ]}
                    onPress={handleTake}
                    disabled={meds.takenToday}
                    activeOpacity={0.8}
                >
                    {meds.takenToday ? (
                        <>
                            <CheckCircle color="#10B981" size={24} />
                            <Text style={[styles.btnText, {color: '#94A3B8'}]}>Registered</Text>
                        </>
                    ) : (
                        <>
                            <Clock color="#FFF" size={24} />
                            <Text style={styles.btnText}>Mark as Taken</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* ESTADÍSTICAS RÁPIDAS */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Current Streak</Text>
                    <Text style={styles.statValue}>🔥 5 Days</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Effectiveness</Text>
                    <Text style={styles.statValue}>⚡ 92%</Text>
                </View>
            </View>

            <Text style={styles.tipText}>
                "Consistency is the key to your well-being. Don't break the chain."
            </Text>

        </View>

        {/* MODAL DE EDICIÓN (OSCURO) */}
        <Modal visible={modalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Set Dosage</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <X color="#94A3B8" size={24}/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Drug Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={tempName} 
                        onChangeText={setTempName} 
                        placeholderTextColor="#64748B"
                    />

                    <Text style={styles.label}>Regular Hours</Text>
                    <TextInput 
                        style={styles.input} 
                        value={tempTime} 
                        onChangeText={setTempTime} 
                        placeholderTextColor="#64748B"
                    />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                        <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  iconBtn: { padding: 10, backgroundColor: '#1E293B', borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  
  content: { padding: 20, flex: 1 },

  mainCard: {
      backgroundColor: '#1E293B',
      borderRadius: 24,
      padding: 30,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#334155',
      marginBottom: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10
  },
  statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 20
  },
  statusText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  
  iconContainer: { marginBottom: 20 },
  glowCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)'
  },

  medName: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  medSchedule: { color: '#94A3B8', fontSize: 14, marginBottom: 30, textAlign: 'center' },

  actionBtn: {
      width: '100%',
      paddingVertical: 18,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
  },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: { 
      flex: 1, 
      backgroundColor: 'rgba(30, 41, 59, 0.5)', 
      padding: 15, 
      borderRadius: 16, 
      borderWidth: 1, 
      borderColor: '#334155',
      alignItems: 'center'
  },
  statLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  tipText: { color: '#64748B', fontStyle: 'italic', textAlign: 'center', marginTop: 'auto', marginBottom: 20 },

  // MODAL DARK
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, borderWidth: 1, borderColor: '#334155' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#0F172A', color: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', marginBottom: 20, fontSize: 16 },
  saveBtn: { backgroundColor: '#6366F1', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default MedsScreen;