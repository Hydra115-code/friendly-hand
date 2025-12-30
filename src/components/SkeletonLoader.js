// src/components/SkeletonLoader.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../config/theme';

const SkeletonLoader = ({ width = '100%', height = 20, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // "Breathing" loop animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border, // A soft gray base
    borderRadius: 8,
  },
});

export default SkeletonLoader;