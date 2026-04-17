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
  Animated,
  Dimensions,
  Text
} from "react-native";

import { FontAwesome6, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import baseURL from "../../assets/common/BaseUrl";
import Error from "../../src/User/Error";
import { useNavigation } from "@react-navigation/native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Picker } from "@react-native-picker/picker";

function ShopPost() {

const navigation = useNavigation()
const { width } = Dimensions.get("window")

const userId = useSelector((state)=>state.user)

const [picture,setPicture] = useState(null)
const [picturesec,setPicturesec] = useState(null)
const [video,setVideo] = useState(null)

const [hasGalleryPermission,setHasGalleryPermission] = useState(null)

const [name,setName] = useState("")
const [price,setPrice] = useState("")
const [phone,setPhone] = useState("")
const [description,setDescription] = useState("")
const [discount,setDiscount] = useState("")
const [pickerValue,setPickerValue] = useState()

const [error,setError] = useState("")

const [location,setLocation] = useState("")
const [region,setRegion] = useState("")
const [town,setTown] = useState("")
const [whatsapp,setWhatsapp] = useState("")

const [category,setCategory] = useState("")
const [condition,setCondition] = useState("")

const [categories,setCategories] = useState([])

const [isLoading,setIsLoading] = useState(false)
const [isVideoLoading,setIsVideoLoading] = useState(false)

const translateX = useRef(new Animated.Value(0)).current

// expo-video player
const player = useVideoPlayer(video || "", (p)=>{
p.loop = true
})



useEffect(()=>{

;(async()=>{
const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
setHasGalleryPermission(galleryStatus.status === "granted")
})()

fetch(`${baseURL}shopscat`)
.then(res=>res.json())
.then(results=>{
setCategories(results)
})

},[])



useEffect(()=>{

if(video){
player.play()
setIsVideoLoading(false)
}

},[video])



useEffect(()=>{

Animated.loop(
Animated.sequence([
Animated.timing(translateX,{
toValue:width-200,
duration:3000,
useNativeDriver:true
}),
Animated.timing(translateX,{
toValue:0,
duration:3000,
useNativeDriver:true
})
])
).start()

},[])



const openImagePicker = async()=>{

if(!hasGalleryPermission) return

const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ['images'],
quality:1
})

if(!result.canceled){
setPicture(result.assets[0].uri)
}

}



const openPicker = async()=>{

if(!hasGalleryPermission) return

const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes:['images'],
quality:1
})

if(!result.canceled){
setPicturesec(result.assets[0].uri)
}

}



const openVideoPicker = async()=>{

if(!hasGalleryPermission) return

const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes:['videos'],
quality:1
})

if(!result.canceled){
setVideo(result.assets[0].uri)
setIsVideoLoading(true)
}

}



const handleSubmit = async()=>{

const credentials =
picture &&
condition &&
picturesec &&
pickerValue &&
name &&
phone &&
price &&
description &&
location &&
region &&
town &&
whatsapp &&
category

if(!credentials){
setError("Please fill in the credentials")
return
}

setIsLoading(true)

try{

const formData = new FormData()

formData.append("picture",{
uri:picture,
type:"image/jpeg",
name:"image.jpg"
})

formData.append("picturesec",{
uri:picturesec,
type:"image/jpeg",
name:"image.jpg"
})

if(video){
formData.append("video",{
uri:video,
type:"video/mp4",
name:"video.mp4"
})
}

formData.append("name",name)
formData.append("discount",discount)
formData.append("description",description)
formData.append("condition",condition)
formData.append("region",region)
formData.append("town",town)
formData.append("location",location)
formData.append("category",category)
formData.append("phone",phone)
formData.append("whatsapp",whatsapp)
formData.append("price",price)
formData.append("userId",userId)

const response = await fetch(`${baseURL}shops`,{
method:"POST",
headers:{
Accept:"application/json",
"Content-Type":"multipart/form-data"
},
body:formData
})

await response.json()

navigation.navigate("Home")

}catch(err){
console.log(err)
}

setIsLoading(false)

}



if(hasGalleryPermission === false){
return(
<View style={{alignItems:"center",marginTop:60}}>
<Text>Permission denied</Text>

<TouchableOpacity
style={styles.permissionButton}
onPress={()=>Linking.openSettings()}
>
<Text style={{color:"white"}}>Go to settings</Text>
</TouchableOpacity>

</View>
)
}



return(

<View style={styles.container}>

<ScrollView showsVerticalScrollIndicator={false}>

<View style={styles.imageRow}>

<View style={styles.imagecont}>
<Image source={{uri:picture}} style={styles.image}/>
<TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
<FontAwesome6 name="circle-plus" size={24}/>
</TouchableOpacity>
</View>

<View style={styles.imagecont}>
<Image source={{uri:picturesec}} style={styles.image}/>
<TouchableOpacity style={styles.imagePicker} onPress={openPicker}>
<FontAwesome6 name="circle-plus" size={24}/>
</TouchableOpacity>
</View>

<View style={styles.imagecont}>

{isVideoLoading && <ActivityIndicator size="large" color="#f5a53d"/>}

{video && (
<VideoView
player={player}
style={styles.vid}
fullscreenOptions={{ enabled: true }}
pictureInPicture
/>
)}

<TouchableOpacity style={styles.imagePicker} onPress={openVideoPicker}>
<FontAwesome6 name="video" size={20} color="white"/>
</TouchableOpacity>

</View>

</View>


<TextInput
style={styles.input}
placeholder="Enter product name"
value={name}
onChangeText={setName}
/>

<TextInput
style={styles.input}
placeholder="Phone number e.g +233247747624"
value={phone}
onChangeText={setPhone}
/>

<TextInput
style={styles.input}
keyboardType="numeric"
placeholder="Whatsapp e.g 233247747624"
value={whatsapp}
onChangeText={(text)=>{
const filtered = text.replace(/^0|[^\d]/g,'')
setWhatsapp(filtered)
}}
/>



<TextInput style={styles.input} placeholder="Region" value={region} onChangeText={setRegion}/>
<TextInput style={styles.input} placeholder="Town" value={town} onChangeText={setTown}/>
<TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation}/>

<TextInput
style={styles.textarea}
multiline
placeholder="Describe the product"
value={description}
onChangeText={setDescription}
/>


<View style={styles.pickerBox}>
<Picker
selectedValue={pickerValue}
onValueChange={(v)=>{
setPickerValue(v)
setCategory(v)
}}
>
<Picker.Item label="Choose category" value=""/>

{categories.map((item)=>(
<Picker.Item key={item._id} label={item.name} value={item._id}/>
))}

</Picker>
</View>


{error ? <Error message={error}/> : null}


<TouchableOpacity
style={styles.submitBtn}
onPress={handleSubmit}
disabled={isLoading}
>

{isLoading ?
<ActivityIndicator color="white"/> :
<Text style={{color:"white"}}>Post for approval</Text>
}

</TouchableOpacity>


<View style={{alignItems:"center",marginTop:20}}>

<Text>By posting you agree to</Text>

<View style={{flexDirection:"row"}}>

<TouchableOpacity onPress={()=>navigation.navigate("terms")}>
<Text style={styles.link}>Terms</Text>
</TouchableOpacity>

<Text> and </Text>

<TouchableOpacity onPress={()=>navigation.navigate("privacy")}>
<Text style={styles.link}>Privacy</Text>
</TouchableOpacity>

</View>

</View>


<View style={styles.noticeBox}>
<Text style={{textAlign:"center"}}>
After posting, send your Ghana card or national ID for approval. Press <Feather name="menu" size={14}/> then open your profile.
</Text>
</View>


</ScrollView>

</View>

)

}

export default ShopPost;



const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"white",
padding:20,
},

imageRow:{
flexDirection:"row",
justifyContent:"center",
marginBottom:20
},

imagecont:{
width:90,
height:90,
borderWidth:3,
borderColor:"black",
borderRadius:50,
margin:10,
justifyContent:"center",
alignItems:"center"
},

image:{
width:"100%",
height:"100%",
borderRadius:50
},

imagePicker:{
position:"absolute",
bottom:-5,
right:-5,
backgroundColor:"#f5a53d",
padding:6,
borderRadius:20
},

vid:{
width:90,
height:90,
borderRadius:50,
bottom:2
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:12,
padding:14,
marginBottom:12
},

textarea:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:12,
padding:14,
height:120,
marginBottom:12,
textAlignVertical:"top"
},

pickerBox:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:12,
marginBottom:12
},

submitBtn:{
backgroundColor:"black",
padding:15,
borderRadius:30,
alignItems:"center"
},

link:{
textDecorationLine:"underline",
marginHorizontal:4
},

noticeBox:{
marginTop:30,
backgroundColor:"#f5a53d",
padding:15,
borderRadius:10,
marginBottom:120
},

permissionButton:{
backgroundColor:"blue",
padding:10,
marginTop:20,
borderRadius:5
}

})