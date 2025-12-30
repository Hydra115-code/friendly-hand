import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ ELIMINADO: Todo lo relacionado con 'expo-notifications' para evitar crasheos.

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);

  // --- ESTADOS DE USUARIO ---
  // Por defecto tema 'space' para que coincida con tu diseño dark
  const [theme, setTheme] = useState({ mode: 'dark', backgroundImage: null });
  const [userProfile, setUserProfile] = useState({ name: '', struggle: '', mainGoal: '', growthGoal: '', worldTheme: 'space' });
  
  // --- ESTADOS DE JUEGO ---
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0); 
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [isWithered, setIsWithered] = useState(false);
  
  // --- ESTADOS DE CONTENIDO ---
  const [dailyPlan, setDailyPlan] = useState({ tasks: [], tip: '' });

  // 💊 MEDICAMENTOS: Lógica Antifarmeo
  const [meds, setMeds] = useState({
      takenToday: false,
      lastTakenDate: null, 
      name: 'Vitamin / Med', 
      nextDose: '09:00 AM'
  });

  // 1. CARGAR DATOS
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('friendlyHandData_v4'); 
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setUserProfile(parsed.userProfile || {});
          setPoints(parsed.points || 0);
          setTheme(parsed.theme || { mode: 'dark' });
          setDailyPlan(parsed.dailyPlan || { tasks: [], tip: '' });
          setIsOnboarded(parsed.isOnboarded || false);
          
          // Restaurar racha y estado marchito
          checkStreak(parsed.lastActiveDate, parsed.streak || 0);
          
          // Restaurar estado de medicina
          checkMedsStatus(parsed.meds);
        } else {
            setLastActiveDate(new Date().toISOString());
            setStreak(1); 
        }
      } catch (e) { console.error("Error cargando", e); } 
      finally { setIsLoadingStorage(false); }
    };
    
    // ⚠️ ELIMINADO: La llamada a registerForPushNotificationsAsync()
    loadData();
  }, []);

  // 2. GUARDAR DATOS AUTOMÁTICAMENTE
  useEffect(() => {
    if (!isLoadingStorage) {
      const data = { 
          userProfile, points, theme, dailyPlan, isOnboarded, 
          streak, lastActiveDate, isWithered, meds 
      };
      AsyncStorage.setItem('friendlyHandData_v4', JSON.stringify(data));
    }
  }, [userProfile, points, theme, dailyPlan, isOnboarded, streak, isWithered, meds]);

  // --- LÓGICA DE RACHAS ---
  const checkStreak = (savedLastDate, savedStreak) => {
      if (!savedLastDate) { setStreak(1); return; }
      const today = new Date(); 
      const last = new Date(savedLastDate);
      today.setHours(0,0,0,0); last.setHours(0,0,0,0);
      const diffDays = Math.ceil(Math.abs(today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
          setStreak(savedStreak); // Mismo día
          setLastActiveDate(savedLastDate);
          setIsWithered(false);
      } else if (diffDays === 1) {
          setStreak(savedStreak + 1); // Racha continua
          setLastActiveDate(new Date().toISOString());
          setIsWithered(false);
      } else {
          setStreak(0); // Racha perdida
          setLastActiveDate(new Date().toISOString());
          setIsWithered(true); // Planta marchita
      }
  };

  // --- LÓGICA DE MEDICAMENTOS (Antifarmeo) ---
  const checkMedsStatus = (savedMeds) => {
      if (!savedMeds || !savedMeds.lastTakenDate) {
          setMeds({ ...savedMeds, takenToday: false });
          return;
      }
      const today = new Date().toDateString();
      const last = new Date(savedMeds.lastTakenDate).toDateString();
      setMeds({ ...savedMeds, takenToday: today === last });
  };

  const takeMedication = () => {
      if (meds.takenToday) return false; 

      setMeds(prev => ({ 
          ...prev, 
          takenToday: true, 
          lastTakenDate: new Date().toISOString() 
      }));
      setPoints(prev => prev + 15);
      setIsWithered(false); 
      return true;
  };

  // --- NUEVA: ACTUALIZAR METAS ---
  const updateGoals = (newMainGoal, newGrowthGoal) => {
      setUserProfile(prev => ({ ...prev, mainGoal: newMainGoal, growthGoal: newGrowthGoal }));
  };

  // --- REINICIAR APP (Logout) ---
  const resetJourney = async () => {
      try {
          await AsyncStorage.removeItem('friendlyHandData_v4');
          setIsOnboarded(false);
          setPoints(0);
          setStreak(0);
          setUserProfile({ name: '', struggle: '', mainGoal: '', growthGoal: '', worldTheme: 'space' });
          setMeds({ takenToday: false, lastTakenDate: null, name: 'Vitamin / Med', nextDose: '09:00 AM' });
          setDailyPlan({ tasks: [], tip: '' });
      } catch (e) { console.error("Error reseteando", e); }
  };

  // --- OTRAS FUNCIONES ---
  const completeOnboarding = (data) => setUserProfile(p => ({...p, ...data}));
  const updateTheme = (mode, img) => setTheme({ mode, backgroundImage: img });
  
  const addManualTask = (t) => setDailyPlan(p => ({ ...p, tasks: [...p.tasks, { id: Date.now(), title: t, completed: false }] }));
  
  const addTasksFromVision = (t, tip) => {
      const newT = t.map((x, i) => ({...x, id: Date.now()+i, completed: false}));
      setDailyPlan(p => ({ tasks: [...p.tasks, ...newT], tip: tip || p.tip }));
  };

  const markTaskCompleted = (id) => {
      setPoints(p => p + 10);
      if(isWithered) setIsWithered(false);
      setDailyPlan(p => ({ ...p, tasks: p.tasks.filter(t => t.id !== id) }));
  };

  const finishSetup = (data, plan) => { 
      setUserProfile(p => ({...p, ...data})); 
      if(plan) setDailyPlan(plan); 
      setIsOnboarded(true); 
      setStreak(1);
      setLastActiveDate(new Date().toISOString());
  };

  if (isLoadingStorage) return null;

  return (
    <UserContext.Provider value={{ 
      isOnboarded, userProfile, theme, dailyPlan, points, streak, isWithered, meds,
      updateTheme, addManualTask, addTasksFromVision, markTaskCompleted, finishSetup, completeOnboarding,
      takeMedication, resetJourney, updateGoals
    }}>
      {children}
    </UserContext.Provider>
  );
};