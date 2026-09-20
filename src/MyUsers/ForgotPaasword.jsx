import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from "yup";
import axios from 'axios';  
import Toast from 'react-native-toast-message';  // Import Toast
import baseURL from '../../assets/common/BaseUrl';


const initialValues = {
    phone: "",
    
};

const validationSchema = yup.object({
    phone: yup.string().trim().required("Please input your phone number!"),
});

const ForgotPassword = ({ navigation }) => {


    const handleForgetpassword = async (value, formikActions) => {
        try {
            const res = await axios.post(`${baseURL}forgpass`, { 
                phone: value.phone,
                usermessage: 'Password reset request'  // Adding usermessage
            });
            
            // Handle success response
            if (res.data.success) {
                Alert.alert('Success', res.data.message,);
                navigation.navigate("signup")
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: res.data.message,
                    position: 'top'
                });
            }
    
        } catch (error) {
            console.error('Error during password reset:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || "An unexpected error occurred",
                position: 'top'
            });
        } finally {
            formikActions.setSubmitting(false); // Stop the form submission loader
        }
    };
    

    return (
        <>
            <View style={styles.container}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleForgetpassword}
                >
                    {({ errors, values, touched, handleSubmit, handleChange, handleBlur }) => {
                        return (
                            <>
                                <Text style={styles.logo}>Reset Password</Text>
                                <View style={{ top: 70 }}>
                                    <Text style={styles.err}>
                                        {touched.phone && errors.phone ? errors.phone : ""}
                                    </Text>
                                    <TextInput
                                        autoCapitalize='none'
                                        onChangeText={handleChange("phone")}
                                        placeholder='Please enter your phone number'
                                        style={styles.input}
                                        onBlur={handleBlur("phone")}
                                    />

                                    <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                                        <Text style={{ fontSize: 20 }}>Send</Text>
                                    </TouchableOpacity>

                                    <View style={{ justifyContent: "space-between", flexDirection: "row", margin: 20 }}>
                                        <TouchableOpacity
                                            style={styles.btncont}
                                            onPress={() => navigation.navigate("login")}
                                        >
                                            <Text>Log in</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.btncont}
                                            onPress={() => navigation.navigate("signup")}
                                        >
                                            <Text>Sign up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        );
                    }}
                </Formik>
            </View>
            
            {/* Add Toast component here */}
            <Toast />
        </>
    );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        top: 30,
        color: "#f5a53d",
        fontSize: 35,
        fontWeight: "bold"
    },
    input: {
        borderWidth: 1,
        marginBottom: 15,
        width: width - 40,
        height: 40,
        backgroundColor: "#e1e6ed",
        fontSize: 20,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    btn: {
        alignItems: "center",
        margin: 10,
        backgroundColor: "#f5a53d",
        padding: 7,
        borderRadius: 20
    },
    btncont: {
        backgroundColor: "#f5a53d",
        padding: 12,
        borderRadius: 20
    },
    err: {
        color: "red"
    }
});

export default ForgotPassword;
