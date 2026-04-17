import { Dimensions, Image,Button, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableHighlight, Pressable } 
from 'react-native'
import React from 'react'
import { useState } from 'react';
import {  Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';



var {width} = Dimensions.get("window");


const MechanicsList = (props) => {
  const [modalVisible, setModalVisible] = useState(false)


  return (
    <View>
      <Modal animationType='fade'  transparent={true} visible={modalVisible}
      onRequestClose={()=>{
        setModalVisible(false)
      }}
      >
        <View style={styles.centeredV} >
          <View style={styles.modalView} >
            <TouchableOpacity underlayColor="black" onPress={()=>{setModalVisible(false)}} 
            style={{alignSelf:"flex-end", position:"absolute", top:5, right:10}}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

          <TouchableOpacity  onPress={()=>{props.navigation.navigate("mechanics", {item:props}),setModalVisible(false)}}
          style={{padding:7, width:65,borderRadius:5, bottom:7}}
          >
           <MaterialCommunityIcons name="file-document-edit" size={40} color="black" />
          </TouchableOpacity>
          
          <View style={{margin:5}} >

          <TouchableOpacity  style={{padding:7, width:65, borderRadius:5, top:7}}
           onPress={()=>[props.delete(props._id), setModalVisible(false)]}
           >
           <AntDesign name="delete" size={35} color="red" />
           </TouchableOpacity>
           </View>

          </View>
        </View>
      </Modal>
      <TouchableOpacity
    //   onPress={()=>{props.navigation.navigate("Detailpage", props)}}
      onLongPress={()=> setModalVisible(true)}
      style={[styles.cont, {backgroundColor: props.index % 2 == 0 ? "white" : "#f5a53d"}]} >
        <Image style={{height:50, width:50, marginRight:5}} source={{ uri: props.picture }} />
        <Text style={styles.item}  numberOfLines={1}>{props.name}</Text>
        <Text style={styles.item}  numberOfLines={1}>{props.region}</Text>
        <Text style={styles.item}  numberOfLines={1}>{props.town}</Text>
        <Text style={styles.item}  numberOfLines={1}>{props.location}</Text>
      
      </TouchableOpacity>
    </View>
  )
}

export default MechanicsList

const styles = StyleSheet.create({
cont:{
  flexDirection:"row",
  width:width,
  padding:5,
  

},
item:{
  flexWrap:"wrap",
  margin:1,
  width:width /6,
  top:15
},
centeredV:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
  marginTop:22,
 
},
modalView:{
  margin:20,
  backgroundColor:"white",
  borderRadius:20,
  padding:35,
  alignItems:"center",
//   backgroundColor:"#09e034",
  shadowColor:"#000",
  shadowOffset:{
    width:0,
    height:2
  },
  shadowOpacity:0.25,
  shadowRadius:3.84,
  elevation:5
}

})