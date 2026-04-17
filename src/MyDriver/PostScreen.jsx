import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function Register() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.centerHeader}>
          <Text style={styles.heading}>Become Linkpii Kia Driver</Text>
        </View>

        <View style={styles.vStack}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.iconContainer}>
              {/* Camera/Photo Library Button */}
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={() => navigation.navigate("Postform")}
              >
                <MaterialIcons name="photo-library" size={54} color="black" />
                <Text style={styles.buttonLabel}>Select Photo</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5a53d",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  centerHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 100,
    textAlign: "center",
    color: "black",
  },
  vStack: {
    marginTop: 40,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  photoButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    marginTop: 10,
    fontWeight: "600",
    color: "black",
  }
});