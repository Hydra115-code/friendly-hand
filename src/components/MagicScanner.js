// src/components/MagicScanner.js
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { MotiView } from 'moti';
import { colors } from '../config/theme'; 
import { Sparkles } from 'lucide-react-native';

const MagicScanner = ({ visible }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.scanBox}>
          {/* LASER SCAN BAR THAT MOVES UP AND DOWN */}
          <MotiView
            from={{ translateY: -150 }}
            animate={{ translateY: 150 }}
            transition={{ loop: true, type: 'timing', duration: 1500 }}
            style={styles.laser}
          />
          
          <View style={styles.content}>
            <MotiView 
                from={{ scale: 1 }} 
                animate={{ scale: 1.2 }} 
                transition={{ loop: true, type: 'timing', duration: 800 }}
            >
                <Sparkles size={60} color="#00d2d3" />
            </MotiView>
            <Text style={styles.text}>Analyzing Chaos...</Text>
            <Text style={styles.subText}>Gemini is structuring your reality</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 300, height: 300, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  laser: { width: '100%', height: 4, backgroundColor: '#00d2d3', shadowColor: '#00d2d3', shadowRadius: 20, shadowOpacity: 1, position: 'absolute' },
  content: { alignItems: 'center', gap: 20 },
  text: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  subText: { color: '#bdc3c7', fontSize: 14 }
});

export default MagicScanner;