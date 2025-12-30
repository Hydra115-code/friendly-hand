import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';
import { colors, spacing } from '../../config/theme';
import { ArrowRight, Brain, Battery, CloudRain, Clock, AlertCircle } from 'lucide-react-native';

const WelcomeScreen = ({ navigation }) => {
  const { completeOnboarding } = useContext(UserContext);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const listTranslateY = useRef(new Animated.Value(50)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(listTranslateY, { toValue: 0, duration: 800, easing: Easing.out(Easing.exp), delay: 300, useNativeDriver: true }),
      Animated.timing(listOpacity, { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const options = [
    { id: 'noise', label: 'Racing Thoughts', desc: 'Mental noise, anxiety.', icon: <Brain color="#6366F1" size={24} /> },
    { id: 'fatigue', label: 'Low Energy', desc: 'Physical or emotional fatigue.', icon: <Battery color="#F59E0B" size={24} /> },
    { id: 'sadness', label: 'Feeling Blue', desc: 'Lack of motivation or sadness.', icon: <CloudRain color="#38BDF8" size={24} /> },
    { id: 'paralysis', label: 'ADHD Paralysis', desc: 'Wanting to do things but can\'t.', icon: <Clock color="#C084FC" size={24} /> },
    { id: 'overwhelmed', label: 'Overwhelmed', desc: 'Stress overload.', icon: <AlertCircle color="#F472B6" size={24} /> },
  ];

  const handleSelect = (option) => {
    completeOnboarding({ struggle: option.label }); 
    navigation.navigate('Setup'); 
  };

  const handleSkip = () => {
    completeOnboarding({ struggle: 'Not specified' });
    navigation.navigate('Setup');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {/* 🌌 FONDO GALÁCTICO */}
      <LinearGradient colors={['#0F172A', '#1E293B', '#000000']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
            <Text style={styles.greeting}>Hello. 👋</Text>
            <Text style={styles.subtitle}>Understanding how you feel helps me be a better friend.</Text>
          </Animated.View>

          <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listTranslateY }], flex: 1 }}>
            <View style={styles.cardContainer}>
              <Text style={styles.questionTitle}>What resonates with you today?</Text>
              {options.map((opt, index) => (
                <TouchableOpacity key={index} style={styles.optionButton} activeOpacity={0.7} onPress={() => handleSelect(opt)}>
                  <View style={styles.iconBox}>{opt.icon}</View>
                  <View style={styles.textContainer}>
                      <Text style={styles.optionText}>{opt.label}</Text>
                      <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                  <ArrowRight color="#334155" size={20} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>I prefer not to say</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.l },
  headerContainer: { marginBottom: spacing.l, marginTop: spacing.m },
  greeting: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginBottom: spacing.s },
  subtitle: { fontSize: 18, color: '#94A3B8', lineHeight: 26 },
  
  // Tarjeta Contenedora Oscura
  cardContainer: { 
      backgroundColor: '#1E293B', // Dark Surface
      borderRadius: 24, 
      padding: spacing.m, 
      borderWidth: 1,
      borderColor: '#334155',
      shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 
  },
  questionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: spacing.m, marginLeft: spacing.s },
  
  // Botones de Opciones
  optionButton: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 16, 
      backgroundColor: '#0F172A', // Darker input style
      borderRadius: 16, 
      marginBottom: 10, 
      borderWidth: 1, 
      borderColor: '#334155' 
  },
  iconBox: { marginRight: spacing.m, padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  textContainer: { flex: 1 },
  optionText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  optionDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  
  skipButton: { marginTop: spacing.l, alignItems: 'center', padding: spacing.m },
  skipText: { color: '#94A3B8', fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' }
});

export default WelcomeScreen;