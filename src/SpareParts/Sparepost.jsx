import React, { useState, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { Picker } from "@react-native-picker/picker";
import CountryPicker from 'react-native-country-picker-modal';
import baseURL from "../../assets/common/BaseUrl";

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

export default function Sparepost() {
  const [picture, setPicture] = useState(null);
  const [picture2, setPicture2] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const player = useVideoPlayer(video, (p) => {
    p.loop = true;
    if (video) p.play();
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [pickerValue, setPickerValue] = useState("");

  // Contact States
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState({ code: 'GH', callingCode: '233' });
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState({ code: 'GH', callingCode: '233' });

  useEffect(() => {
    fetch(`${baseURL}sparecatnew`)
      .then(res => res.json())
      .then(results => setCategories(results))
      .catch(err => console.log(err));
  }, []);



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

  const submitPost = async () => {
    if (!name || !price || !phone || !description || !pickerValue || !region || !town) {
      Alert.alert("Required fields (*) are missing");
      return;
    }

    setIsLoading(true);
    // Logic for your backend fetch would go here, similar to your other pages.
    console.log("Submitting with phone:", `+${phoneCountry.callingCode}${phone}`);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Spare part posted for approval");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Post Spare Part</Text>
              <Text style={styles.headerSub}>List car parts, accessories, or tools</Text>
            </View>

            {/* Media Card */}
            <View style={styles.card}>
              <Text style={styles.label}>Product Media *</Text>
              <View style={styles.mediaRow}>
                <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('pic1')}>
                  {picture ? <Image source={{ uri: picture }} style={styles.mediaImage} /> : <Ionicons name="camera-outline" size={28} color="#999" />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('pic2')}>
                  {picture2 ? <Image source={{ uri: picture2 }} style={styles.mediaImage} /> : <Ionicons name="image-outline" size={28} color="#999" />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('video')}>
                   {video ? <VideoView player={player} style={styles.mediaImage} /> : <Ionicons name="videocam-outline" size={28} color="#999" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Details Card */}
            <View style={styles.card}>
              <Text style={styles.label}>Part Information *</Text>
              <TextInput style={styles.input} placeholder="Part Name *" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Price (₵) *" value={price} onChangeText={setPrice} keyboardType="numeric" />
              
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={pickerValue} onValueChange={setPickerValue}>
                  <Picker.Item label="Choose Category *" value="" color="#aaa" />
                  {categories.map((item) => (
                    <Picker.Item key={item._id} label={item.name} value={item._id} />
                  ))}
                </Picker>
              </View>

              <TextInput style={styles.textarea} placeholder="Describe the part condition... *" value={description} onChangeText={setDescription} multiline />
            </View>

            {/* Contact Card */}
            <View style={styles.card}>
              <Text style={styles.label}>Contact & Location *</Text>
              <ContactField label="Call Number *" icon="call-outline" value={phone} onChange={setPhone} country={phoneCountry} onSelect={setPhoneCountry} />
              <ContactField label="WhatsApp" icon="logo-whatsapp" value={whatsapp} onChange={setWhatsapp} country={whatsappCountry} onSelect={setWhatsappCountry} />

              <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Region *" value={region} onChangeText={setRegion} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Town *" value={town} onChangeText={setTown} />
              </View>
              <TextInput style={styles.input} placeholder="Landmark/Location" value={location} onChangeText={setLocation} />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={submitPost} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Submit Post</Text>}
            </TouchableOpacity>

            <View style={styles.noticeBox}>
              <MaterialIcons name="info-outline" size={20} color="black" />
              <Text style={styles.noticeText}>
                Your listing will be reviewed by our team before appearing on the marketplace.
              </Text>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fb" },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#111" },
  headerSub: { fontSize: 14, color: "#666", marginTop: 4 },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16, marginBottom: 16, elevation: 2 },
  label: { fontSize: 12, fontWeight: "bold", color: "#f5a53d", textTransform: 'uppercase', marginBottom: 12 },
  mediaRow: { flexDirection: "row", justifyContent: "space-between" },
  mediaBox: { width: (width - 85) / 3, height: 110, backgroundColor: "#f0f2f5", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  mediaImage: { width: "100%", height: "100%", borderRadius: 12 },
  input: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 12 },
  row: { flexDirection: "row" },
  textarea: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, padding: 14, fontSize: 16, height: 100, textAlignVertical: "top" },
  pickerWrapper: { borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, marginBottom: 12, backgroundColor: "#f8f9fe", overflow: 'hidden' },
  submitBtn: { backgroundColor: "#000", paddingVertical: 18, borderRadius: 12, alignItems: "center", marginTop: 10 },
  submitText: { color: "white", fontSize: 17, fontWeight: "bold" },
  noticeBox: { flexDirection: "row", marginTop: 25, backgroundColor: "#f5a53d", padding: 15, borderRadius: 12, alignItems: "center" },
  noticeText: { flex: 1, marginLeft: 10, fontSize: 12, color: "black", fontWeight: "600" },
  
  // Contact Component
  inputGroup: { marginBottom: 15 },
  fieldLabel: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: '500' },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f2f8", borderRadius: 10, paddingHorizontal: 8, height: 50, marginRight: 8 },
  dialText: { fontWeight: "bold", marginLeft: 2, fontSize: 14 },
  phoneInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, paddingHorizontal: 12, height: 50 },
  flexInput: { flex: 1, fontSize: 16 }
});