import React, { useState, useEffect, useRef } from "react";
import {
  Linking,
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
  Keyboard
} from "react-native";

import { FontAwesome6, Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../../assets/common/BaseUrl";
import Error from "../../src/User/Error";
import { useNavigation } from "@react-navigation/native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

function Post({ navigate }) {
  const navigation = useNavigation();
  
  // States
  const userId = useSelector((state) => state.user?.user?.userId || state.user);
  const [picture, setPicture] = useState(null);
  const [picturesec, setPicturesec] = useState(null);
  const [video, setVideo] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  
  // Form Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [pickerValue, setPickerValue] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [condition, setCondition] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const player = useVideoPlayer(video || "", (p) => {
    p.loop = true;
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === "granted");
    })();

    fetch(`${baseURL}fashion`)
      .then((res) => res.json())
      .then((results) => setCategories(results))
      .catch((err) => console.log(err));
  }, []);

  const pickMedia = async (type) => {
    if (!hasGalleryPermission) {
      alert("Permission denied. Please enable gallery access in settings.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ['videos'] : ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'pic1') setPicture(result.assets[0].uri);
      if (type === 'pic2') setPicturesec(result.assets[0].uri);
      if (type === 'video') {
        setVideo(result.assets[0].uri);
        setIsVideoLoading(true);
      }
    }
  };

  const handleSubmit = async () => {
    const credentials = picture && picturesec && pickerValue && name && phone && price && description && location && region && town && whatsapp && condition;

    if (!credentials) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("picture", { uri: picture, type: "image/jpeg", name: "image.jpg" });
      formData.append("picturesec", { uri: picturesec, type: "image/jpeg", name: "image.jpg" });
      if (video) {
        formData.append("video", { uri: video, type: "video/mp4", name: "video.mp4" });
      }

      formData.append("name", name);
      formData.append("discount", discount || "0");
      formData.append("description", description);
      formData.append("condition", condition);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("location", location);
      formData.append("category", pickerValue);
      formData.append("phone", phone);
      formData.append("whatsapp", whatsapp);
      formData.append("price", price);
      formData.append("userId", userId);

      const response = await fetch(`${baseURL}fashionpost`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "multipart/form-data" },
        body: formData,
      });

      if (response.ok) {
        navigation.navigate("Home");
      } else {
        setError("Failed to post. Check your connection.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const Label = ({ title, required }) => (
    <Text style={styles.label}>{title} {required && <Text style={{color: 'red'}}>*</Text>}</Text>
  );

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            
            <Text style={styles.headerTitle}>Create Listing</Text>
            <Text style={styles.headerSub}>Complete the form to post your item</Text>

            {/* Media Upload Card */}
            <View style={styles.card}>
              <Label title="Product Media" required />
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
                  {isVideoLoading ? <ActivityIndicator color="#f5a53d" /> : 
                   video ? <VideoView player={player} style={styles.mediaImage} /> : <Ionicons name="videocam-outline" size={28} color="#999" />}
                  <View style={[styles.plusBadge, {backgroundColor: '#444'}]}><FontAwesome6 name="video" size={8} color="white" /></View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.card}>
              <Label title="Product Information" required />
              <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
              
              <View style={styles.row}>
                <TextInput 
                  style={[styles.input, { flex: 1, marginRight: 8 }]} 
                  placeholder="Price (₵)" 
                  keyboardType="numeric" 
                  value={price} 
                  onChangeText={setPrice} 
                />
                <TextInput 
                  style={[styles.input, { flex: 1 }]} 
                  placeholder="Discount %" 
                  keyboardType="numeric" 
                  value={discount} 
                  onChangeText={(t) => setDiscount(t.replace(/[^0-9]/g, ""))} 
                />
              </View>

              <View style={styles.pickerWrapper}>
                <Picker selectedValue={condition} onValueChange={setCondition} style={styles.pickerStyle}>
                  <Picker.Item label="Item Condition" value="" color="#aaa" />
                  <Picker.Item label="New / Sealed" value="new" />
                  <Picker.Item label="Gently Used" value="used" />
                </Picker>
              </View>

              <View style={styles.pickerWrapper}>
                <Picker selectedValue={pickerValue} onValueChange={setPickerValue} style={styles.pickerStyle}>
                  <Picker.Item label="Category" value="" color="#aaa" />
                  {categories.map((c) => (
                    <Picker.Item key={c._id} label={c.name} value={c._id} />
                  ))}
                </Picker>
              </View>

              <TextInput 
                style={styles.textarea} 
                multiline 
                placeholder="Detailed Description (Size, color, etc.)" 
                value={description} 
                onChangeText={setDescription} 
              />
            </View>

            {/* Contact Card */}
            <View style={styles.card}>
              <Label title="Location & Contact" required />
              <TextInput style={styles.input} placeholder="Phone Number (+233...)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              
              <Text style={styles.hint}>WhatsApp: Start with country code (e.g. 233...)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="WhatsApp Number" 
                keyboardType="numeric" 
                value={whatsapp} 
                onChangeText={(t) => setWhatsapp(t.replace(/^0|[^\d]/g, ''))} 
              />

              <TextInput style={styles.input} placeholder="Region" value={region} onChangeText={setRegion} />
              <TextInput style={styles.input} placeholder="Town" value={town} onChangeText={setTown} />
              <TextInput style={styles.input} placeholder="Detailed Landmark" value={location} onChangeText={setLocation} />
            </View>

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Post for Approval</Text>}
            </TouchableOpacity>

            <View style={styles.footerSection}>
              <Text style={styles.footerText}>By listing, you agree to our </Text>
              <TouchableOpacity onPress={() => navigate("terms")}><Text style={styles.boldLink}>Terms</Text></TouchableOpacity>
              <Text style={styles.footerText}> & </Text>
              <TouchableOpacity onPress={() => navigate("privacy")}><Text style={styles.boldLink}>Privacy</Text></TouchableOpacity>
            </View>

            <View style={styles.warningAlert}>
              <MaterialIcons name="info-outline" size={20} color="black" />
              <Text style={styles.warningText}>
                Heads up! Listings require ID verification (Ghana Card) via your profile menu before appearing live.
              </Text>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f4f4" },
  scrollContainer: { padding: 16, paddingBottom: 90 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 10 },
  headerSub: { fontSize: 13, color: "#777", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 12, color: "#333", textTransform: 'uppercase', letterSpacing: 0.5 },
  mediaRow: { flexDirection: "row", justifyContent: "space-between" },
  mediaBox: {
    width: (width - 84) / 3,
    height: (width - 84) / 3,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  mediaImage: { width: "100%", height: "100%", borderRadius: 10 },
  plusBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#f5a53d",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  input: {
    backgroundColor: "#fcfcfc",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  row: { flexDirection: "row" },
  textarea: {
    backgroundColor: "#fcfcfc",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 90,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fcfcfc",
    justifyContent: 'center'
  },
  pickerStyle: {
    height: 50,
    width: '100%',
  },
  hint: { fontSize: 10, color: "#f5a53d", marginBottom: 4, marginLeft: 4, fontWeight: '600' },
  submitBtn: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  submitText: { color: "white", fontSize: 17, fontWeight: "bold" },
  footerSection: { flexDirection: "row", justifyContent: "center", marginTop: 20, alignItems: 'center' },
  footerText: { color: "#888", fontSize: 12 },
  boldLink: { color: "#000", fontWeight: "700", textDecorationLine: "underline", fontSize: 12 },
  warningAlert: {
    flexDirection: "row",
    marginTop: 30,
    backgroundColor: "#f5a53d",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  warningText: { flex: 1, marginLeft: 10, fontSize: 12, color: "black", fontWeight: "600", lineHeight: 18 },
});

export default Post;