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
import { FontAwesome6, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from 'react-native-country-picker-modal';
import { useVideoPlayer, VideoView } from "expo-video"; // CHANGED: Updated imports
import { Picker } from "@react-native-picker/picker";
import baseURL from "../assets/common/BaseUrl";
import Error from "../src/User/Error";

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

function AgricPost({ route, navigation }) {
  const login = useSelector((state) => state);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Media States
  const [picture, setPicture] = useState(null);
  const [picturesec, setPicturesec] = useState(null);
  const [videoSource, setVideoSource] = useState(null); // CHANGED: Renamed for clarity

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  
  // Contact States
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState({ code: 'GH', callingCode: '233' });
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState({ code: 'GH', callingCode: '233' });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState(null);

  // CHANGED: Initialize the Video Player
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    if (videoSource) player.play();
  });

  useEffect(() => {
    // Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Load Categories
    fetch(`${baseURL}categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.log(err));

    // Handle Edit Route
    const item = route.params?.item;
    if (item) {
      setEditItem(item);
      setName(item.name);
      setPrice(item.price?.toString() || "");
      setDescription(item.description);
      setRegion(item.region);
      setTown(item.town);
      setLocation(item.location);
      setPicture(item.picture);
      setPicturesec(item.picturesec);
      setVideoSource(item.video); // Set initial video
    }
  }, [route.params?.item]);

  const pickMedia = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Permission Denied", "Enable gallery access in settings.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ['videos'] : ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === 'pic1') setPicture(uri);
      if (type === 'pic2') setPicturesec(uri);
      if (type === 'video') setVideoSource(uri); // CHANGED
    }
  };

  const handleSubmit = async () => {
    if (!picture || !name || !price || !phone || !category) {
      setError("Please fill required fields (*)");
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("picture", { uri: picture, type: "image/jpeg", name: "p1.jpg" });
      formData.append("picturesec", { uri: picturesec, type: "image/jpeg", name: "p2.jpg" });
      
      if (videoSource) {
        formData.append("video", { 
            uri: videoSource, 
            type: "video/mp4", 
            name: "v.mp4" 
        });
      }
      
      formData.append("name", name);
      formData.append("price", price);
      formData.append("phone", `+${phoneCountry.callingCode}${phone}`);
      formData.append("whatsapp", `+${whatsappCountry.callingCode}${whatsapp}`);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("location", location);
      formData.append("userId", login.user?.userId || login.user);

      const url = editItem ? `${baseURL}send/${editItem.id}` : `${baseURL}send`;
      const method = editItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Accept: "application/json", "Content-Type": "multipart/form-data" },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", editItem ? "Updated!" : "Posted for approval!");
        navigation.navigate("manage");
      }
    } catch (err) {
      setError("Something went wrong. Check connection.");
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
              <Text style={styles.mainTitle}>{editItem ? "Edit Post" : "Post Agric Product"}</Text>
              <Text style={styles.subTitle}>Promote your farm produce and equipment</Text>
            </View>

            {/* MEDIA SECTION */}
            <View style={styles.mediaContainer}>
              {[ {uri: picture, type: 'pic1', icon: 'camera'}, 
                 {uri: picturesec, type: 'pic2', icon: 'image'}, 
                 {uri: videoSource, type: 'video', icon: 'videocam'} ].map((item, i) => (
                <TouchableOpacity key={i} style={styles.mediaBox} onPress={() => pickMedia(item.type)}>
                  {item.uri ? (
                    item.type === 'video' ? (
                      <VideoView 
                        player={player} 
                        style={styles.fullMedia} 
                        allowsFullscreen 
                        allowsPictureInPicture 
                      />
                    ) : <Image source={{ uri: item.uri }} style={styles.fullMedia} />
                  ) : (
                    <View style={styles.placeholderIcon}>
                      <Ionicons name={item.icon} size={28} color="#ccc" />
                      {item.type === 'video' && <Text style={styles.iconLabel}>Video</Text>}
                    </View>
                  )}
                  <View style={styles.badge}><FontAwesome6 name="plus" size={10} color="white" /></View>
                </TouchableOpacity>
              ))}
            </View>

            {/* ITEM DETAILS CARD */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Agric Details</Text>
              <TextInput style={styles.input} placeholder="Product Name *" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Price (₵) *" keyboardType="numeric" value={price} onChangeText={setPrice} />
              
              <View style={styles.pickerBox}>
                <Picker selectedValue={category} onValueChange={setCategory}>
                  <Picker.Item label="Select Category *" value="" color="#999" />
                  {categories.map(c => <Picker.Item key={c._id} label={c.name} value={c._id} />)}
                </Picker>
              </View>

              <TextInput style={styles.textArea} multiline placeholder="Describe quality, quantity, etc..." value={description} onChangeText={setDescription} />
            </View>

            {/* CONTACT CARD */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Contact & Location</Text>
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
                <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="Region" value={region} onChangeText={setRegion} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Town" value={town} onChangeText={setTown} />
              </View>
              <TextInput style={styles.input} placeholder="Farm Landmark / Location" value={location} onChangeText={setLocation} />
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Post for Approval</Text>}
            </TouchableOpacity>

            <View style={styles.termsRow}>
              <Text style={styles.termsText}>By posting, you agree to our </Text>
              <TouchableOpacity onPress={() => navigation.navigate("terms")}>
                <Text style={styles.linkText}>Terms</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> & </Text>
              <TouchableOpacity onPress={() => navigation.navigate("privacy")}>
                <Text style={styles.linkText}>Privacy</Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.notice, { transform: [{ scale: pulseAnim }] }]}>
              <MaterialCommunityIcons name="shield-check" size={22} color="#111" />
              <Text style={styles.noticeText}>Verification: Ensure your National ID is uploaded in your profile for fast approval.</Text>
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
  mediaContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  mediaBox: { width: (width - 70) / 3, height: 110, backgroundColor: "white", borderRadius: 18, justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  fullMedia: { width: "100%", height: "100%", borderRadius: 18 },
  placeholderIcon: { alignItems: 'center' },
  iconLabel: { fontSize: 10, color: '#ccc', marginTop: 4, fontWeight: '600' },
  badge: { position: "absolute", bottom: -4, right: -4, backgroundColor: "#f5a53d", padding: 5, borderRadius: 15, borderWidth: 2, borderColor: "white" },
  card: { backgroundColor: "white", borderRadius: 22, padding: 18, marginBottom: 18, elevation: 2 },
  cardHeader: { fontSize: 12, fontWeight: "bold", color: "#f5a53d", textTransform: 'uppercase', marginBottom: 15 },
  input: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 16 },
  row: { flexDirection: "row" },
  textArea: { backgroundColor: "#f8f9fe", borderWidth: 1, borderColor: "#edf0f7", borderRadius: 12, padding: 14, height: 100, textAlignVertical: "top" },
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
  termsRow: { flexDirection: 'row', alignSelf: 'center', marginTop: 15 },
  termsText: { fontSize: 12, color: '#666' },
  linkText: { fontSize: 12, color: '#000', textDecorationLine: 'underline', fontWeight: 'bold' },
  notice: { flexDirection: "row", backgroundColor: "#f5a53d", padding: 16, borderRadius: 18, marginTop: 30, alignItems: "center" },
  noticeText: { flex: 1, marginLeft: 10, fontSize: 12, fontWeight: "bold", color: "#111" }
});

export default AgricPost;