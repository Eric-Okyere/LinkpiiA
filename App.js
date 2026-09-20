import './gesture-handler'; // MUST be at the very top
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Alert, 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  StatusBar,
  Platform 
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper'; 
import { PersistGate } from 'redux-persist/integration/react';
import * as Updates from 'expo-updates'; 
import * as Network from 'expo-network';
import { MaterialIcons } from '@expo/vector-icons';

// Internal Imports
import store, { persistor } from "./src/Redux/store";
import UserNav from "./Navigations/UserNavigator.jsx";

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

  // --- 1. PREMIUM SILENT OTA UPDATE LOGIC ---
  const handleSelfUpdate = async () => {
    if (__DEV__) return; // Don't run in development mode

    try {
      // Step A: Silently check if an update exists on the server
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        // Step B: Download the update in the background while the user works
        await Updates.fetchUpdateAsync();
        
        // Step C: Once fully downloaded, show a professional prompt
        Alert.alert(
          '✨ Enhancements Ready',
          'We’ve just added some improvements to make your experience smoother. Would you like to apply them now?',
          [
            { 
              text: 'Later', 
              style: 'cancel' 
            },
            { 
              text: 'Update & Restart', 
              onPress: async () => {
                // Instantly reloads the app with the new JavaScript bundle
                await Updates.reloadAsync();
              } 
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      // Fails silently if internet is spotty during the check
      console.log('Update sync skipped:', error);
    }
  };

  // --- 2. LIFECYCLE & NETWORK MONITORING ---
  useEffect(() => {
    // Run the silent update check on app launch
    handleSelfUpdate();

    // Monitor internet status every 5 seconds to show/hide the red banner
    const interval = setInterval(async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        // Check if internet is actually reachable (not just "on")
        const online = state.isConnected && state.isInternetReachable !== false;
        
        if (online !== isConnected) {
          setIsConnected(online);
        }
      } catch (e) {
        setIsConnected(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider> 
          <NavigationContainer>
            <View style={styles.container}>
              {/* StatusBar background color shifts to red when offline */}
              <StatusBar 
                barStyle="light-content" 
                backgroundColor={isConnected ? "black" : "#ff5252"} 
              />

              {/* PROFESSIONAL OFFLINE BANNER */}
              {!isConnected && (
                <View style={styles.offlineBanner}>
                  
                    <View style={styles.bannerContent}>
                      <MaterialIcons name="cloud-off" size={16} color="white" />
                      <Text style={styles.offlineText}>
                        No Internet Connection.
                      </Text>
                    </View>
                 
                </View>
              )}

              {/* MAIN APP NAVIGATION */}
              <UserNav />
            </View>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  // Floating Banner for connection warnings
  offlineBanner: {
    backgroundColor: '#ff5252',
    width: '100%',
    zIndex: 9999, // Keeps it above the header
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 10 : 12,
    paddingHorizontal: 20,
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});