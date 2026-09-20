import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Bus = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Welcome to Agric Transport</Text>
        <Text style={styles.subHeading}>
          Order any car that you want to transport your crops.
          You can also order machines for your farm practices
        </Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("cont")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="bus-double-decker" 
            size={80} 
            color="#09e034" 
          />
          <Text style={styles.tapText}>Tap to Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Assuming black based on your previous screens
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f5a53d', // Linkpii theme color
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  tapText: {
    color: '#09e034',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  }
});

export default Bus;