import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,Animated, Easing
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import ProductScreen from './ProductsScreen';
import ShopScreen from "./ShopsScreen"
import Services from './Services';
import Agric from '../../Products/ProductsScreen';
import theme from '../Styles/designSystem';

export default function DropdownTabs() {
  const [selected, setSelected] = useState('Buy');
  const [visible, setVisible] = useState(false);

  const options = ['Buy', 'Bulk', 'Services', 'Agric'];

  /* ===== RENDER SCREEN BASED ON SELECTED ===== */

  const renderScreen = () => {
    switch (selected) {
      case 'Buy':
        return <ProductScreen />;
      case 'Bulk':
        return <ShopScreen />;
      case 'Services':
        return <Services />;
      case 'Agric':
        return <Agric />;
     
    }
  };

    const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000, // speed (lower = faster)
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      
      {/* ===== DROPDOWN HEADER ===== */}
      <View style={styles.header}>

      <View>
      <Animated.Image
        source={require('../../assets/splash.png')}
        style={{
          width: 40,
          height: 40,
          borderRadius: 24,
          // transform: [{ rotate }],
        }}
        resizeMode="contain"
      />
      </View>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.dropdownText}>{selected}</Text>
          <FontAwesome name="chevron-down" size={14} color={theme.colors.ink700} />
        </TouchableOpacity>
      </View>

      {/* ===== SCREEN CONTENT ===== */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* ===== DROPDOWN MODAL ===== */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdownMenu}>
            {options.map((item) => {
              const isActive = item === selected;
              return (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelected(item);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                    {item}
                  </Text>
                  {isActive && <FontAwesome name="check" size={14} color={theme.colors.brand600} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 30,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.ink100,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    alignSelf: 'flex-start',
    left: 20,
    gap: 8,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.ink900,
    marginRight: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  dropdownMenu: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.sm,
    ...theme.shadow.floating,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: theme.colors.ink700,
    fontWeight: '500',
  },
  dropdownItemTextActive: {
    color: theme.colors.brand700,
    fontWeight: '700',
  },
});
