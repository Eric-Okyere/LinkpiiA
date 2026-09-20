import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, Animated, Dimensions } from "react-native";
import { EvilIcons, Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const LikeButton = ({ itemId, onCelebrate, onToggle, liked   }) => {
  

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const { height, width } = Dimensions.get('window');
  

  const triggerCelebration = () => {
    // Scale (Native driver)
    Animated.spring(scaleAnim, {
      toValue: 1.4,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });

    // Glow (JS driver)
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    // Soft vibration
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePress = () => {
    const newState = !liked;
    onToggle(newState);           // Inform parent
    if (newState) triggerCelebration();
    if (newState && onCelebrate) onCelebrate();
  };


    useEffect(() => {
    if (liked) {
      // Heart bounce animation
      Animated.spring(scaleAnim, {
        toValue: 1.4,
        friction: 3,
        tension: 120,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });

      // Glow pulse
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();

      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [liked]);

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* Glow Layer */}
      <Animated.View
        style={{
          borderRadius: 30,
          shadowColor: "#f5a53d",
          shadowOpacity: glowAnim,
          shadowRadius: 20,
          elevation: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12],
          }),
        }}
      >
        {/* Scale Layer */}
        <Animated.View
          style={{
          borderRadius: 25,
            transform: [{ scale: scaleAnim }],
          }}
        >
       {liked ? (
            <Entypo name="heart" style={{ right: 2, top:2 }} size={22} color="#f5a53d" />
          ) : (
            <Entypo name="heart" size={22} color="#f9e0bf" />
          )}
  
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default LikeButton;