import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signin } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loggedIn } from '../Redux/actions';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

// ✅ Google Auth
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = yup.object({
  email: yup.string().trim().required('Please input your email!'),
  password: yup
    .string()
    .trim()
    .min(4, 'Your password is too short!')
    .required('Please input your password!'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const login = useSelector((state) => state.login);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Google config
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  });

  useEffect(() => {
    if (login) {
      navigation.navigate('welcome');
    }
  }, []);

  // ✅ Handle Google response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  // ✅ Fetch Google user info
  const getUserInfo = async (token) => {
    try {
      setGoogleLoading(true);

      const res = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await res.json();

      // Send to backend
      const backendRes = await signin({
        email: user.email,
        googleId: user.id,
        name: user.name,
      });

      if (backendRes.success) {
        await handleGoogleLoginSuccess(
          backendRes.user,
          backendRes.token
        );
      } else {
        setErrorMessage('Google login failed');
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error(error);
      setGoogleLoading(false);
    }
  };

  // ✅ Save login
  const handleGoogleLoginSuccess = async (user, token) => {
    try {
      dispatch(loggedIn(user.id));
      await SecureStore.setItemAsync('authToken', token);

      setGoogleLoading(false);
      navigation.navigate('welcome');
    } catch (error) {
      console.error(error);
      setGoogleLoading(false);
    }
  };

  // ✅ Email login
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await signin(values);

      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        dispatch(loggedIn(res.user.id));
        navigation.navigate('welcome');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          errors,
          values,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => (
          <>
            <Text style={styles.title}>Feel free to login</Text>

            <View style={styles.form}>
              <Text style={styles.errorText}>
                {touched.email && errors.email}
              </Text>

              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />

              <Text style={styles.errorText}>
                {touched.password && errors.password}
              </Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  value={values.password}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              {/* EMAIL LOGIN */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* GOOGLE LOGIN */}
              <TouchableOpacity
                style={[styles.loginButton, { marginTop: 15 }]}
                onPress={() => promptAsync({ useProxy: true })}
                disabled={!request || googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Image
                      source={{
                        uri: 'https://developers.google.com/identity/images/g-logo.png',
                      }}
                      style={styles.googleLogo}
                    />
                    <Text style={styles.loginButtonText}>
                      Sign in with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  title: { color: '#f5a53d', fontSize: 22, textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#e1e6ed', borderRadius: 8, padding: 12, marginBottom: 10 },
  passwordContainer: { flexDirection: 'row', backgroundColor: '#e1e6ed', borderRadius: 8, paddingHorizontal: 10, alignItems: 'center' },
  passwordInput: { flex: 1 },
  loginButton: { backgroundColor: '#f5a53d', padding: 12, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  loginButtonText: { fontWeight: '600' },
  googleLogo: { width: 20, height: 20, marginRight: 10 },
  errorText: { color: 'red', fontSize: 12 },
});

export default Login;