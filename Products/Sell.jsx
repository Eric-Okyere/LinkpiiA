import { AntDesign, Entypo} from "@expo/vector-icons";
import {useSelector} from 'react-redux'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
// This is for IOS Picker
import React, { useEffect, useState } from "react";
import {
  CheckIcon,
  Select,
  Box,
  View,
  Image,
  VStack,
  Input,
  Center,
  Stack,
} from "native-base";
import * as ImagePicker from "expo-image-picker"
import baseURL from "../assets/common/BaseUrl";
import Error from "../src/User/Error";




function Register({ navigation }) {

  const login= useSelector((state)=>state)
  console.log("******************"+login.user);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [pickerValue, setPickerValue] = useState();
  const [error, setError] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)





  useEffect(() => {
    (async()=>{
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();

    // fetch categories
    fetch(`${baseURL}categories`)
      .then(res => res.json())
      .then(results => {
        setCategories(results)
        // setproductCtg(results)
        console.log(results)
      })

  }, [])







  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5
    })

    if (!result.canceled) {
      setPicture(result.uri)
      let newfile = {
        uri: result.uri,
        type: `test/${result.assets[0].uri}`,
        name: `test.${result.assets[0].uri}`
      }
      handleUpload(newfile)
    } else {
      alert('You did not select any image.');
    }

  }



  const handleUpload = (image) => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'PalmfarmApp')
    data.append('cloud_name', 'dfm5lszdo')

    fetch('https://api.cloudinary.com/v1_1/dfm5lszdo/image/upload', {
      method: "post",
      body: data
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setPicture(result.url)
      })
  }





  const handleSubmit = async () => {
    const credentials = picture&&pickerValue
    && name&& phone&& price&& description&& location&& region&& town&& category; 
   if(credentials===""){
     setError("Please fill in the credentials")
   } else{
     navigation.navigate("main")
   }


    fetch(`${baseURL}send`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        picture,
        name,
        phone,
        price,
        description,
        location,
        region,
        town,
        category,
        userId:login.user
      
      }),
     
    }).then(res => res.json())
      .then(result => {
        // console.log(result)
      })
    setPicture("")
    setName("")
    setPrice("")
    setDescription("")
    setLocation("")
    setPhone("")
    setRegion("")
    setTown("")
    setPickerValue("")
   
  };






  if(hasGalleryPermission === "granted"){
    return <Text style={{top:50}} >Permission denied</Text>
  }

  return (
    <Box bg="#09e034" flex={1}>
      <Box
        w="full"
        h="full"
        position="absolute"

        px="6"
        justifyContent="center"
      >
      

          <VStack space={5} pt="6" mt={10}>
            <KeyboardAvoidingView behavior="position">
              <Stack space={3}>
                

<View 
style={styles.imagecont}
>
      {picture && <Image source={{ uri: picture }}
       style={styles.image}
        alt='' 
       />}

<TouchableOpacity style={styles.imagePicker} onPress={pickImage} >
                    <Entypo name="image" size={24} color="black" />
                  </TouchableOpacity>

    </View>
    <VStack space={2} mt={-7}>
                <Input
                  size="lg"
                  variant="rounded"
                  id="name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Enter name"
                  style={{ color: "black" }}
                />
                <Input
                  keyboardType='numeric'
                  size="lg"
                  variant="rounded"
                  id="phone"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  placeholder="EnterPhone number"
                  type="text"
                  style={{ color: "black" }}
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
                  style={{ color: "black" }}
                />

                <Input
                  
                  size="lg"
                  variant="rounded"
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  placeholder="Description"
                  type="text"
                  id="description"
                  style={{ color: "black" }}
                />

                <Input
                  
                  size="lg"
                  variant="rounded"
                  value={region}
                  onChangeText={(text) => setRegion(text)}
                  placeholder="Add your region"
                  type="text"
                  id="description"
                  style={{ color: "black" }}
                />

                <Input
                  
                  size="lg"
                  variant="rounded"
                  value={town}
                  onChangeText={(text) => setTown(text)}
                  placeholder="Add your town"
                  type="text"
                  id="description"
                  style={{ color: "black" }}
                />

                <Input
                  
                  size="lg"
                  variant="rounded"
                  value={location}
                  onChangeText={(text) => setLocation(text)}
                  placeholder="Add where you live"
                  type="text"
                  id="description"
                  style={{ color: "black" }}
                />

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
                    width: "40%", height: 40
                  }}

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
        {/* </ScrollView> */}
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
    left: 50,
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

export default Register;
