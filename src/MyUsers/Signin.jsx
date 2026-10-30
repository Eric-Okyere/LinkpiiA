import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signin, updateNotification } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loggedIn } from '../Redux/actions';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import GoogleSigninBut from './GoogleSigninBut';
import AuthField from '../components/AuthField';

const GOLD = '#f5a53d';

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const login = useSelector((state) => state.login);
  const [googleLoading, setGoogleLoading] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    const checkLogin = () => {
      if (login) {
        navigation.navigate('welcome');
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await signin(values);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        navigation.navigate('welcome');
        dispatch(loggedIn(res.user.id));
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (user, token) => {
    setGoogleLoading(true);

    dispatch(loggedIn(user.id));

    try {
      await SecureStore.setItemAsync('authToken', token);
      console.log('Token saved securely');

      setTimeout(() => {
        setGoogleLoading(false);
        navigation.navigate('welcome');
      }, 2000);
    } catch (error) {
      console.error('Error saving token:', error);
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandWrap}>
            <View style={styles.logoRing}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue to Linkpii</Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
              <View style={styles.card}>
                <AuthField
                  icon="mail-outline"
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
                  blurOnSubmit={false}
                />

                <AuthField
                  inputRef={passwordRef}
                  icon="lock-outline"
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  secureToggle
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />

                <TouchableOpacity
                  style={styles.forgotWrap}
                  onPress={() => navigation.navigate('forgotten')}
                >
                  <Text style={styles.forgotText}>Forgotten password?</Text>
                </TouchableOpacity>

                {errorMessage ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.loginButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <GoogleSigninBut onLoginSuccess={handleGoogleLoginSuccess} />

                {googleLoading && (
                  <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 14 }} />
                )}
              </View>
            )}
          </Formik>

          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('signup')}>
              <Text style={styles.signupLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  brandWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 46,
    height: 46,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9a9a9a',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#0d0d0d',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 6,
  },
  forgotText: {
    color: '#aaa',
    fontSize: 13,
  },
  errorBanner: {
    backgroundColor: 'rgba(229,72,77,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229,72,77,0.4)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorBannerText: {
    color: '#ff8086',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#262626',
  },
  dividerText: {
    color: '#777',
    fontSize: 12,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  signupPrompt: {
    color: '#9a9a9a',
    fontSize: 14,
    marginRight: 6,
  },
  signupLink: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Login;
