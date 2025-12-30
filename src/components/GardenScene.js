import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Pressable, Text } from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import { Sun, Moon, Cloud, Star, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CONTAINER_HEIGHT = height;
const GROUND_Y = CONTAINER_HEIGHT * 0.75; 

const FloatingParticle = ({ delay, style, color, type = 'circle' }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 4000 + Math.random()*2000, delay: delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });
  const opacity = anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.8, 0.8, 0] });

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
        {type === 'star' ? <Star size={10} color={color} fill={color} /> : <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: color}} />}
    </Animated.View>
  );
};

const GardenScene = ({ theme = 'nature', growthLevel = 0, isWithered = false }) => {
  const [isDay, setIsDay] = useState(true);
  const [touchEffect, setTouchEffect] = useState(null);
  
  const breathAnim = useRef(new Animated.Value(1)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const sunMoonAnim = useRef(new Animated.Value(0)).current;

  // We ensure that XP is a number
  const xp = Number(growthLevel) || 0;

  useEffect(() => {
    const interval = setInterval(() => setIsDay(p => !p), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1.03, duration: 3000, useNativeDriver: true }),
      Animated.timing(breathAnim, { toValue: 1, duration: 3000, useNativeDriver: true })
    ])).start();
    
    Animated.loop(Animated.sequence([
      Animated.timing(swayAnim, { toValue: 5, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(swayAnim, { toValue: -5, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
    ])).start();

    Animated.timing(sunMoonAnim, { toValue: isDay ? 0 : 1, duration: 2000, useNativeDriver: false }).start();
  }, [isDay]);

  const handlePlantPress = (e) => {
      setTouchEffect({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
      setTimeout(() => setTouchEffect(null), 800);
  };

// --- ADJUSTED PHASE LOGIC ---
  const getStage = () => {
    if (xp < 30) return 1;  // outbreak
    if (xp < 80) return 2;  // Bush
    if (xp < 150) return 3; // Sapling
    if (xp < 300) return 4; // Mature Tree
    return 5;               // Master Tree (Over 300 XP)
  };
  const stage = getStage();

  const getColors = () => {
      if(isWithered) return { skyTop:'#5d4037', skyBot:'#3e2723', ground:'#4e342e', tree:'#8d6e63', leaf:'#a1887f' };
      const palettes = {
          nature: { day: { skyTop: '#60A5FA', skyBot: '#BFDBFE', ground: '#166534', tree: '#78350F', leaf: '#22C55E' }, night: { skyTop: '#1E1B4B', skyBot: '#312E81', ground: '#064E3B', tree: '#451a03', leaf: '#15803d' } }
      };
      return isDay ? palettes.nature.day : palettes.nature.night;
  };
  const c = getColors();

  return (
    <View style={styles.container}>
      
      {/* 1. BACKGROUND (SKY AND GROUND) */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          {/* IDs únicos para evitar conflictos */}
          <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={c.skyTop} />
            <Stop offset="1" stopColor={c.skyBot} />
          </LinearGradient>
          <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
             <Stop offset="0" stopColor={c.ground} />
             <Stop offset="1" stopColor="#000" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#skyGrad)" />
        <Path d={`M0,${CONTAINER_HEIGHT} L0,${GROUND_Y} Q${width/2},${GROUND_Y - 50} ${width},${GROUND_Y} L${width},${CONTAINER_HEIGHT} Z`} fill="url(#groundGrad)" />
      </Svg>

      {}
      {}
      <View style={{position:'absolute', top: 100, left: 20, backgroundColor:'rgba(0,0,0,0.5)', padding:5, borderRadius:5, zIndex:99}}>
          <Text style={{color:'white', fontWeight:'bold'}}>XP Real: {xp}</Text>
          <Text style={{color:'yellow'}}>Fase Detectada: {stage}</Text>
      </View>

      {/* 3. ANIMATED PLANT */}
      {/* We use xp as the key to force repainting if the points change */}
      <Animated.View 
        key={stage} 
        style={[
            styles.plantWrapper, 
            { 
                top: GROUND_Y - 300, 
                left: width / 2 - 150,
                transform: [{ scale: breathAnim }, { rotate: swayAnim.interpolate({inputRange:[-5,5], outputRange:['-3deg', '3deg']}) }] 
            }
        ]}
      >
        <Pressable onPress={handlePlantPress} style={{flex:1}}>
            <Svg height="300" width="300" viewBox="0 0 300 300">
                <G x="150" y="300">
                    
                    {/* PHASE 1: OUTBREAK */}
                    {stage === 1 && (
                        <G transform="translate(0, -10)">
                            <Ellipse cx="0" cy="5" rx="30" ry="10" fill="#3E2723" opacity="0.6" />
                            <Path d="M0,0 Q5,-15 0,-30" stroke="#8BC34A" strokeWidth="6" fill="none" />
                            <Path d="M0,-30 Q-15,-40 -20,-25 Q-5,-15 0,-30" fill={c.leaf} />
                            <Path d="M0,-30 Q15,-40 20,-25 Q5,-15 0,-30" fill={c.leaf} />
                        </G>
                    )}

                    {/* PHASE 2: SHRUB */}
                    {stage === 2 && (
                        <G transform="translate(0, -20)">
                            <Path d="M0,0 Q-5,-40 0,-80" stroke={c.leaf} strokeWidth="8" fill="none" />
                            <Circle cx="-20" cy="-60" r="20" fill={c.leaf} />
                            <Circle cx="20" cy="-70" r="22" fill={c.leaf} />
                            <Circle cx="0" cy="-90" r="18" fill={c.leaf} />
                        </G>
                    )}

                    {/* PHASE 3: YOUNG TREE */}
                    {stage === 3 && (
                        <G transform="translate(0, -20)">
                            <Path d="M0,0 Q-10,-60 5,-120" stroke={c.tree} strokeWidth="12" fill="none" />
                            <Circle cx="-40" cy="-60" r="30" fill={c.leaf} opacity="0.9" />
                            <Circle cx="40" cy="-80" r="30" fill={c.leaf} opacity="0.9" />
                            <Circle cx="5" cy="-120" r="40" fill={c.leaf} opacity="0.9" />
                        </G>
                    )}

                    {/* PHASE 4: MATURE TREE */}
                    {stage === 4 && (
                        <G transform="translate(0, -20)">
                            <Path d="M-10,0 Q0,-100 10,0" stroke={c.tree} strokeWidth="25" fill={c.tree} />
                            <G y="-120">
                                <Circle cx="0" cy="0" r="60" fill={c.leaf} opacity="0.95" />
                                <Circle cx="-40" cy="20" r="45" fill={c.leaf} opacity="0.9" />
                                <Circle cx="40" cy="20" r="45" fill={c.leaf} opacity="0.9" />
                                <Circle cx="0" cy="-40" r="50" fill={c.leaf} opacity="0.9" />
                            </G>
                        </G>
                    )}

                    {/* PHASE 5: MASTER TREE (300+ XP) */}
                    {stage === 5 && (
                        <G transform="translate(0, -20)">
                            <Path d="M-20,10 Q0,-140 20,10" stroke={c.tree} strokeWidth="40" fill={c.tree} />
                            <G y="-160">
                                <Circle cx="0" cy="0" r="85" fill={c.leaf} opacity="0.98" />
                                <Circle cx="-60" cy="30" r="65" fill={c.leaf} opacity="0.95" />
                                <Circle cx="60" cy="30" r="65" fill={c.leaf} opacity="0.95" />
                                <Circle cx="-30" cy="-50" r="60" fill={c.leaf} opacity="0.95" />
                                <Circle cx="30" cy="-50" r="60" fill={c.leaf} opacity="0.95" />
                                {!isWithered && (
                                    <>
                                        <Circle cx="-20" cy="10" r="8" fill="#F44336" />
                                        <Circle cx="40" cy="-20" r="8" fill="#FFEB3B" />
                                        <Circle cx="-50" cy="40" r="8" fill="#9C27B0" />
                                    </>
                                )}
                            </G>
                        </G>
                    )}
                </G>
            </Svg>
        </Pressable>
      </Animated.View>

      {/* ELEMENTS OF THE SKY */}
      <View style={styles.skyElements}>
          {isDay ? (
              <Animated.View style={{ opacity: sunMoonAnim.interpolate({inputRange:[0,1], outputRange:[1,0]}) }}>
                  <Sun color="#FDB813" size={60} fill="#FDB813" />
              </Animated.View>
          ) : (
              <Animated.View style={{ opacity: sunMoonAnim }}>
                  <Moon color="#F4F6F0" size={50} fill="#F4F6F0" />
              </Animated.View>
          )}
          {isDay && <Cloud color="rgba(255,255,255,0.6)" fill="white" size={60} style={{ position:'absolute', top: 40, left: 20 }} />}
          {!isDay && <Star color="white" fill="white" size={10} style={{ position:'absolute', top: 50, left: 50 }} />}
      </View>

      {/* EFFECTS */}
      {touchEffect && (
          <View style={[styles.touchBurst, { left: touchEffect.x + width/2 - 150, top: touchEffect.y + GROUND_Y - 300 }]}>
              <Sparkles color="#FFD700" size={30} />
          </View>
      )}

      {/* ENVIRONMENTAL PARTICLES */}
      {!isWithered && (
          <>
            <FloatingParticle style={{ left: '20%', bottom: '30%' }} delay={0} color={isDay ? '#FFF' : '#FFD700'} type={isDay ? 'circle' : 'star'} />
            <FloatingParticle style={{ left: '60%', bottom: '40%' }} delay={1500} color={isDay ? '#FFF' : '#FFD700'} type={isDay ? 'circle' : 'star'} />
            <FloatingParticle style={{ left: '80%', bottom: '25%' }} delay={3000} color={isDay ? '#FFF' : '#FFD700'} type={isDay ? 'circle' : 'star'} />
          </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%', position: 'absolute' },
  plantWrapper: {
      position: 'absolute',
      width: 300,
      height: 300,
      zIndex: 10, 
  },
  skyElements: { position: 'absolute', top: 60, right: 40, alignItems: 'center' },
  touchBurst: { position: 'absolute', opacity: 0.8, zIndex: 20 },
});

export default GardenScene;