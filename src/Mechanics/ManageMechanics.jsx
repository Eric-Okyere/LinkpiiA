import { ActivityIndicator, BackHandler, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React,{useCallback, useState} from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
 Input,HStack
} from "native-base";
import { useSelector } from 'react-redux'
import baseURL from '../../assets/common/BaseUrl'
import MechanicsList from './MechanicsList'



var {height, width} = Dimensions.get("window")

const ManageMechanics = (props) => {
  
  const [productList, setProductList] = useState()
  const [productFilter, setProductFilter] = useState()
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState()
  const [input, setInput] = useState();
  const [focus, setFocus] = useState();
  const [isLogged, setIsLogged] = useState(false)



  const navigation = useNavigation();
  const myProducts= useSelector((state)=>state)
   
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("keepLoggedIn")
                  .then((res)=>{
                      setToken(res)
                  })
                  .catch((error)=> console.log(error))
                 
                
                  // axios.get("http://192.168.43.94:3000/send")
                  axios.get(`${baseURL}mechanics/user/${myProducts.user}`)
                  .then((res)=>{
                      setProductList(res.data);
                      console.log(res.data)
                      setProductFilter(res.data);
                      setLoading(false);
                  })

                  
  
                  return ()=>{
                      setProductList();
                      setProductFilter();
                      setLoading(true);
                      
                  }
    }, [])
  );

  const searchProducts = (text) => {
    setProductFilter(
      productList.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );

  };

  const openList = () => {
    setFocus(true);

  };

  const onBlur = () => {

    setFocus(false);
  };


    const deleteProducts = (id) =>{
    
      axios.delete(
        `${baseURL}mechanics/${id}`,{
          // headers:{Authorization: `Bearer ${token}`}
        }
      ) .then((res)=>{
        const products = productFilter.filter((item)=> item.id !== id)
        
        setProductFilter(products)
      }) .catch((error)=> console.log(error))
    }






    const Listheader =()=>{
      return(
        <View  style={styles.listheader} >
          <View style={styles.headerItem} >
            <Text style={{fontWeight:"600"}} >Image</Text>
          </View>
          <View style={styles.headerItem} >
            <Text style={{fontWeight:"600"}} >Shop</Text>
          </View>
        <View style={styles.headerItem} >
        <Text style={{fontWeight:"600"}} >Region</Text>
        </View>
        <View style={styles.headerItem} >
        <Text style={{fontWeight:"600"}} >Town</Text>
        </View>
        <View style={styles.headerItem} >
        <Text style={{fontWeight:"600", right:5}} >Location</Text>
        </View>
      
        </View>
      )
    }


  return (
    <View style={{flex:1, backgroundColor:"#f5a53d"}} >
     <View
      // style={{top:70, backgroundColor: "black"}}
       >
     <HStack
            style={{ backgroundColor: "#f5a53d", height: 110 }}

            alignItems="center"
            w="full"
            px={6}
            safeAreaTop
          >
          
          <TouchableOpacity   onPress={()=>navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

            {/* Search */}
            <View
              style={{
                borderRadius: 40,
                backgroundColor: "white",
                flexDirection: "row",
                width: "75%",
                justifyContent: "space-between",
                left:50
                // marginTop: -5,
              }}
            >
              <Input
                onFocus={openList}
                onChangeText={(text) => searchProducts(text)}
                value={input}
                placeholder="Search your post"
                w="75%"
                type="search"
                h={12}
                borderWidth={0}
                InputLeftElement={
                  <AntDesign
                    style={{ left: 8 }}
                    name="search1"
                    size={24}
                    color="black"
                  />
                }
                size="lg"
                variant="rounded"
                _focus={{
                  bg: "white",
                }}
              />
            </View>
        
          </HStack>
    
     </View>
     {
  loading ? (
    <View>
      <ActivityIndicator top={150} size="large" color="red" />
    </View>
  ) : (
    productFilter.length > 0 ? (
      <FlatList 
        data={productFilter}
        ListHeaderComponent={Listheader}
        renderItem={({ item, index }) => (
          <MechanicsList {...item} navigation={props.navigation} delete={deleteProducts} index={index} />
        )}
        keyExtractor={(item) => item.id}
      />
    ) : (
      <Text style={{ textAlign:"center", fontSize:30}}>
        You have not posted any fashion or electronic product yet. Please feel free to sell your products</Text>
    )
  )
}


    </View>
  )
}

export default ManageMechanics

const styles = StyleSheet.create({
  listheader:{
    flexDirection:"row",
    padding:3,
    backgroundColor:"#f5a53d"
  },
  headerItem:{
    // margin:3,
    width: width / 6
  }
})