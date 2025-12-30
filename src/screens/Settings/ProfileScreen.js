import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';
import { colors } from '../../config/theme';
import { ArrowLeft, Trophy, Flame, LogOut, Target, Activity, Heart, Edit2, Save } from 'lucide-react-native';

const ProfileScreen = ({ navigation }) => {
  const { userProfile, points, streak, resetJourney, updateGoals, isWithered } = useContext(UserContext);
  
  // Estado para edición
  const [isEditing, setIsEditing] = useState(false);
  const [tempMain, setTempMain] = useState(userProfile.mainGoal);
  const [tempGrowth, setTempGrowth] = useState(userProfile.growthGoal);

  const handleLogout = () => {
      Alert.alert("¿Reiniciar?", "Perderás todo el progreso.", [
          { text: "No", style: "cancel" }, { text: "Sí, Borrar", style: "destructive", onPress: resetJourney }
      ]);
  };

  const saveChanges = () => {
      updateGoals(tempMain, tempGrowth);
      setIsEditing(false);
      Alert.alert("¡Actualizado!", "Tus metas han sido renovadas.");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B', '#000000']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <ArrowLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.iconBtn}>
                {isEditing ? <Save color="#6EE7B7" size={24} onPress={saveChanges} /> : <Edit2 color="#FFF" size={24} />}
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            
            {/* TARJETA VERDE (Estilo Maestro) */}
            <View style={[styles.bigCard, isWithered && {backgroundColor:'#EF4444'}]}>
                <View style={styles.avatarBox}><Text style={{fontSize: 40}}>{isWithered ? '🥀' : '🌱'}</Text></View>
                <Text style={styles.nameText}>{userProfile.name || 'Traveler'}</Text>
                <Text style={styles.levelText}>{isWithered ? "Needs Care" : "Master Level • NATURE"}</Text>

                <View style={styles.chipsRow}>
                    <View style={styles.whiteChip}><Trophy size={14} color="#2E7D32" /><Text style={styles.chipTextGreen}>{points} XP</Text></View>
                    <View style={styles.orangeChip}><Flame size={14} color="#E65100" /><Text style={styles.chipTextOrange}>Streak: {streak}</Text></View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>My Purposes</Text>

            {/* TARJETA EDITABLE */}
            <View style={styles.detailsCard}>
                
                {/* Meta de Vida */}
                <View style={styles.infoRow}>
                    <View style={[styles.iconBox, {backgroundColor: 'rgba(76, 175, 80, 0.1)'}]}><Target color="#4CAF50" size={20}/></View>
                    <View style={{flex:1}}>
                        <Text style={styles.infoLabel}>GROWTH GOAL</Text>
                        {isEditing ? (
                            <TextInput style={styles.editInput} value={tempGrowth} onChangeText={setTempGrowth} />
                        ) : (
                            <Text style={styles.infoValue}>{userProfile.growthGoal}</Text>
                        )}
                    </View>
                </View>
                
                <View style={styles.divider} />

                {/* Enfoque Actual */}
                <View style={styles.infoRow}>
                    <View style={[styles.iconBox, {backgroundColor: 'rgba(33, 150, 243, 0.1)'}]}><Activity color="#2196F3" size={20}/></View>
                    <View style={{flex:1}}>
                        <Text style={styles.infoLabel}>CURRENT APPROACH</Text>
                        {isEditing ? (
                            <TextInput style={styles.editInput} value={tempMain} onChangeText={setTempMain} />
                        ) : (
                            <Text style={styles.infoValue}>{userProfile.mainGoal}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Estado Salud */}
                <View style={styles.infoRow}>
                    <View style={[styles.iconBox, {backgroundColor: 'rgba(233, 30, 99, 0.1)'}]}><Heart color="#E91E63" size={20}/></View>
                    <View style={{flex:1}}>
                        <Text style={styles.infoLabel}>HEALTH OF YOUR WORLD</Text>
                        <Text style={[styles.infoValue, {color: isWithered ? '#F87171' : '#6EE7B7'}]}>
                            {isWithered ? "Critical 🚑" : "Stable ✨"}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut color="#EF4444" size={20} />
                <Text style={styles.logoutText}>Restart Trip</Text>
            </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  iconBtn: { padding: 8, backgroundColor: '#1E293B', borderRadius: 50, borderWidth: 1, borderColor: '#334155' },
  content: { padding: 20 },

  bigCard: { backgroundColor: '#15803d', borderRadius: 24, padding: 30, alignItems: 'center', marginBottom: 25, borderWidth:1, borderColor:'#166534' },
  avatarBox: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  nameText: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  levelText: { color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  chipsRow: { flexDirection: 'row', gap: 10 },
  whiteChip: { backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 5, alignItems: 'center' },
  orangeChip: { backgroundColor: '#FFF3E0', flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 5, alignItems: 'center' },
  chipTextGreen: { color: '#2E7D32', fontWeight: 'bold' },
  chipTextOrange: { color: '#E65100', fontWeight: 'bold' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 15 },
  detailsCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155' },
  infoRow: { flexDirection: 'row', gap: 15, alignItems: 'center', paddingVertical: 5 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: 'bold', marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  editInput: { backgroundColor: '#0F172A', color: 'white', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#6EE7B7' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12, marginLeft: 55 },

  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 15, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 15, marginTop: 40, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  logoutText: { color: '#EF4444', fontWeight: 'bold' }
});

export default ProfileScreen;