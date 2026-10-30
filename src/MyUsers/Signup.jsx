import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as yup from 'yup';
import AppNotification from '../AppNotification';
import { signup, updateNotification } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../Redux/actions';
import baseURL from '../../assets/common/BaseUrl';
import axios from 'axios';
import AuthField from '../components/AuthField';

const GOLD = '#f5a53d';

const initialValues = {
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = yup.object({
  name: yup.string().trim().required('Please input your first name!'),
  lastname: yup.string().trim().required('Please input your last name!'),
  email: yup.string().trim().email('Invalid email').required('Please input your email!'),
  phone: yup
    .string()
    .trim()
    .required('Please input your phone number!')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  password: yup.string().trim().min(4, 'Your password is too short!').required('Please input your password!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password!'),
});

const Signup = ({ navigation }) => {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [agreeLoading, setAgreeLoading] = useState(false);
  const [eulaVisible, setEulaVisible] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const lastnameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const checkForToxicComments = async (text) => {
    try {
      const response = await axios.post(`${baseURL}toxic/analyze`, { text });
      return response.data.isToxic;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSignup = async (values, formikActions) => {
    setLoading(true);
    const isToxic = await checkForToxicComments(`${values.name} ${values.lastname}`);

    if (isToxic) {
      setLoading(false);
      return updateNotification(setMessage, 'Your input contains inappropriate language.');
    }

    const res = await signup(values);
    formikActions.setSubmitting(false);
    setLoading(false);
    if (!res.success) {
      return updateNotification(setMessage, res.message);
    } else {
      formikActions.resetForm();
      dispatch(signUp(res.user.id));
      setEulaVisible(true);
    }
  };

  const handleAgree = async () => {
    setAgreeLoading(true);
    try {
      const response = await axios.put(`${baseURL}eula/${userState}/eula`);
      if (response.status === 200) {
        setEulaVisible(false);
        navigation.navigate('login');
      } else {
        setMessage({ text: 'Failed to accept EULA', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Internal Server Error', type: 'error' });
    } finally {
      setAgreeLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
        >
          {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.brandWrap}>
                <View style={styles.logoRing}>
                  <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                </View>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Join Linkpii to buy, sell and connect</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.rowField}>
                    <AuthField
                      icon="person-outline"
                      placeholder="First name"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      error={errors.name}
                      touched={touched.name}
                      returnKeyType="next"
                      onSubmitEditing={() => lastnameRef.current && lastnameRef.current.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                  <View style={styles.rowField}>
                    <AuthField
                      inputRef={lastnameRef}
                      icon="person-outline"
                      placeholder="Last name"
                      value={values.lastname}
                      onChangeText={handleChange('lastname')}
                      onBlur={handleBlur('lastname')}
                      error={errors.lastname}
                      touched={touched.lastname}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <AuthField
                  inputRef={emailRef}
                  icon="mail-outline"
                  placeholder="example@gmail.com"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current && phoneRef.current.focus()}
                  blurOnSubmit={false}
                />

                <AuthField
                  inputRef={phoneRef}
                  icon="phone-iphone"
                  placeholder="Phone number"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="numeric"
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
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current && confirmPasswordRef.current.focus()}
                  blurOnSubmit={false}
                />

                <AuthField
                  inputRef={confirmPasswordRef}
                  icon="lock-outline"
                  placeholder="Confirm password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  secureToggle
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />

                {message.text ? <AppNotification type={message.type} text={message.text} /> : null}

                <TouchableOpacity
                  style={[styles.btn, loading && styles.btnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.btnText}>Create account</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.loginRow}>
                <Text style={styles.loginPrompt}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                  <Text style={styles.loginLink}>Log in</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Formik>

        <Modal animationType="slide" transparent visible={eulaVisible}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>End User License Agreement (EULA)</Text>
              <Text style={styles.eulaContent}>
                1. Introduction{'\n'}Linkpii is an application that allows users to generate, submit, and sell content...
              </Text>
              <Text style={styles.eulaContent}>
                17. Acknowledgment{'\n'}By downloading, installing, or using the Application, you acknowledge that you have read and understood this Agreement.
              </Text>
            </ScrollView>

            <TouchableOpacity style={styles.agreeButton} onPress={handleAgree} disabled={agreeLoading}>
              {agreeLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.agreeButtonText}>I Agree</Text>}
            </TouchableOpacity>
          </View>
        </Modal>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  brandWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9a9a9a',
    fontSize: 14,
    textAlign: 'center',
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowField: {
    flex: 1,
  },
  btn: {
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  loginPrompt: {
    color: '#9a9a9a',
    fontSize: 14,
    marginRight: 6,
  },
  loginLink: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '700',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e1e1e',
  },
  eulaContent: {
    fontSize: 14,
    color: '#444',
    marginBottom: 15,
    lineHeight: 20,
  },
  agreeButton: {
    backgroundColor: GOLD,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  agreeButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Signup;
