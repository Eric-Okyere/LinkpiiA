import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';


var { width } = Dimensions.get("window");

const ListProducts = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigateToFashionSig = () => {
    const { picture, picturesec, name,video, price, category, views, _id, index,description, phone, whatsapp,town,location,region } = props;
    props.navigation.navigate('agricsig', { 
      picture, 
      picturesec, 
      video,
      name, 
      price, 
      category, 
      views, 
      _id, 
      index,description, phone, whatsapp,town,location,region 
    });
  };

  const handleNavigateToElectronics = () => {
    props.navigation.navigate("library", { item: props });
    setModalVisible(false);
  };

  return (
    <View>
      <Modal animationType='fade' transparent={true} visible={modalVisible}
        onRequestClose={() => { setModalVisible(false) }}
      >
        <View style={styles.centeredV}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => { setModalVisible(false) }}
              style={{ alignSelf: "flex-end", position: "absolute", top: 5, right: 10 }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNavigateToElectronics}
              style={{ padding: 7, width: 65, borderRadius: 5, bottom: 7 }}
            >
              <MaterialCommunityIcons name="file-document-edit" size={40} color="black" />
            </TouchableOpacity>
            
            <View style={{ margin: 5 }}>
              <TouchableOpacity style={{ padding: 7, width: 65, borderRadius: 5, top: 7 }}
                onPress={() => [props.delete(props._id), setModalVisible(false)]}
              >
                <AntDesign name="delete" size={35} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={handleNavigateToFashionSig}
        onLongPress={() => setModalVisible(true)}
        style={[styles.cont, { backgroundColor: props.index % 2 === 0 ? "white" : "#f5a53d" }]} >
        <Image style={{ height: 50, width: 50, marginRight: 5 }} source={{ uri: props.picture }} />
        <Image style={{ height: 50, width: 50, marginRight: 5 }} source={{ uri: props.picturesec }} />
        <Text style={[styles.item]} numberOfLines={1}>{props.name}</Text>
        <Text style={styles.item} numberOfLines={1}>{props.price}</Text>
        <Text style={[styles.item, { width: 50, right: 2 }]} numberOfLines={1}>{props.approved ? 
            <Ionicons name="checkmark-circle" size={24} color="green" />:
            <Entypo name="block" size={24} color="red" />
          }</Text>
        <Text style={[styles.item, { left: 15 }]} numberOfLines={1}>{props.views}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ListProducts;

const styles = StyleSheet.create({
  cont: {
    flexDirection: "row",
    width: width,
    padding: 5,
  },
  item: {
    flexWrap: "wrap",
    margin: 1,
    width: width / 6,
    top: 15
  },
  centeredV: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
});
