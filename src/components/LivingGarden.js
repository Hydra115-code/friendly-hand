// src/components/LivingGarden.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, Ellipse, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CONTAINER_HEIGHT = height;

// 🌟 Animated Particle Component
const Particle = ({ delay, style, color, duration = 4000 }) => {
  const anim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { 
          toValue: 1, 
          duration: duration + Math.random() * 2000, 
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] });
  const translateX = anim.interpolate({ 
    inputRange: [0, 0.5, 1], 
    outputRange: [0, Math.random() * 20 - 10, 0] 
  });
  const opacity = anim.interpolate({ 
    inputRange: [0, 0.2, 0.8, 1], 
    outputRange: [0, 1, 1, 0] 
  });
  const scale = anim.interpolate({ 
    inputRange: [0, 0.5, 1], 
    outputRange: [0.5, 1, 0.5] 
  });

  return (
    <Animated.View 
      style={[
        styles.particle, 
        style, 
        { 
          backgroundColor: color, 
          opacity, 
          transform: [{ translateY }, { translateX }, { scale }] 
        }
      ]} 
    />
  );
};

// 🌿 Leaf Animation Component
const AnimatedLeaf = ({ d, fill, delay = 0 }) => {
  const anim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { 
          toValue: 1, 
          duration: 2000, 
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sine)
        }),
        Animated.timing(anim, { 
          toValue: 0, 
          duration: 2000, 
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sine)
        })
      ])
    ).start();
  }, []);

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const rotate = anim.interpolate({ 
    inputRange: [0, 1], 
    outputRange: ['0deg', '5deg'] 
  });

  return (
    <AnimatedPath 
      d={d} 
      fill={fill} 
      style={{ transform: [{ rotate }] }}
    />
  );
};

const LivingGarden = ({ theme = 'nature', growthLevel = 0, isWithered = false }) => {
  const breathAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { 
          toValue: 1.08, 
          duration: 3000, 
          easing: Easing.inOut(Easing.ease), 
          useNativeDriver: true 
        }),
        Animated.timing(breathAnim, { 
          toValue: 1, 
          duration: 3000, 
          easing: Easing.inOut(Easing.ease), 
          useNativeDriver: true 
        })
      ])
    ).start();

    // Glow pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { 
          toValue: 1, 
          duration: 2000, 
          easing: Easing.inOut(Easing.ease), 
          useNativeDriver: true 
        }),
        Animated.timing(glowAnim, { 
          toValue: 0.3, 
          duration: 2000, 
          easing: Easing.inOut(Easing.ease), 
          useNativeDriver: true 
        })
      ])
    ).start();
  }, []);

  // 🎨 Enhanced Color Themes
  const getColors = () => {
    if (isWithered) {
      return { 
        sky1: '#2d3436', 
        sky2: '#000000', 
        ground: '#4E342E', 
        tree: '#5D4037', 
        leaf: '#616161', 
        particle: '#757575',
        accent: '#9E9E9E'
      };
    }
    
    switch(theme) {
      case 'space':
        return { 
          sky1: '#0f0c29', 
          sky2: '#302b63', 
          ground: '#240b36', 
          tree: '#00d2d3', 
          leaf: '#5f27cd', 
          particle: '#00d2d3',
          accent: '#ff6b6b'
        };
      case 'tech':
        return { 
          sky1: '#000000', 
          sky2: '#130f40', 
          ground: '#192a56', 
          tree: '#44bd32', 
          leaf: '#0097e6', 
          particle: '#fbc531',
          accent: '#00d2d3'
        };
      default: // nature
        return { 
          sky1: '#87CEEB', 
          sky2: '#E0F6FF', 
          ground: '#8BC34A', 
          tree: '#795548', 
          leaf: '#2E7D32', 
          particle: '#FFD700',
          accent: '#FF6F00'
        };
    }
  };
  
  const c = getColors();
  
  // 🌱 Evolution Stages
  const getEvolutionStage = () => {
    if (growthLevel < 30) return 1; // Sprout
    if (growthLevel < 80) return 2; // Bush
    return 3; // Tree
  };
  
  const stage = getEvolutionStage();
  const groundY = CONTAINER_HEIGHT * 0.75;

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" style={styles.svg}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={c.sky1} />
            <Stop offset="1" stopColor={c.sky2} />
          </LinearGradient>
          <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={c.ground} />
            <Stop offset="1" stopColor={c.tree} stopOpacity="0.3" />
          </LinearGradient>
        </Defs>

        {/* Sky Background */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#sky)" />
        
        {/* Ground with curves */}
        <Path 
          d={`M0,${CONTAINER_HEIGHT} L0,${groundY} Q${width/4},${groundY - 30} ${width/2},${groundY - 20} T${width},${groundY} L${width},${CONTAINER_HEIGHT} Z`} 
          fill="url(#groundGrad)" 
        />

        {/* Grass Details */}
        {[...Array(8)].map((_, i) => (
          <Path
            key={i}
            d={`M${(i + 1) * (width / 9)},${groundY} Q${(i + 1) * (width / 9) + 5},${groundY - 15} ${(i + 1) * (width / 9)},${groundY - 30}`}
            stroke={c.leaf}
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        ))}
      </Svg>

      {/* 🌳 PLANT EVOLUTION */}
      <Animated.View 
        style={[
          styles.plantContainer, 
          { 
            bottom: CONTAINER_HEIGHT - groundY - 10,
            transform: [{ scale: breathAnim }] 
          }
        ]}
      >
        <Svg height="300" width="200" viewBox="0 0 200 300">
          
          {/* STAGE 1: SPROUT (0-30 XP) */}
          {stage === 1 && (
            <G x="100" y="280">
              {/* Soil mound */}
              <Ellipse cx="0" cy="5" rx="35" ry="12" fill={c.tree} opacity="0.7" />
              
              {/* Main stem */}
              <Path 
                d="M0,0 Q2,-25 0,-50 Q-2,-75 0,-90" 
                stroke="#9CCC65" 
                strokeWidth="8" 
                fill="none" 
                strokeLinecap="round" 
              />
              
              {/* Left leaf */}
              <AnimatedLeaf
                d="M0,-60 Q-25,-70 -40,-50 Q-25,-40 -15,-45 Q0,-50 0,-60"
                fill={c.leaf}
                delay={0}
              />
              
              {/* Right leaf */}
              <AnimatedLeaf
                d="M0,-60 Q25,-70 40,-50 Q25,-40 15,-45 Q0,-50 0,-60"
                fill={c.leaf}
                delay={500}
              />
              
              {/* Top bud */}
              <Circle cx="0" cy="-90" r="8" fill={c.accent} opacity="0.8" />
            </G>
          )}

          {/* STAGE 2: BUSH (30-80 XP) */}
          {stage === 2 && (
            <G x="100" y="280">
              {/* Thick trunk */}
              <Path 
                d="M-8,0 Q-10,-40 -5,-80 Q0,-120 0,-140 Q0,-120 5,-80 Q10,-40 8,0 Z" 
                fill={c.tree} 
              />
              
              {/* Branch left */}
              <Path d="M-5,-80 Q-30,-90 -45,-75" stroke={c.tree} strokeWidth="6" fill="none" />
              {/* Branch right */}
              <Path d="M5,-80 Q30,-90 45,-75" stroke={c.tree} strokeWidth="6" fill="none" />
              
              {/* Foliage clusters */}
              <Circle cx="0" cy="-140" r="45" fill={c.leaf} opacity="0.95" />
              <Circle cx="-35" cy="-100" r="35" fill={c.leaf} opacity="0.9" />
              <Circle cx="35" cy="-100" r="35" fill={c.leaf} opacity="0.9" />
              <Circle cx="-45" cy="-75" r="25" fill={c.leaf} opacity="0.85" />
              <Circle cx="45" cy="-75" r="25" fill={c.leaf} opacity="0.85" />
              
              {/* Flowers */}
              {[...Array(3)].map((_, i) => (
                <Circle 
                  key={i} 
                  cx={-30 + i * 30} 
                  cy={-130 + Math.random() * 40} 
                  r="6" 
                  fill={c.particle} 
                />
              ))}
            </G>
          )}

          {/* STAGE 3: TREE (80+ XP) */}
          {stage === 3 && (
            <G x="100" y="280">
              {/* Strong trunk */}
              <Path 
                d="M-18,0 Q-20,-60 -12,-120 Q-5,-180 0,-220 Q5,-180 12,-120 Q20,-60 18,0 Z" 
                fill={c.tree} 
                stroke="#5D4037"
                strokeWidth="2"
              />
              
              {/* Branches */}
              <Path d="M-10,-120 Q-40,-130 -60,-110" stroke={c.tree} strokeWidth="8" fill="none" />
              <Path d="M10,-120 Q40,-130 60,-110" stroke={c.tree} strokeWidth="8" fill="none" />
              <Path d="M-8,-160 Q-35,-170 -50,-155" stroke={c.tree} strokeWidth="6" fill="none" />
              <Path d="M8,-160 Q35,-170 50,-155" stroke={c.tree} strokeWidth="6" fill="none" />
              
              {/* Crown - multiple layers */}
              <Circle cx="0" cy="-220" r="65" fill={c.leaf} opacity="0.95" />
              <Circle cx="-45" cy="-180" r="50" fill={c.leaf} opacity="0.9" />
              <Circle cx="45" cy="-180" r="50" fill={c.leaf} opacity="0.9" />
              <Circle cx="-60" cy="-130" r="40" fill={c.leaf} opacity="0.85" />
              <Circle cx="60" cy="-130" r="40" fill={c.leaf} opacity="0.85" />
              <Circle cx="0" cy="-190" r="45" fill={c.leaf} opacity="0.98" />
              
              {/* Fruits/Flowers */}
              {[...Array(6)].map((_, i) => (
                <Circle 
                  key={i} 
                  cx={-50 + Math.random() * 100} 
                  cy={-220 + Math.random() * 80} 
                  r="8" 
                  fill={c.accent} 
                  opacity="0.9"
                />
              ))}
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* ✨ PARTICLES */}
      {!isWithered && (
        <>
          {[...Array(stage * 3)].map((_, i) => (
            <Particle
              key={i}
              style={{
                left: `${30 + Math.random() * 40}%`,
                bottom: `${40 + Math.random() * 20}%`,
              }}
              delay={i * 800}
              color={c.particle}
              duration={3000 + i * 500}
            />
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute',
    backgroundColor: '#000'
  },
  svg: { 
    flex: 1 
  },
  plantContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LivingGarden;
