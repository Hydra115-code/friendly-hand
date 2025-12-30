import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { UserContext } from '../../context/UserContext';
import GardenScene from '../../components/GardenScene'; 
import { colors, shadows } from '../../config/theme';
import { Flame, X } from 'lucide-react-native';

const GardenScreen = ({ navigation }) => {
  const { userProfile, points, streak, isWithered } = useContext(UserContext); 

  // Level Calc
  const currentLevel = Math.floor(points / 50) + 1;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar hidden /> 
      
      {/* 1. GARDEN SCENE (Background) */}
      <View style={StyleSheet.absoluteFill}>
         <GardenScene 
            theme={userProfile.worldTheme} 
            growthLevel={points} 
            isWithered={isWithered} 
         />
      </View>

      {/* 2. FLOATING UI */}
      <SafeAreaView style={styles.uiContainer}>
        
        {/* HEADER: Close & Stats */}
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <X color="white" size={24} />
            </TouchableOpacity>

            <View style={styles.statsGroup}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelLabel}>LEVEL {currentLevel}</Text>
                    <Text style={styles.xpText}>{points} XP</Text>
                </View>
                
                <View style={styles.fireBadge}>
                    <Flame color={isWithered ? '#64748B' : "#F59E0B"} fill={isWithered ? 'transparent' : "#F59E0B"} size={16} />
                    <Text style={[styles.fireText, isWithered && {color:'#94A3B8'}]}>
                        {streak}
                    </Text>
                </View>
            </View>
        </View>

        {/* FOOTER: Status Message (FIXED) */}
        <View style={styles.messageContainer}>
             <View style={[
                 styles.messageBubble, 
                 isWithered ? styles.bubbleWithered : styles.bubbleNormal
             ]}>
                 <Text style={[
                     styles.messageText, 
                     isWithered ? {color: '#FECACA'} : {color: '#E2E8F0'}
                 ]}>
                    {isWithered 
                        ? "🥀 Your garden is withering. Complete a mission to revive it!" 
                        : "✨ Your mind is calm and your world flourishes."}
                 </Text>
             </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  uiContainer: { 
      flex: 1, 
      justifyContent: 'space-between' 
  },
  
  topBar: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingHorizontal: 20, 
      paddingTop: 20, 
      alignItems: 'flex-start' 
  },
  
  iconButton: { 
      backgroundColor: 'rgba(0,0,0,0.4)', 
      padding: 10, 
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)'
  },

  statsGroup: { alignItems: 'flex-end', gap: 8 },

  levelBadge: { 
      backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dark Slate transparent
      paddingHorizontal: 16, 
      paddingVertical: 8, 
      borderRadius: 20,
      alignItems: 'flex-end',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)'
  },
  levelLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
  xpText: { color: 'white', fontSize: 22, fontWeight: '900' },

  fireBadge: { 
      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 12, 
      paddingVertical: 6, 
      borderRadius: 20, 
      gap: 4, 
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)'
  },
  fireText: { fontWeight: 'bold', fontSize: 14, color: '#FFF' },

  messageContainer: { padding: 20, paddingBottom: 40 },
  
  // Base Bubble Style
  messageBubble: { 
      padding: 20, 
      borderRadius: 24, 
      alignItems: 'center',
      alignSelf: 'center',
      maxWidth: '95%',
      borderWidth: 1,
      ...shadows.medium
  },
  // Normal State: Dark Blue/Slate Glass
  bubbleNormal: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
      borderColor: 'rgba(99, 102, 241, 0.3)', // Subtle Indigo border
  },
  // Withered State: Dark Red Glass
  bubbleWithered: {
      backgroundColor: 'rgba(69, 10, 10, 0.9)', 
      borderColor: '#EF4444', // Red border
  },

  messageText: { 
      fontWeight: '600', 
      textAlign: 'center', 
      fontSize: 15,
      lineHeight: 22
  }
});

export default GardenScreen;