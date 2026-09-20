import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  // View,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { AntDesign, Entypo, Feather, EvilIcons } from "@expo/vector-icons";
import {
  Pressable,
  View,
  Image,
  Text,
  Input,
  HStack,
  VStack,
} from "native-base";
import SearchCar from "../MyDriver/SearchCar";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import { useFocusEffect } from "@react-navigation/native";


var {height, width} = Dimensions.get("window")

const OkadaCreen = (props) => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false); // Initialize with false
  const [input, setInput] = useState("");
  const [productCtg, setProductCtg] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const productsPerPage = 20;
  const [loadingDetail, setLoadingDetail] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const productsResponse = await fetch(`${baseURL}okada/motor/approved`);
          const productsData = await productsResponse.json();
          console.log(productsData)
          setProducts(productsData);
          setProductsFiltered(productsData);
          setProductCtg(productsData);
          setInitialState(productsData);
          setLoading(false);

 
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      fetchData();

   
   
    }, [])
  );

  const searchProducts = (text) => {
    setInput(text);
    setProductsFiltered(
      products.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : '';
        const region = item.region ? item.region.toLowerCase() : '';
        const town = item.town ? item.town.toLowerCase() : '';
        const location = item.location ? item.location.toLowerCase() : '';
  
        return (
          name.includes(text.toLowerCase()) ||
          region.includes(text.toLowerCase()) ||
          town.includes(text.toLowerCase()) ||
          location.includes(text.toLowerCase())
        );
      })
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const loadMoreProducts = () => {
    // Double the number of displayed products
    setDisplayedProducts(displayedProducts + productsPerPage);
  };







  return (
    <VStack style={{flex:1, bottom:20, backgroundColor:"white"}}>
      {loading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator
            style={{ marginTop: "100%" }}
            size="large"
            color="#f5a53d"
          />
        </View>
      ) : (
        <VStack style={{  flex:1 , top:5,}}>
         
          <HStack
            style={{  height: 120 , marginBottom:16}}
            alignItems="center"
            w="full"
            px={6}
            safeAreaTop
          >

            <View
              style={{
                borderRadius: 40,
                backgroundColor: "#f2f2f2",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                marginTop: -20,
                marginBottom:8
              }}
            >
              <Input
                onFocus={openList}
                onChangeText={ searchProducts}
                value={input}
                placeholder="Where are you?"
                w="100%"
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
                  bg: "#f2f2f2",
                }}
              />
              {focus == true ? (
                <AntDesign
                  name="closecircleo"
                  size={24}
                  onPress={onBlur}
                  color="black"
                  style={{ marginTop: 12, right:40 }}
                />
              ) : null}
            </View>

         
          </HStack>
         
          {focus == true ? (
            <SearchCar productFiltered={productFiltered}/>

            
          ) : (
            <>
                <Text alignSelf={"center"} bottom={10}>Call a nearby driver to pick your goods</Text>
              {productCtg.length > 0 ? (
                  <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ bottom: 40, marginBottom:-60 }}
                >
                  
                    {productCtg.map((item) => (
                            <View shadow={8} rounded={8} style={[styles.cont]}  key={item._id}>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                            {/* <Pressable 
                           // onPress={() => navigation.navigate("phonecall", item)}
                          
                           > */}
                            <View style={{flex:0.5}}>
                              
                             
                          
                            
 
                             {loadingDetail ? (
                           <ActivityIndicator size="small" color="#f5a53d" style={{ top: 70, right: 40 }} />
                         ) : (  
                             <View style={{flexDirection:"row", justifyContent:"space-between", top:40}} >
                            
                            
                              <Image resizeMode="stretch" style={{width:width/7, height:height/15, margin:5, borderRadius:50, bottom:50}}
                               source={{uri:item.carpic}} alt="" />
               {/* callbutton  */}
               <TouchableOpacity  
                               onPress={async () => {
                              setLoadingDetail(true); // Show loading indicator
                              try {
                                const response = await fetch(`${baseURL}okada/okadaview/${item._id}`);
                                const productData = await response.json();
                                setLoadingDetail(false); // Hide loading indicator
                                navigation.navigate("okadaphone", productData);
                              } catch (error) {
                                setLoadingDetail(false); // Hide loading indicator in case of error
                                console.error("Error viewing product:", error);
                              }
                            }}
 >
   {loadingDetail ? (
     <ActivityIndicator size="small" color="#f5a53d" style={{ top: 6, right: 40 }} />
   ) : (  
     <Feather name="phone-call" style={{ bottom: 30, right: 40 }} size={30} color="#07ed6b" />
   )}
 </TouchableOpacity>
                             
                            
     </View>
                         )}
 

 <View style={{bottom:10}}>
  <Text style={{color:"black", width:width/2.2, marginLeft:5, fontWeight:"bold", fontSize:12, bottom:6 }}  numberOfLines={1}>
                                {item.name}
                               </Text>
                             
                            
                                 <View style={{flexDirection:"row",  bottom:6}}>
                                 <Entypo name="location" size={8} style={{ top:3}} color="#f5a53d" />
                             <Text style={{color:"black", width:width/2.5,left:5, fontWeight:"bold", fontSize:12,bottom:3 }}  numberOfLines={1}>
                                {item.region}
                              </Text>
                             </View>
                     
                             
                             <View style={{flexDirection:"row",  bottom:12}}>
                             <Entypo name="location-pin" size={8} color="#f5a53d" style={{top:3,}} />
                             <Text style={{color:"black", width:width/2.5, left:5, fontWeight:"bold", fontSize:12,bottom:4 }}  numberOfLines={1}>
                                {item.town}
                             </Text>
                             </View>
                            
                             <View style={{flexDirection:"row", bottom:20}}>
                             <EvilIcons name="location" size={9} color="#f5a53d" style={{ top:6}}/>
                             <Text style={{color:"black", width:width/2.3, left:5, marginBottom:6, fontWeight:"bold", fontSize:12, bottom:1}}  numberOfLines={1}>
                                {item.location}
                                 </Text>
                                 </View>
 </View>
                       
 
 
                            </View>
 
                            
                            {/* </Pressable> */}
                            <View style={{flex:0.5}}>
                           
                             <Image style={styles.image}
                              source={{uri:item.driverpic}} alt="" />
                           
                               <Text style={{color:"black", fontSize:17,  left:50, width:110, top:4, fontWeight:"bold", marginBottom:16, fontSize:12
                             
                             }}  numberOfLines={1}>
                                {item.carnum}
                                 </Text>
                            </View>
 
                            </View>
                           </View>
                    )).slice(0, displayedProducts)}
                   {displayedProducts < productCtg.length && (
                <TouchableOpacity
               
                onPress={loadMoreProducts}
                style={{alignItems:"center",backgroundColor:"black", paddingHorizontal:6, borderRadius:6, marginHorizontal:22,
                marginBottom:30, top:6, height:23, justifyContent:"center"
                
              }}
              >
                <Text style={{color:"#f5a53d",fontFamily:"robotty"}}  >Load More</Text>
              </TouchableOpacity>
              )}
                </ScrollView>
              ) : (
                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text style={{ color: "white" }}>
                    There are no products available.
                  </Text>
                </View>
              )}
            </>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default OkadaCreen;
const styles = StyleSheet.create({
  cont:{
    backgroundColor:"#f2f2f2",
    
    height: height/6.5,
    marginHorizontal:10,
    marginVertical:2,
    padding:4
    
  },
  smallcont:{
    flexDirection:'row',
    justifyContent:"space-between",
    top:5,
    backgroundColor:"red"
  },
  text:{
    color:"black",
    margin:5
  },
  image:{height:height/9, width:width, top:3, borderRadius:6}

})

