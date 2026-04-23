import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import baseURL from '../../assets/common/BaseUrl';

WebBrowser.maybeCompleteAuthSession();

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '450195054535-j1v4j3vcg8rtl0oek01n1g7nkto7c7vc.apps.googleusercontent.com',
   webClientId:"450195054535-tbf14l0n9dhvjon1ili187agq5bcf89k.apps.googleusercontent.com",
   androidClientId:'450195054535-k8ucciq6b7d6tve6036palqqupv68cia.apps.googleusercontent.com'
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      handleGoogleLogin(response.authentication.idToken); // Use idToken instead of accessToken
    }
  }, [response]);

  const handleGoogleLogin = async (token) => {
    try {
      if (!token) {
        console.error('No token received from Google.');
        return;
      }

      const response = await fetch(`${baseURL}auth/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      console.log('Backend Response:', data);

      if (data.success) {
        console.log('User Info:', data.user);
        setUser(data.user);
        await SecureStore.setItemAsync('userToken', data.token);
        onLoginSuccess(data.user, data.token);
      } else {
        console.error('Login failed:', data.message);
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    }
  };

  return <Button title={"Sign in with Google"} onPress={() => promptAsync()} disabled={!request} />;
};

export default GoogleLoginButton;
