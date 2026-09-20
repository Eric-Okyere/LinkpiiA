import { Entypo, FontAwesome6, Feather } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
  Animated
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  View,
  Text,
  Image,
  VStack,
  Input,
  Stack,
  ScrollView,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../../assets/common/BaseUrl";
import Error from "../../src/User/Error";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Button } from "react-native";

function PostOkada({ route }) {
  const navigation = useNavigation();
  const [driverpic, setDriverpic] = useState(null);
  const [carpic, setCarPic] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const login = useSelector((state) => state);
  console.log("******************" + login.user);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [carnum, setcarNum] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [card, setCard] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const moveAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(true);


  useEffect(() => {
    const item = route.params?.item;
    if (item) {
      setEditItem(item);
      setName(item.name);
      setcarNum(item.carnum);
      setPhone(item.phone);
      setDescription(item.description);
      setRegion(item.region);
      setTown(item.town);
      setDriverpic(item.driverpic);
      setCarPic(item.carpic);
      setLocation(item.location);
      setCard(item.card);
      setWhatsapp(item.whatsapp);
    }

    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, [route.params?.item]);

  const openImagePicker = async () => {
    if (!hasGalleryPermission) {
      console.log('Gallery permission not granted');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setDriverpic(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const openPicker = async () => {
    if (!hasGalleryPermission) {
      console.log('Gallery permission not granted');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setCarPic(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const credentials =
      driverpic && carpic && name && phone && region && town && location && carnum && whatsapp;

    if (credentials === "") {
      setError("Please fill in the credentials");
    } else {
      setCarPic("");
      setDriverpic("");
      setName("");
      setPhone("");
      setRegion("");
      setLocation("");
      setTown("");
      setcarNum("");
      setCard("");
      setIsLoading(true);
      setWhatsapp("");
    }

    try {
      const formData = new FormData();
      formData.append("driverpic", {
        uri: driverpic,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("carpic", {
        uri: carpic,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("name", name);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("carnum", carnum);
      formData.append("phone", phone);
      formData.append("location", location);
      formData.append("card", card);
      formData.append("whatsapp", whatsapp);
      formData.append("userId", login.user);

      const url = editItem ? `${baseURL}okada/${editItem._id}` : `${baseURL}okada`;

      const response = await fetch(url, {
        method: editItem ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      navigation.navigate("manaokada");
      const result = await response.json();
      console.log("Product created:", result);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    if (isAnimating) {
      Animated.loop(
        Animated.timing(moveAnim, {
          toValue: 300, // Change to the desired width
          duration: 6000, // Duration of the animation (in milliseconds)
          useNativeDriver: true,
        })
      ).start();
    } else {
      moveAnim.stopAnimation(); // Stop animation if button is pressed
    }
  }, [isAnimating]);

  return (
    <Box bg="white" flex={1}>
      <Box
        w="full"
        h="full"
        position="absolute"
        px="6"
        justifyContent="center"
      >
         {hasGalleryPermission === false ? (
          <View style={styles.permissionDeniedContainer}>
            <Text style={styles.permissionDeniedText}>Permission denied</Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.permissionButtonText}>Open Settings</Text>
            </TouchableOpacity>
          </View>
        ):(
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5} pt="6" mt={10}>
            {/* <KeyboardAvoidingView behavior="position"> */}
              <Stack space={3}>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.imagecont}>
                    <View>
                      <Image source={{ uri: driverpic }} style={styles.image} alt='' />
                      <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
                        <FontAwesome6 name="motorcycle" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.imagecont}>
                    <View>
                      <Image source={{ uri: carpic }} style={styles.image} alt='' />
                      <TouchableOpacity style={styles.imagePicker} onPress={openPicker}>
                        <Entypo name="add-user" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <VStack space={2} mt={-7}>
                  <Input
                    size="lg"
                    variant="rounded"
                    id="name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    placeholder="Enter your name"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Input
                    size="lg"
                    variant="rounded"
                    id="carnum"
                    value={carnum}
                    onChangeText={(text) => setcarNum(text)}
                    placeholder="Enter your bike number"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Text color="red.500">Phone number must start with your country code. Eg, +233, +49, +234 etc</Text>
                  <Input
                    keyboardType='numeric'
                    size="lg"
                    variant="rounded"
                    id="phone"
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                    placeholder="Enter your phone number"
                    type="text"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Text color="red.500">Whatsapp number must start with your country code. Eg, 233, 49, 234 etc</Text>
                  <Input
                    keyboardType='numeric'
                    size="lg"
                    variant="rounded"
                    id="whatsapp"
                    value={whatsapp}
                    onChangeText={(text) => {
                      const filteredText = text.replace(/^0|[^\d]/g, '');
                      setWhatsapp(filteredText);
                    }}
                    placeholder="Enter your Whatsapp number"
                    type="text"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Input
                    size="lg"
                    variant="rounded"
                    value={region}
                    onChangeText={(text) => setRegion(text)}
                    placeholder="Add your region"
                    type="text"
                    id="region"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Input
                    size="lg"
                    variant="rounded"
                    value={town}
                    onChangeText={(text) => setTown(text)}
                    placeholder="Add your town"
                    type="text"
                    id="town"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Input
                    size="lg"
                    variant="rounded"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                    placeholder="Where do you stay"
                    type="text"
                    id="location"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  <Input
                    size="lg"
                    variant="rounded"
                    value={card}
                    onChangeText={(text) => setCard(text)}
                    placeholder="Add your license or Ghana card"
                    type="text"
                    id="card"
                    style={{ color: "black", fontSize: 20 }}
                  />
                  {error ? <Error message={error} /> : null}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        Post for approval
                      </Text>
                    )}
                  </TouchableOpacity>


                  <Text alignSelf={"center"}>By posting, you agree to the </Text>
                  <View  style={{flexDirection:"row", alignSelf:"center", marginBottom:90 }}>
                     
                     <TouchableOpacity onPress={()=>navigation.navigate("terms")}> 
                      <Text underline>Terms and Conditions</Text> 
                      </TouchableOpacity>
                     <Text> and</Text>

                     <TouchableOpacity  onPress={()=>navigation.navigate("privacy")}> 
                      <Text alignSelf="center" underline> Privacy</Text> 
                      </TouchableOpacity>
                  </View>


                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',bottom: 80, marginBottom: 10, backgroundColor:"#f5a53d", padding: 10, borderRadius: 10 }}>
                             <Text
                               style={{
                                color: 'black',
                               
                                
                               }}
                             >
                               After posting, don't forget you have to submit your picture and pictures of your Ghana card before your product can be approved. Press <Feather name="menu" size={14} color="white" /> at the top left corner, press on your profile name and send your Ghana card or any national ID for approval.
                             </Text>
                          </View>


                </VStack>
              </Stack>
            {/* </KeyboardAvoidingView> */}
          </VStack>
        </ScrollView>)}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  imagecont: {
    width: 140,
    height: 140,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    borderRadius: 100,
    borderColor: "black",
    elevation: 10,
    left: 0,
    bottom: 25,
    marginHorizontal: "auto",
    marginBottom: 4
  },
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    top: 0
  },
  imagePicker: {
    position: "absolute",
    right: 1,
    top: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    borderColor: "grey",
    padding: 8,
    borderRadius: 100,
    backgroundColor: "#f5a53d",
    elevation: 20,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionDeniedText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    top: 5,
    borderRadius: 30,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginBottom: 40
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
   
  },
  camera: {
    position: "absolute",
    right: 130,
    bottom: 5,
    borderColor: "grey",
    padding: 8,
    borderRadius: 100,
    backgroundColor: "#f5a53d",
    elevation: 20,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default PostOkada;
