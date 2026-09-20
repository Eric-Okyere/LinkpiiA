import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from "yup"
import { signin, updateNotification } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loggedIn } from "../Redux/actions"
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import GoogleLogo from "../../assets/Google.png"
import * as SecureStore from 'expo-secure-store';
import GoogleSigninBut from './GoogleSigninBut';





const initialValues = {
    email:"",
    password:""
}

const validationSchema = yup.object({
    email: yup.string().trim().required("Please input your email!"),
    password: yup.string().trim().min(4,"Your password is too short!").required("Please input your password!"),
})


const Login = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 
    const login = useSelector((state) => state.login)
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false); 

    useEffect(() => {
        const checkLogin = () => {
            if (login) {
                navigation.navigate('welcome')
            } 
        }
        checkLogin()
    }, [])

    // useEffect(() => {
    //     if (userState.userInfo) {
    //         navigation.navigate("welcome");
    //     }
    // }, [userState.userInfo]);

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const res = await signin(values);
            if (!res.success) {
                setErrorMessage(res.error); // Set error message state
            } else {
                navigation.navigate("welcome");
                dispatch(loggedIn(res.user.id));
            }
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage("An error occurred during login. Please try again."); // Set a generic error message
        } finally {
            setLoading(false);
        }
    };
    


    const handleGoogleLoginSuccess = async (user, token) => {
        setGoogleLoading(true); // ⬅️ Start loading after Google login success

        dispatch(loggedIn(user.id));

        try {
            await SecureStore.setItemAsync('authToken', token);
            console.log("Token saved securely");

            // Simulate waiting for the next page (optional)
            setTimeout(() => {
                setGoogleLoading(false);
                navigation.navigate("welcome");
            }, 2000); // Adjust timing as needed
        } catch (error) {
            console.error("Error saving token:", error);
            setGoogleLoading(false);
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
                autoCapitalize="none"
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
                  onBlur={handleBlur('password')}
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

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('forgotten')}
              >
                <Text style={styles.forgotText}>Forgotten Password?</Text>
              </TouchableOpacity>

              <View style={styles.signupRow}>
                <Text style={styles.signupPrompt}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => navigation.navigate('signup')}
                >
                  <Text>Signup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </Formik>



            {/* <View style={{flexDirection:"row", alignItems:"center", alignSelf:"center", top:8}}>
                      <Image source={GoogleLogo} style={styles.googleLogo} />
                      <GoogleSigninBut onLoginSuccess={handleGoogleLoginSuccess} />
                      </View>

            {googleLoading && <ActivityIndicator size="large" color="#f5a53d" />} */}


        </View>
    );
};

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      title: {
        color: '#f5a53d',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
      },
      form: {
        width: '100%',
      },
      input: {
        backgroundColor: '#e1e6ed',
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 15,
        height: 44,
        marginBottom: 12,
      },
      passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e1e6ed',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 44,
        marginBottom: 12,
      },
      passwordInput: {
        flex: 1,
        fontSize: 16,
      },
      loginButton: {
        backgroundColor: '#f5a53d',
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
      },
      loginButtonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
      },
      forgotText: {
        color: '#eae6e6',
        alignSelf: 'flex-end',
        marginTop: 8,
      },
      signupRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
      },
      signupPrompt: {
        color: '#f5a53d',
        fontSize: 16,
      },
      signupButton: {
        backgroundColor: '#f5a53d',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
      },
      errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 5,
      },
      googleLoginRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
      },
      googleLogo: {
        width: 24,
        height: 24,
        marginRight: 8,
      },
    })

export default Login;
