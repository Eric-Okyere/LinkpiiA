import React from 'react';
import { Text, Image, Linking, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView,View,Pressable, Center, HStack } from 'native-base';
import call from 'react-native-phone-call';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

const Search = (props) => {
  const { productFiltered } = props;
  const navigation = useNavigation();

  const openDial = () => {
    const args = {
        number: '+233247747624',
        prompt: false,
        skipCanOpen: true
    }

    call(args).catch(console.error)
}

const Whatsapp =()=>{
    if (Platform.OS === "ios") {
        Linking.openURL(`https://wa.me/233209317581`)
       } else if (Platform.OS === "android") {
        Linking.openURL(`https://wa.me/233209317581`)
       }
}


  return (
    <View >
      <ScrollView  bottom={6} pt={1} style={{marginBottom:220, top:30, }} >
      {productFiltered.length > 0 ? (
        productFiltered.map((item) => (
          
          <Pressable
          shadow={6} rounded="md" bg="gray.100" mb={4} marginX={4} paddingY={2}
            key={item._id}
            onPress={() => navigation.navigate("Detail", item)}
          >
            <View  style={{ marginHorizontal: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{flexDirection:"row",right:10,}}>
                <Image  source={{ uri: item.picture }} style={{ width: 80, height: 80, borderRadius:6}} resizeMode='contain' />
                <Image  source={{ uri: item?.picturesec }} style={{ width: 80, height: 80, borderRadius:6, marginLeft:4}} resizeMode='contain' />
                </View>
                <View>
                  <Text numberOfLines={1} style={{ width: 145 }}>{item.name}</Text>
                  <Text numberOfLines={1} style={{ width: 145 }}>{item.region}</Text>
                  <Text numberOfLines={1} style={{ width: 145 }}>{item.town}</Text>
                  <Text numberOfLines={1} style={{ width: 145 }}>{item.location}</Text>
                  <Text numberOfLines={1} style={{ width: 145 }}>{item.description}</Text>
                </View>
              </View>
            </View>
          </Pressable>
         
        ))
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ alignSelf: "center" }}>
            You made a wrong input.
          </Text>

          <Text>Contact us to link you to what you want</Text>



          <Center mb={60}  >
                <Text style={{ fontFamily: "robotf", fontSize: 18, color: "white" }}>Send your flier for advertisement</Text>
            <HStack my={'3'} space={'1/2'}>
                <TouchableOpacity
                    onPress={Whatsapp}
                    >

                <FontAwesome5 name="whatsapp-square"  size={35} color="#07ed6b" />
                   
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={openDial}
                    >

                    <Feather name="phone-call" style={{ top: 4 }} size={30} color="#07ed6b" />
                   
                </TouchableOpacity>
                </HStack>
              
            </Center>

        </View>
      )}
       </ScrollView>
    </View>
  );
};

export default Search;