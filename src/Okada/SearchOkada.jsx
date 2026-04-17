import { View, FlatList, Pressable, ScrollViewBase } from 'react-native'
import React from 'react'
import { Center, Text, Image, ScrollView, } from "native-base"
import { useNavigation } from '@react-navigation/native'



const SearchOkada = (props) => {
  const { productFiltered } = props
  const navigation = useNavigation()
  return (
    <View style={{bottom:30}}>

      {productFiltered.length > 0 ? (

        <FlatList
          data={productFiltered}
          renderItem={({ item }) => {
            return (
              <ScrollView style={{marginBottom:70}}>
              <Pressable
              onPress={() => navigation.navigate("phonecall", item)}
                // style={{ flex: 1 }}
              >
                <View style={{ marginHorizontal: 20, }}>
                  <Center style={{ flexDirection: "row", justifyContent: "space-between"}} >
                    <Image source={{ uri: item.carpic }} w={20} h={24} resizeMode='contain' alt="" />
                    <Image source={{ uri: item.driverpic }} w={20} h={24} resizeMode='contain' alt="" />
                    <View>
                      <Text numberOfLines={1} style={{width:140}}>{item.name}</Text>
                      <Text numberOfLines={1} style={{width:140}}>{item.region}</Text>
                      <Text numberOfLines={1} style={{width:140}}>{item.town}</Text>
                      <Text numberOfLines={1} style={{width:140}}>{item.location}</Text>
                    </View>
                  </Center>
                </View>
              </Pressable>
              </ScrollView>
            )
          }}
          keyExtractor={(item) => item._id}
        />

      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }} >
          <Text style={{ alignSelf: "center" }} >
            Wrong input. Search by the town or your exact location.
          </Text>
        </View>
      )}
     
    </View>
  )
}

export default SearchOkada