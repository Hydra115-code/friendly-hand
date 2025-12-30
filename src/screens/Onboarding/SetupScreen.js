import React, { useContext, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, 
  KeyboardAvoidingView, Platform, ScrollView, StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '../../context/UserContext';
import { generateDailyPlan } from '../../services/aiService'; 
import { spacing } from '../../config/theme';
import { ArrowRight, Sprout, Rocket, Dumbbell, Cpu } from 'lucide-react-native';
import SkeletonLoader from '../../components/SkeletonLoader';

const SetupScreen = ({ navigation }) => {
  const { finishSetup, userProfile } = useContext(UserContext);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [growthGoal, setGrowthGoal] = useState(''); 
  const [selectedTheme, setSelectedTheme] = useState('nature');
  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    { id: 'nature', label: 'Zen Garden', icon: <Sprout size={24} color={selectedTheme === 'nature' ? 'white' : '#10B981'} /> },
    { id: 'space', label: 'Cosmos', icon: <Rocket size={24} color={selectedTheme === 'space' ? 'white' : '#9C27B0'} /> },
    { id: 'body', label: 'Vitality', icon: <Dumbbell size={24} color={selectedTheme === 'body' ? 'white' : '#E91E63'} /> },
    { id: 'tech', label: 'Cyberpunk', icon: <Cpu size={24} color={selectedTheme === 'tech' ? 'white' : '#00BCD4'} /> },
  ];

  const handleFinish = async () => {
    const finalName = name.trim() === '' ? 'Traveler' : name;
    const finalGoal = goal.trim() === '' ? 'Feel better' : goal;
    const finalGrowthGoal = growthGoal.trim() === '' ? 'Evolve' : growthGoal;
    
    setIsLoading(true);
    const aiResult = await generateDailyPlan({ ...userProfile, name: finalName, growthGoal: finalGrowthGoal }, finalGoal);
    setIsLoading(false);
    
    finishSetup({ name: finalName, mainGoal: finalGoal, growthGoal: finalGrowthGoal, worldTheme: selectedTheme }, aiResult);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {/* 🌌 FONDO GALÁCTICO */}
      <LinearGradient colors={['#0F172A', '#1E293B', '#000000']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
          <ScrollView contentContainerStyle={styles.content}>
            
            <Text style={styles.header}>Design your space.</Text>
            
            <View style={styles.form}>
              <View>
                  <Text style={styles.label}>What should I call you?</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Your Name..." 
                    value={name} 
                    onChangeText={setName} 
                    placeholderTextColor="#64748B"
                  />
              </View>

              <View>
                  <Text style={styles.label}>Today's Goal</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Ex: Learn something new, clean..." 
                    value={goal} 
                    onChangeText={setGoal} 
                    placeholderTextColor="#64748B"
                  />
              </View>
              
              <View>
                  <Text style={styles.label}>Life Goal (Growth):</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Ex: Be consistent, heal, learn..." 
                    value={growthGoal} 
                    onChangeText={setGrowthGoal} 
                    placeholderTextColor="#64748B"
                  />
              </View>

              <Text style={styles.label}>Choose your Visual World:</Text>
              <View style={styles.themeGrid}>
                {themes.map((t) => (
                  <TouchableOpacity 
                    key={t.id}
                    style={[
                      styles.themeOption, 
                      selectedTheme === t.id && styles.themeSelected,
                      selectedTheme === t.id && { backgroundColor: t.id === 'space' ? '#9C27B0' : t.id === 'body' ? '#E91E63' : t.id === 'tech' ? '#00BCD4' : '#10B981' }
                    ]}
                    onPress={() => setSelectedTheme(t.id)}
                  >
                    {t.icon}
                    <Text style={[styles.themeText, selectedTheme === t.id && { color: 'white', fontWeight: 'bold' }]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && {backgroundColor: '#334155', borderWidth:1, borderColor: '#475569'}]} 
              onPress={handleFinish}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                   <SkeletonLoader width={120} height={20} />
                </View>
              ) : (
                <>
                  <Text style={styles.buttonText}>Start Trip</Text>
                  <ArrowRight color="white" size={24} />
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.l, paddingTop: 40 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: spacing.l },
  
  form: { gap: spacing.m, marginBottom: spacing.xl },
  label: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
  
  // Inputs Oscuros
  input: { 
      backgroundColor: '#0F172A', // Darker than background
      color: '#FFFFFF',
      padding: 16, 
      borderRadius: 12, 
      borderWidth: 1, 
      borderColor: '#334155', 
      fontSize: 16 
  },
  
  // Grid de Temas
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  themeOption: { 
      width: '48%', 
      padding: 15, 
      borderRadius: 12, 
      backgroundColor: '#1E293B', // Dark Surface
      borderWidth: 1, 
      borderColor: '#334155', 
      alignItems: 'center', 
      gap: 8 
  },
  themeSelected: { borderWidth: 0 },
  themeText: { fontSize: 14, color: '#94A3B8' },
  
  // Botón Principal
  button: { 
      backgroundColor: '#6366F1', 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: spacing.m, 
      borderRadius: 16, 
      gap: 10, 
      marginTop: 10, 
      height: 60,
      shadowColor: "#6366F1", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default SetupScreen;