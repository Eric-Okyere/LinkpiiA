import {TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'





const Post = () => {
    const navigation = useNavigation()
  return (
    <View style={{bottom:120, left:280}} >
        <TouchableOpacity 
        // onPress={()=>navigation.navigate("cont")} 
        onPress={()=>navigation.navigate("Postform")}
        >
     <AntDesign name="pluscircle" size={54} color="green" />
     </TouchableOpacity>
     
    </View>
  )
}

export default Post
