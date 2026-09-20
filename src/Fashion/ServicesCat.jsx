import { View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { ScrollView, Text } from 'native-base'

const ServicesCat = ({ categories, categoryFilter, onCategoryPres }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    // const [fontsLoading] = useFonts({
    //     robotofont: require("../../assets/Roboto/Roboto-Medium.ttf"),
    //    }) 
      
      
    //   if(!fontsLoading){
    //     return undefined;
    //   }
      
      const handleCategoryPress = (categoryId) => {
      
        if (selectedCategory === categoryId) {
          setSelectedCategory(null); 
        } else {
          setSelectedCategory(categoryId); 
        }
      
       
      };
    


    return (

        <ScrollView horizontal={true} style={{ height: 48, marginRight: -20, bottom:10, }} >

            <View style={{ flexDirection: "row", marginRight: 50, }} >
                <TouchableOpacity
                    key={1}
                    onPress={() => {
                        categoryFilter('all')
                    }}
                >
                    <Text style={{
                         left: 12, top: 1, backgroundColor: "black", width: 44,
                         height: 44,
                          textAlign: "center",
                         padding: 13,
                         fontSize: 14,
                         
                         borderRadius:45,
                        //  marginRight:2,
                         color:"white"
                    }} >

                       All
                    </Text>
                </TouchableOpacity>

                {categories.map((item) => {
                    return (
                        <View  key={item._id} >
                            <TouchableOpacity
                                onPress={() => {
                                    categoryFilter(item._id);
                                    handleCategoryPress(item._id)
                                    
                                }}
                                style={{ height: 110, left: 30, top: -5 }}
                            >
                                <View style={{ flexDirection: "row", marginRight: 8, top: 6, borderColor:"#f5a53d", borderWidth:1 ,
                            borderRadius:26, padding:4,height:40}} >
                                    <Image
                                        source={{ uri: item.picture }}
                                        style={{ width: 34, bottom:2, borderRadius: 30, height: 34 }}
                                        h={100}
                                        alt="poor network"
                                    />
                                        <Text style={{
                                            top: 4, fontSize: 14,
                                            marginLeft: 5,
                                            paddingRight:4,
                                           
                                        }} >
                                            {item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    );
                })}



            </View>
        </ScrollView>

    )
}

export default ServicesCat;