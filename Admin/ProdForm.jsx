import { AntDesign, Entypo } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from "react";
import {
  
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import {
  CheckIcon,
  Select,
  Box,
  Text,
  View,
  Image,
  VStack,
  Input,
  Center,
  Stack,
  TextArea,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../assets/common/BaseUrl";
import Error from "../src/User/Error";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font';

function ProdFrom({ route }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const login = useSelector((state) => state);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [pickerValue, setPickerValue] = useState();
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const item = route.params?.item;
    if (item) {
      setEditItem(item);
      setName(item.name);
      setPrice(item.price);
      setPhone(item.phone);
      setDescription(item.description);
      setRegion(item.region);
      setTown(item.town);
      setPicture(item.picture);
      setLocation(item.location);
      setWhatsapp(item.whatsapp);
    }

    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");

      // fetch categories
      fetch(`${baseURL}categories`)
        .then(res => res.json())
        .then(results => {
          setCategories(results);
        });
    })();
  }, [route.params?.item]);

  const openImagePicker = async () => {
    if (!hasGalleryPermission) {
      console.log('Gallery permission not granted');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setPicture(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const credentials = picture && whatsapp&& pickerValue && name && phone && price && description && location && region && town && category;

    if (!credentials) {
      setError("Please fill in all the credentials");
      return;
    }

    setIsLoading(true);
    let method = "POST"; // Default method is POST

    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: picture,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("name", name);
      formData.append("description", description);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("phone", phone);
      formData.append("price", price);
      formData.append("whatsapp", whatsapp);
      formData.append("userId", login.user);

      let url = `${baseURL}send`;

      if (editItem && editItem._id) {
        url = `${baseURL}send/${editItem._id}`; // Adjust the URL based on your backend endpoint for editing
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Product action:", method === "POST" ? "created" : "updated", result);

      if (method === "POST") {
        setName("");
        setPhone("");
        setPrice("");
        setDescription("");
        setLocation("");
        setRegion("");
        setTown("");
        setCategory("");
        setPickerValue("");
        setWhatsapp("");
        setPicture(null);
      }

      navigation.navigate("Userpost");
    } catch (error) {
      console.error("Error:", method === "POST" ? "creating" : "updating", "product", error);
    } finally {
      setIsLoading(false);
    }
  };
  


  
  // const [fontsLoading] = useFonts({
  //   'regular': require('.././assets/Fonts/PlayfairDisplay-Bold.ttf')
  //  }) 
  
  
  // if(!fontsLoading){
  //   return undefined;
  // }


  return (
    <Box bg="" flex={1}>
      <Box
        w="full"
        h="full"
        position="absolute"

        px="6"
        justifyContent="center"
      >
      
      <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5} pt="6" mt={10}>
            <KeyboardAvoidingView behavior="position">
              <Stack space={3}>
                
<Center>
<View 
style={styles.imagecont}
>
      <Image source={{ uri: picture }}
       style={styles.image}
        alt='' 
       />

<TouchableOpacity style={styles.imagePicker} onPress={openImagePicker} >
                    <Entypo name="image" size={24} color="black" />
                  </TouchableOpacity>

    </View>
    </Center>
  
    <VStack space={2} mt={-7}>
                <Input
                  size="lg"
                  variant="rounded"
                  id="name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Enter the name of the product"
                  style={{ color: "black", fontSize:20 }}
                />
                <Text color="red.500">Phone number must start with your country code. Eg, +233, +49, +234 etc</Text>
                <Input
                  // keyboardType='numeric'
                  size="lg"
                  variant="rounded"
                  id="phone"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  placeholder="Enter your phone number"
                  type="text"
                  style={{ color: "black", fontSize:20 }}
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
                  style={{ color: "black", fontSize:20 }}
                />
                <Input
                  keyboardType='numeric'
                  size="lg"
                  variant="rounded"
                  value={price}
                  onChangeText={(text) => setPrice(text)}
                  placeholder="Enter Price"
                  type="number"
                  id="price"
                  style={{ color: "black", fontSize:20 }}
                />

                <Input
                  size="lg"
                  variant="rounded"
                  value={region}
                  onChangeText={(text) => setRegion(text)}
                  placeholder="Add your region"
                  type="text"
                  id="description"
                  style={{ color: "black", fontSize:20 }}
                />

                <Input
                  size="lg"
                  variant="rounded"
                  value={town}
                  onChangeText={(text) => setTown(text)}
                  placeholder="Add your town"
                  type="text"
                  id="description"
                  style={{ color: "black", fontSize:20 }}
                />

                <Input
                  size="lg"
                  variant="rounded"
                  value={location}
                  onChangeText={(text) => setLocation(text)}
                  placeholder="Add where you live"
                  type="text"
                  id="description"
                  style={{ color: "black", fontSize:20 }}
                />

                 <TextArea h={20} 
                 value={description}
                 onChangeText={(text) => setDescription(text)}
                 id="description"
                 type="text"
                 style={{fontSize:20}}
                 placeholder="Describe the product" w="99%" />

{/* Fetch categories */}
                <Center>
                  <Box maxW="300">
                    <Select selectedValue={pickerValue} minWidth="200" accessibilityLabel="Choose Category" placeholder="Choose Category" _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />
                    }} mt={1} onValueChange={(e) => [setPickerValue(e), setCategory(e)]}>

                      {categories.map((item) => {
                        return <Select.Item key={item._id} label={item.name} value={item._id} />
                      })}

                    </Select>
                  </Box>
                </Center>

                {error ? <Error message={error} /> : null}
                <TouchableOpacity
                  style={{
                    top: 5, borderRadius: 30, backgroundColor: "black",
                    alignItems: "center", justifyContent: "center",
                    height: 60, marginBottom: 40
                  }}
                  onPress={handleSubmit}>
                  <Text style={{ color: "white", fontSize: 20, fontFamily: "regular" }}>
                    {editItem ? "Update product" : "Post product for approval"}
                  </Text>
                </TouchableOpacity>
                </VStack>
                {/* </ScrollView> */}
              </Stack>
            </KeyboardAvoidingView>
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
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
    bottom: 25,
    marginBottom: 10
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
    bottom: 5,
    borderColor: "grey",
    padding: 8,
    borderRadius: 100,
    backgroundColor: "yellow",
    elevation: 20,
  },
  camera: {
    position: "absolute",
    right: 130,
    bottom: 5,
    borderColor: "grey",
    padding: 8,
    borderRadius: 100,
    backgroundColor: "yellow",
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

export default ProdFrom;
