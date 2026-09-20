import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/authFirebase";
import axios from "axios";

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();

    // Check if the email and password exist in the database
    if (result.email === email && result.password === password) {
      navigation.navigate("main");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    alert(error.message);
  }
};






return (
  <View style={styles.container}>

    <View style={styles.whiteSheet} />
    <SafeAreaView style={styles.form}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> Log In</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 18 }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
          <Text style={{ color: '#f57c00', fontWeight: 600, fontSize: 18 }}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    <StatusBar barStyle="light-content" />
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#f57c00',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});