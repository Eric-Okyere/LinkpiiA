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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from 'react-native-country-picker-modal';
import baseURL from "../../assets/common/BaseUrl";
import Error from "../../src/User/Error";
import { useNavigation } from "@react-navigation/native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

// --- REUSABLE CONTACT COMPONENT ---
const ContactField = memo(({ label, value, onChange, country, onSelect, icon }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.phoneRow}>
      <View style={styles.countryWrap}>
        <CountryPicker
          countryCode={country.code}
          withFilter 
          withFlag 
          withCallingCode
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

function Post({ route }) {
  const navigation = useNavigation();
  
  // Auth State
  const userId = useSelector((state) => state.user?.user?.userId || state.user);

  // Media States
  const [picture, setPicture] = useState(null);
  const [picturesec, setPicturesec] = useState(null);
  const [video, setVideo] = useState(null);
  
  // Form Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [pickerValue, setPickerValue] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [condition, setCondition] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Contact States
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState({ code: 'GH', callingCode: '233' });
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState({ code: 'GH', callingCode: '233' });

  // Video Player Setup
  const player = useVideoPlayer(video, (p) => {
    p.loop = true;
    p.muted = true;
    if (video) p.play();
  });

  useEffect(() => {
    // Fetch Fashion Categories
    fetch(`${baseURL}fashion`)
      .then((res) => res.json())
      .then((results) => setCategories(results))
      .catch((err) => console.log("Category fetch error:", err));
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

  const handleSubmit = async () => {
    // Basic validation
    if (!picture || !picturesec || !pickerValue || !name || !phone || !price || !description || !region || !town) {
      setError("Required fields marked with * are missing");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      
      // Media Append
      formData.append("picture", { 
        uri: picture, 
        type: "image/jpeg", 
        name: `f1_${Date.now()}.jpg` 
      });
      formData.append("picturesec", { 
        uri: picturesec, 
        type: "image/jpeg", 
        name: `f2_${Date.now()}.jpg` 
      });

      if (video) {
        formData.append("video", { 
          uri: video, 
          type: "video/mp4", 
          name: `fv_${Date.now()}.mp4` 
        });
      }

      // Fields
      formData.append("name", name);
      formData.append("discount", discount || "0");
      formData.append("description", description);
      formData.append("condition", condition);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("location", location);
      formData.append("category", pickerValue);
      formData.append("phone", `+${phoneCountry.callingCode}${phone}`);
      formData.append("whatsapp", `+${whatsappCountry.callingCode}${whatsapp}`);
      formData.append("price", price);
      formData.append("userId", userId);

      const response = await fetch(`${baseURL}fashionpost`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Fashion listing submitted!");
        navigation.navigate("Home");
      } else {
        setError("Submission failed. Check your data.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const Label = ({ title, required }) => (
    <Text style={styles.label}>{title} {required && <Text style={{color: 'red'}}>*</Text>}</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            
            <Text style={styles.headerTitle}>Create Fashion Listing</Text>
            <Text style={styles.headerSub}>List your clothes, shoes, or accessories</Text>

            {/* Media Card */}
            <View style={styles.card}>
              <Label title="Media Assets" required />
              <View style={styles.mediaRow}>
                <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('pic1')}>
                  {picture ? <Image source={{ uri: picture }} style={styles.mediaImage} /> : <Ionicons name="camera-outline" size={28} color="#999" />}
                  <View style={styles.plusBadge}><FontAwesome6 name="plus" size={10} color="white" /></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('pic2')}>
                  {picturesec ? <Image source={{ uri: picturesec }} style={styles.mediaImage} /> : <Ionicons name="image-outline" size={28} color="#999" />}
                  <View style={styles.plusBadge}><FontAwesome6 name="plus" size={10} color="white" /></View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaBox} onPress={() => pickMedia('video')}>
                   {video ? (
                    <VideoView player={player} style={styles.mediaImage} allowsFullscreen />
                   ) : (
                    <Ionicons name="videocam-outline" size={28} color="#999" />
                   )}
                   <View style={[styles.plusBadge, {backgroundColor: '#444'}]}><FontAwesome6 name="video" size={8} color="white" /></View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Item Info */}
            <View style={styles.card}>
              <Label title="Item Details" required />
              <TextInput style={styles.input} placeholder="Product Name *" value={name} onChangeText={setName} />
              <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Price (₵) *" keyboardType="numeric" value={price} onChangeText={setPrice} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Discount %" keyboardType="numeric" value={discount} onChangeText={t => setDiscount(t.replace(/[^0-9]/g, ""))} />
              </View>

              <View style={styles.pickerWrapper}>
                <Picker selectedValue={condition} onValueChange={setCondition}>
                  <Picker.Item label="Condition *" value="" color="#aaa" />
                  <Picker.Item label="New / Sealed" value="new" />
                  <Picker.Item label="Gently Used" value="used" />
                </Picker>
              </View>

              <View style={styles.pickerWrapper}>
                <Picker selectedValue={pickerValue} onValueChange={setPickerValue}>
                  <Picker.Item label="Category *" value="" color="#aaa" />
                  {categories.map((c) => <Picker.Item key={c._id} label={c.name} value={c._id} />)}
                </Picker>
              </View>

              <TextInput style={styles.textarea} multiline placeholder="Description *" value={description} onChangeText={setDescription} />
            </View>

            {/* Contact & Location */}
            <View style={styles.card}>
              <Label title="Contact Info" required />
              <ContactField 
                label="Call Number *" icon="call-outline" 
                value={phone} onChange={setPhone} 
                country={phoneCountry} onSelect={setPhoneCountry} 
              />
              <ContactField 
                label="WhatsApp Number" icon="logo-whatsapp" 
                value={whatsapp} onChange={setWhatsapp} 
                country={whatsappCountry} onSelect={setWhatsappCountry} 
              />

              <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="Region *" value={region} onChangeText={setRegion} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Town *" value={town} onChangeText={setTown} />
              </View>
              <TextInput style={styles.input} placeholder="Landmark" value={location} onChangeText={setLocation} />
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Submit Post</Text>}
            </TouchableOpacity>

            <View style={styles.footerSection}>
               <Text style={styles.footerText}>By listing, you agree to our </Text>
               <TouchableOpacity onPress={() => navigation.navigate("terms")}><Text style={styles.boldLink}>Terms</Text></TouchableOpacity>
            </View>

            <View style={styles.warningAlert}>
              <MaterialIcons name="shield" size={20} color="black" />
              <Text style={styles.warningText}>
                Fashion items require Ghana Card verification in your profile before appearing live.
              </Text>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111" },
  headerSub: { fontSize: 14, color: "#666", marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  label: { fontSize: 12, fontWeight: "bold", color: "#f5a53d", textTransform: 'uppercase', marginBottom: 12 },
  mediaRow: { flexDirection: "row", justifyContent: "space-between" },
  mediaBox: { width: (width - 85) / 3, height: 110, backgroundColor: "#f0f2f5", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  mediaImage: { width: "100%", height: "100%", borderRadius: 12 },
  plusBadge: { position: "absolute", bottom: -5, right: -5, backgroundColor: "#f5a53d", width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "white" },
  input: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 12 },
  row: { flexDirection: "row" },
  textarea: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, padding: 14, fontSize: 16, height: 100, textAlignVertical: "top" },
  pickerWrapper: { borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, marginBottom: 12, backgroundColor: "#f8f9fe", overflow: 'hidden' },
  submitBtn: { backgroundColor: "#000", paddingVertical: 18, borderRadius: 12, alignItems: "center", marginTop: 10 },
  submitText: { color: "white", fontSize: 17, fontWeight: "bold" },
  footerSection: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#888", fontSize: 12 },
  boldLink: { color: "#000", fontWeight: "700", textDecorationLine: "underline", fontSize: 12 },
  warningAlert: { flexDirection: "row", marginTop: 25, backgroundColor: "#f5a53d", padding: 15, borderRadius: 12, alignItems: "center" },
  warningText: { flex: 1, marginLeft: 10, fontSize: 12, color: "black", fontWeight: "600" },
  
  // Contact Field Styles
  inputGroup: { marginBottom: 15 },
  fieldLabel: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: '500' },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f2f8", borderRadius: 10, paddingHorizontal: 8, height: 50, marginRight: 8 },
  dialText: { fontWeight: "bold", marginLeft: 2, fontSize: 14 },
  phoneInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 10, paddingHorizontal: 12, height: 50 },
  flexInput: { flex: 1, fontSize: 16 }
});

export default Post;