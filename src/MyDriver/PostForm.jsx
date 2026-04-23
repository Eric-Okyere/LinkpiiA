import React, { useState, useEffect, useRef, memo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Alert
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome6
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from 'react-native-country-picker-modal';
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import Error from "../../src/User/Error";

const { width } = Dimensions.get("window");

// --- REUSABLE CONTACT COMPONENT ---
const ContactField = memo(({ label, value, onChange, country, onSelect, icon }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.phoneRow}>
      <View style={styles.countryWrap}>
        <CountryPicker
          countryCode={country.code}
          withFilter withFlag withCallingCode
          onSelect={(c) => onSelect({ code: c.cca2, callingCode: c.callingCode[0] })}
        />
        <Text style={styles.dialText}>+{country.callingCode}</Text>
      </View>
      <View style={styles.phoneInputWrap}>
        <Ionicons name={icon} size={18} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.flexInput}
          placeholder="Number"
          keyboardType="phone-pad"
          value={value}
          onChangeText={t => onChange(t.replace(/^0/, ''))}
        />
      </View>
    </View>
  </View>
));

function PostFrom({ route }) {
  const navigation = useNavigation();
  const login = useSelector((state) => state.user?.user?.userId || state.user?.userId || state.user);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Media States
  const [driverpic, setDriverpic] = useState(null);
  const [carpic, setCarPic] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [carnum, setcarNum] = useState("");
  const [card, setCard] = useState("");
  const [size, setSize] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [location, setLocation] = useState("");

  // Contact States
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState({ code: 'GH', callingCode: '233' });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    const item = route.params?.item;
    if (item) {
      setEditItem(item);
      setName(item.name || "");
      setcarNum(item.carnum || "");
      setPhone(item.phone?.replace(/^\+\d{1,3}/, "") || "");
      setRegion(item.region || "");
      setTown(item.town || "");
      setLocation(item.location || "");
      setDriverpic(item.driverpic || null);
      setCarPic(item.carpic || null);
      setCard(item.card || "");
      setSize(item.size || "");
    }
  }, [route.params?.item]);

const pickMedia = async (type) => {
  try {
    const mediaType =
      type === "video"
        ? ImagePicker.MediaTypeOptions.Videos
        : ImagePicker.MediaTypeOptions.Images;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;

      if (type === "pic1") setPicture(uri);
      if (type === "pic2") setPicturesec(uri);
      if (type === "video") setVideo(uri);
    }
  } catch (err) {
    Alert.alert("Error", "Could not access media.");
  }
};

  const handleSubmit = async () => {
    if (!driverpic || !carpic || !name || !phone || !carnum || !size) {
      setError("Please fill all required fields (*)");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("driverpic", { uri: driverpic, type: "image/jpeg", name: "driver.jpg" });
      formData.append("carpic", { uri: carpic, type: "image/jpeg", name: "vehicle.jpg" });
      
      formData.append("name", name);
      formData.append("phone", `+${phoneCountry.callingCode}${phone}`);
      formData.append("carnum", carnum);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("location", location);
      formData.append("card", card);
      formData.append("size", size);
      formData.append("userId", login);

      const url = editItem ? `${baseURL}cars/${editItem._id}` : `${baseURL}cars/createcar`;
      const method = editItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", editItem ? "Details updated!" : "Registration submitted for approval!");
        navigation.navigate("listcars");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={styles.mainTitle}>{editItem ? "Edit Driver" : "Register Driver"}</Text>
              <Text style={styles.subTitle}>Join our fleet of professional haulers</Text>
            </View>

            <View style={styles.mediaContainer}>
              <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('driver')}>
                {driverpic ? (
                  <Image source={{ uri: driverpic }} style={styles.fullMedia} />
                ) : (
                  <View style={styles.placeholderIcon}>
                    <Ionicons name="person-outline" size={32} color="#ccc" />
                    <Text style={styles.iconLabel}>Driver Photo *</Text>
                  </View>
                )}
                <View style={styles.badge}><FontAwesome6 name="plus" size={10} color="white" /></View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('car')}>
                {carpic ? (
                  <Image source={{ uri: carpic }} style={styles.fullMedia} />
                ) : (
                  <View style={styles.placeholderIcon}>
                    <Ionicons name="bus-outline" size={32} color="#ccc" />
                    <Text style={styles.iconLabel}>Vehicle Photo *</Text>
                  </View>
                )}
                <View style={styles.badge}><FontAwesome6 name="plus" size={10} color="white" /></View>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>Personal Information</Text>
              <TextInput style={styles.input} placeholder="Full Name *" value={name} onChangeText={setName} />
              <ContactField 
                label="Primary Contact *" 
                icon="call-outline" 
                value={phone} 
                onChange={setPhone} 
                country={phoneCountry} 
                onSelect={setPhoneCountry} 
              />
              <TextInput style={styles.input} placeholder="License / Ghana Card Number *" value={card} onChangeText={setCard} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>Vehicle Details</Text>
              <TextInput style={styles.input} placeholder="Vehicle Number Plate *" value={carnum} onChangeText={setcarNum} />
              
              <View style={styles.pickerBox}>
                <Picker selectedValue={size} onValueChange={setSize}>
                  <Picker.Item label="Select Vehicle Size *" value="" color="#999" />
                  <Picker.Item label="Small (Pickup/Van)" value="small" />
                  <Picker.Item label="Medium (Truck)" value="medium" />
                  <Picker.Item label="Big (Heavy Trailer)" value="big" />
                </Picker>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>Base Location</Text>
              <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="Region" value={region} onChangeText={setRegion} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Town" value={town} onChangeText={setTown} />
              </View>
              <TextInput style={styles.input} placeholder="Exact Landmark" value={location} onChangeText={setLocation} />
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>{editItem ? "Update Registration" : "Apply for Approval"}</Text>}
            </TouchableOpacity>

            <Animated.View style={[styles.notice, { transform: [{ scale: pulseAnim }] }]}>
              <MaterialCommunityIcons name="shield-account-outline" size={22} color="#111" />
              <Text style={styles.noticeText}>Verification Required: Ensure your profile pictures match your ID for fast activation.</Text>
            </Animated.View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  scrollBody: { paddingBottom: 60, paddingHorizontal: 20, paddingTop: 1 },
  header: { marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: "800", color: "#111" },
  subTitle: { fontSize: 14, color: "#666", marginTop: 4 },
  mediaContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  mediaBox: { width: (width - 60) / 2.5, height: 120, backgroundColor: "white", borderRadius: 18, justifyContent: "center", alignItems: "center", elevation: 3, marginRight: 15 },
  fullMedia: { width: "100%", height: "100%", borderRadius: 18 },
  placeholderIcon: { alignItems: 'center' },
  iconLabel: { fontSize: 10, color: '#ccc', marginTop: 4, fontWeight: '600', textAlign: 'center' },
  badge: { position: "absolute", bottom: -4, right: -4, backgroundColor: "#f5a53d", padding: 5, borderRadius: 15, borderWidth: 2, borderColor: "white" },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18, marginBottom: 18, elevation: 2 },
  cardHeader: { fontSize: 12, fontWeight: "bold", color: "#f5a53d", textTransform: 'uppercase', marginBottom: 15 },
  input: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 16, height: 52, color: "#000" },
  row: { flexDirection: "row" },
  pickerBox: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 12, marginBottom: 14 },
  inputGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#444", marginBottom: 6 },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f2f8", borderRadius: 12, paddingHorizontal: 10, height: 52, marginRight: 8 },
  dialText: { fontWeight: "bold", marginLeft: 4 },
  phoneInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 12, paddingHorizontal: 12, height: 52 },
  flexInput: { flex: 1, fontSize: 16 },
  submitBtn: { backgroundColor: "#000", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 10 },
  submitText: { color: "white", fontWeight: "bold", fontSize: 17 },
  notice: { flexDirection: "row", backgroundColor: "#f5a53d", padding: 16, borderRadius: 18, marginTop: 30, alignItems: "center", marginBottom:60, elevation: 3 },
  noticeText: { flex: 1, marginLeft: 10, fontSize: 12, fontWeight: "bold", color: "#111" }
});

export default PostFrom;