import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  BackHandler, 
  Linking, 
  TextInput, 
  ScrollView, 
  Text, 
  Image,
  Platform,
  Dimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../assets/common/BaseUrl";
import Error from "../src/User/Error";
import { useSelector } from 'react-redux';
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

function Register({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  
  // Correctly extract the userId from Redux
  const userId = useSelector((state) => state.user?.user?.userId || state.user?.userId);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();

    fetch(`${baseURL}categories`)
      .then(res => res.json())
      .then(results => setCategories(results))
      .catch(err => console.log("Category fetch error:", err));

    const backHandler = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
  }, [navigation]);

  const openCameraPicker = async () => {
    if (!hasCameraPermission) {
      Alert.alert("Permission Required", "Grant camera access in settings.", [
        { text: "Settings", onPress: () => Linking.openSettings() },
        { text: "Cancel", style: "cancel" }
      ]);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const isInvalid = !selectedImage || !whatsapp || !name || !phone || !price || !description || !region || !town || !category;
    
    if (isInvalid) {
      setError("Please fill in all fields and add a photo");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('picture', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('name', name);
      formData.append('description', description);
      formData.append('region', region);
      formData.append('town', town);
      formData.append('location', location);
      formData.append('category', category);
      formData.append('phone', phone);
      formData.append('price', price);
      formData.append('whatsapp', whatsapp);
      formData.append('userId', userId);

      const response = await fetch(`${baseURL}send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Product posted for approval.");
        navigation.navigate("Userpost");
      } else {
        setError("Failed to post product. Please try again.");
      }
    } catch (err) {
      setError("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          
          {/* Image Picker Section */}
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Entypo name="image" size={50} color="#ccc" />
              </View>
            )}
            <TouchableOpacity style={styles.cameraIcon} onPress={openCameraPicker}>
              <Entypo name="camera" size={22} color="black" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <TextInput 
              style={styles.input} 
              placeholder="Product Name" 
              value={name} 
              onChangeText={setName} 
            />

            <Text style={styles.helperText}>Use country code (e.g. +233)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number" 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
            />

            <Text style={styles.helperText}>WhatsApp (e.g. 233...)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="WhatsApp Number" 
              value={whatsapp} 
              onChangeText={(t) => setWhatsapp(t.replace(/^0|[^\d]/g, ''))} 
              keyboardType="numeric"
            />

            <TextInput 
              style={styles.input} 
              placeholder="Price (Gh₵)" 
              value={price} 
              onChangeText={setPrice} 
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="Region" value={region} onChangeText={setRegion} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Town" value={town} onChangeText={setTown} />
            </View>

            <TextInput style={styles.input} placeholder="Specific Location" value={location} onChangeText={setLocation} />

            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe the product..." 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              numberOfLines={4}
            />

            {/* Custom Dropdown for Categories */}
            <TouchableOpacity 
              style={styles.pickerTrigger} 
              onPress={() => setShowPicker(!showPicker)}
            >
              <Text style={{ color: category ? '#000' : '#999' }}>
                {category ? categories.find(c => c._id === category)?.name : "Select Category"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>

            {showPicker && (
              <View style={styles.pickerOptions}>
                {categories.map((item) => (
                  <TouchableOpacity 
                    key={item._id} 
                    style={styles.option} 
                    onPress={() => { setCategory(item._id); setShowPicker(false); }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {error ? <Error message={error} /> : null}

            <TouchableOpacity 
              style={[styles.submitBtn, isLoading && { backgroundColor: '#555' }]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Post for Approval</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 25, paddingTop: 50 },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#f5a53d',
    alignSelf: 'center',
    marginBottom: 30,
    position: 'relative',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewImage: { width: '100%', height: '100%', borderRadius: 80 },
  placeholderImage: { justifyContent: 'center', alignItems: 'center' },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#f5a53d',
    padding: 8,
    borderRadius: 20,
    elevation: 5
  },
  form: { marginTop: 10 },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  textArea: { height: 100, borderRadius: 15, textAlignVertical: 'top', paddingTop: 15 },
  helperText: { fontSize: 11, color: 'red', marginLeft: 15, marginBottom: 5 },
  row: { flexDirection: 'row' },
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  pickerOptions: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
    padding: 10,
    elevation: 3
  },
  option: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  submitBtn: {
    backgroundColor: 'black',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50
  },
  submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default Register;