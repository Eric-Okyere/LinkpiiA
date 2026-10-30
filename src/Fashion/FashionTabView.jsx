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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
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
          <FontAwesome name="chevron-down" size={16} />
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
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelected(item);
                  setVisible(false);
                }}
              >
                <Text style={{ fontSize: 16 }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 1,
    left:20
  },
  dropdownText: {
    fontSize: 16,
    marginRight: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});