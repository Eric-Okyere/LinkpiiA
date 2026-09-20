import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { CheckIcon, Select, Box, Image, VStack, Input, Center, Stack, ScrollView } from "native-base";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../assets/common/BaseUrl";
import Error from "../src/User/Error";
import { useSelector } from 'react-redux';

function Register({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const login = useSelector((state) => state);
  console.log("******************" + login.user);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [pickerValue, setPickerValue] = useState();
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();

    // fetch categories
    fetch(`${baseURL}categories`)
      .then((res) => res.json())
      .then((results) => {
        setCategories(results);
        console.log(results);
      });
  }, []);

  const openCameraPicker = async () => {
    if (!hasGalleryPermission) {
      console.log('Gallery permission not granted');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      console.log(result.uri);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text style={{ top: 50 }}>Permission denied</Text>;
  }

  const handleSubmit = async () => {
    const credentials =
      selectedImage &&
      pickerValue &&
      name &&
      phone &&
      price &&
      description &&
      location &&
      region &&
      town &&
      category;
    if (credentials === "") {
      setError("Please fill in the credentials");
    } else {
      navigation.navigate("main");
    }
    try {
      const formData = new FormData();
      formData.append('picture', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('name', name);
      formData.append('description', description);
      formData.append('region', region);
      formData.append('town', town);
      formData.append('location', location);
      formData.append('category', category);
      formData.append('phone', phone);
      formData.append('price', price);
      formData.append('userId', login.user);

      // Make the POST request
      const response = await fetch(`${baseURL}send`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      // Handle the response
      const result = await response.json();
      console.log('Product created:', result);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Box bg="#09e034" flex={1}>
      <Box w="full" h="full" position="absolute" px="6" justifyContent="center">
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5} pt="6" mt={10}>
            <KeyboardAvoidingView behavior="position">
              <Stack space={3}>
                <View style={styles.imagecont}>
                  <Image source={{ uri: selectedImage }} style={styles.image} alt="" />
                  <TouchableOpacity style={styles.cameraPicker} onPress={openCameraPicker}>
                    <Entypo name="camera" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <VStack space={2} mt={-7}>
                  {/* Rest of the form input fields */}
                  {/* ... */}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={{ color: "white", fontSize: 20 }}>
                      <AntDesign name="pluscircle" color="#09e034" size={26} />
                    </Text>
                  </TouchableOpacity>
                </VStack>
              </Stack>
            </KeyboardAvoidingView>
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  // Existing styles...

  imagecont: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "black",
    elevation: 10,
    left: 50,
    bottom: 25,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    top: 0,
  },
  cameraPicker: {
    position: "absolute",
    right: 1,
    bottom: 5,
    borderColor: "grey",
    padding: 8,
    borderRadius: 100,
    backgroundColor: "yellow",
    elevation: 20,
  },
  submitButton: {
    top: 5,
    borderRadius: 30,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    height: 40,
    marginBottom: 40,
  },
});

export default Register;
