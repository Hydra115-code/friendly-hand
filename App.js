// App.js
import React, { useContext } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // <--- IMPORTANTE
import { UserProvider, UserContext } from './src/context/UserContext';
import { colors } from './src/config/theme';
import { Home, Sprout, Pill, BarChart2, User, MessageCircle, CheckCircle } from 'lucide-react-native';

// Pantallas
import LandingScreen from './src/screens/Onboarding/LandingScreen';
import WelcomeScreen from './src/screens/Onboarding/WelcomeScreen';
import SetupScreen from './src/screens/Onboarding/SetupScreen';

// Pantallas Principales (Tabs)
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import GardenScreen from './src/screens/Features/GardenScreen';
import MedsScreen from './src/screens/Features/MedsScreen';
import StatsScreen from './src/screens/Features/StatsScreen'; // <--- ESTA FALTABA

// Pantallas Secundarias (Stack)
import ChatScreen from './src/screens/Features/ChatScreen';
import VerificationScreen from './src/screens/Features/VerificationScreen';
import ProfileScreen from './src/screens/Settings/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- BARRA DE NAVEGACIÓN INFERIOR ---
function MainTabs() {
  const { theme } = useContext(UserContext);
  const isDark = theme.mode === 'dark';
  const bgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const activeColor = colors.primary;
  const inactiveColor = isDark ? '#888' : '#CCC';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarShowLabel: false, // Solo iconos para look limpio (o true si prefieres texto)
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({color}) => <Home color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Meds" 
        component={MedsScreen} 
        options={{ tabBarIcon: ({color}) => <Pill color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Garden" 
        component={GardenScreen} 
        options={{ 
          tabBarIcon: ({color, focused}) => (
            // Icono central destacado
            <View style={{
              backgroundColor: focused ? colors.primary : 'transparent',
              padding: 10, borderRadius: 50, marginBottom: 20,
              elevation: 5, shadowColor: colors.primary, shadowOpacity: 0.3
            }}>
               <Sprout color={focused ? 'white' : color} size={28} />
            </View>
          ) 
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ tabBarIcon: ({color}) => <BarChart2 color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({color}) => <User color={color} size={24} /> }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const { isOnboarded } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!isOnboarded ? (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Setup" component={SetupScreen} />
        </>
      ) : (
        <>
          {/* AQUÍ CARGAMOS LOS TABS COMO LA PANTALLA PRINCIPAL */}
          <Stack.Screen name="MainTabs" component={MainTabs} />
          
          {/* Pantallas que no están en el menú de abajo pero se accede a ellas */}
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}