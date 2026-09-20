import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  Dimensions, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import AppNotification from '../AppNotification';
import { signup, updateNotification } from '../api/auth';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../Redux/actions';
import baseURL from '../../assets/common/BaseUrl';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const initialValues = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = yup.object({
  name: yup.string().trim().required("Please input your first name!"),
  lastname: yup.string().trim().required("Please input your last name!"),
  email: yup.string().trim().email("Invalid email").required("Please input your email!"),
  phone: yup.string().trim().required("Please input your phone number!")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  password: yup.string().trim().min(4, "Your password is too short!").required("Please input your password!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password!"),
});

const Signup = ({ navigation }) => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [agreeLoading, setAgreeLoading] = useState(false);
  const [eulaVisible, setEulaVisible] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      return updateNotification(setMessage, "Your input contains inappropriate language.");
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
        navigation.navigate("login");
      } else {
        setMessage({ text: "Failed to accept EULA", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Internal Server Error", type: "error" });
    } finally {
      setAgreeLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled" 
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginTop: 80 }}>
              <Text style={styles.headerText}>Register with us</Text>
              
              <View style={styles.formContent}>
                <Text style={styles.err}>{touched.name && errors.name ? errors.name : ""}</Text>
                <TextInput 
                  onChangeText={handleChange("name")}  
                  placeholder='Enter your first name' 
                  style={styles.input} 
                  onBlur={handleBlur("name")}
                  value={values.name}
                />

                <Text style={styles.err}>{touched.lastname && errors.lastname ? errors.lastname : ""}</Text>
                <TextInput 
                  onChangeText={handleChange("lastname")}  
                  placeholder='Enter your last name' 
                  style={styles.input} 
                  onBlur={handleBlur("lastname")}
                  value={values.lastname}
                />

                <Text style={styles.err}>{touched.email && errors.email ? errors.email : ""}</Text>
                <TextInput 
                  autoCapitalize='none' 
                  onChangeText={handleChange("email")} 
                  placeholder='example@gmail.com' 
                  style={styles.input} 
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />

                <Text style={styles.err}>{touched.phone && errors.phone ? errors.phone : ""}</Text>
                <TextInput 
                  keyboardType='numeric' 
                  autoCapitalize='none' 
                  onChangeText={handleChange("phone")} 
                  placeholder='Enter phone number' 
                  style={styles.input} 
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                />

                <Text style={styles.err}>{touched.password && errors.password ? errors.password : ""}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passinput}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.err}>{touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passinput}
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
                  </TouchableOpacity>
                </View>

                {message.text ? (<AppNotification type={message.type} text={message.text} />) : null}

                <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Signup</Text>
                  )}
                </TouchableOpacity>

                {/* Replaced Center with a centered View */}
                <View style={styles.centerContainer}>
                  <View style={styles.loginPrompt}>
                    <Text style={styles.promptText}>Already have an account?</Text>
                    <TouchableOpacity style={styles.btncont} onPress={() => navigation.navigate("login")}>
                      <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>

      <Modal animationType="slide" transparent={true} visible={eulaVisible}>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>End User License Agreement (EULA)</Text>
            <Text style={styles.eulaContent}>1. Introduction{"\n"}Linkpii is an application that allows users to generate, submit, and sell content...</Text>
            {/* ... Add remaining EULA text here ... */}
            <Text style={styles.eulaContent}>17. Acknowledgment{"\n"}By downloading, installing, or using the Application, you acknowledge that you have read and understood this Agreement.</Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.agreeButton}
            onPress={handleAgree}
            disabled={agreeLoading}
          >
            {agreeLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>I Agree</Text>}
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  formContent: {
    paddingHorizontal: 20,
    marginTop: -20
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f5a53d",
    textAlign: "center",
    marginBottom: 40
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  passinput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#f5a53d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  err: {
    color: "#e53935",
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 4,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
  },
  promptText: {
    fontSize: 15,
    color: "#f5a53d",
    marginRight: 8,
  },
  btncont: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f5a53d",
  },
  modalView: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1e1e1e",
  },
  eulaContent: {
    fontSize: 14,
    color: "#444",
    marginBottom: 15,
    lineHeight: 20,
  },
  agreeButton: {
    backgroundColor: "#f5a53d",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});

export default Signup;