import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const About = () => {
  const navigation = useNavigation()
  return (
    <View style={{flex:1, justifyContent:"center"}} >
       <MaterialCommunityIcons style={styles.icon} name="fruit-pineapple" size={104} color="#09e034" />
      <Text style={styles.text} >Welcome to PalmFarm. This app intends to connect farmers to buyers. </Text>
      <Text style={styles.text}>It also help farmers to hire a car in their locality </Text>

      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("main")}  >
        <Text>Explore</Text>
        </TouchableOpacity>
    </View>
  )
}

export default About

const styles = StyleSheet.create({
  text:{
    fontSize:25,
    marginHorizontal:20
  },
  icon:{
    bottom:70, alignSelf:"center"
  },
  button:{
      alignSelf:"center",
      marginVertical:30,
      top:20, backgroundColor:"#09e034", padding:20, borderRadius:20
  }
})