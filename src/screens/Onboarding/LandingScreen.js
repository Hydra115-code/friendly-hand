import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../config/theme';
import { ArrowRight, Sparkles } from 'lucide-react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      
      {/* 🌌 FONDO GALÁCTICO */}
      <LinearGradient 
        colors={['#0F172A', '#1E293B', '#000000']} 
        style={StyleSheet.absoluteFill} 
      />
      
      <SafeAreaView style={styles.container}>
        
        {/* Centro: Logo y Texto */}
        <View style={styles.centerContent}>
            <View style={styles.logoContainer}>
                <Sparkles color="white" size={45} />
            </View>
            
            <Text style={styles.title}>Friendly Hand</Text>
            <Text style={styles.subtitle}>
              Your mind is a garden.{"\n"}Let's take care of it together.
            </Text>
        </View>

        {/* Botón Inferior */}
        <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Welcome')}
        >
            <Text style={styles.buttonText}>Start Experience</Text>
            <ArrowRight color="white" size={20} />
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: spacing.l, 
    justifyContent: 'space-between' 
  },
  centerContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logoContainer: { 
    width: 100, 
    height: 100, 
    borderRadius: 35, 
    backgroundColor: '#6366F1', // Primary Indigo
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30, 
    shadowColor: '#6366F1', 
    shadowOpacity: 0.5, 
    shadowRadius: 20, 
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  title: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#FFFFFF', // Blanco
    marginBottom: 10,
    letterSpacing: -1
  },
  subtitle: { 
    fontSize: 18, 
    color: '#94A3B8', // Gris Espacial
    textAlign: 'center', 
    lineHeight: 26,
    maxWidth: '80%'
  },
  button: { 
    backgroundColor: '#6366F1', 
    paddingVertical: 20, 
    borderRadius: 25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 12, 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});

export default LandingScreen;