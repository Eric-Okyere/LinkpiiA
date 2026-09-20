import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Dimensions
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function SellScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Agriculture products only</Text>
        </View>

        <View style={styles.mainContent}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.iconWrapper}>
              <TouchableOpacity 
                style={styles.circleButton}
                onPress={() => navigation.navigate("library")}
              >
                <MaterialIcons name="photo-library" size={54} color="black" />
                <Text style={styles.buttonLabel}>Open Library</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>

      </View>
    </View>
  );
}

export default SellScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5a53d",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  mainContent: {
    marginTop: 20,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 30,
    borderRadius: 100,
  },
  buttonLabel: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    color: "black",
  },
});