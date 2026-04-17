import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dimensions, Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Modal, Animated} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import baseURL from '../assets/common/BaseUrl';
import { Box, Button, Center, Flex, HStack, Image, Pressable } from "native-base";
import { Feather, FontAwesome5, Entypo, EvilIcons } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loggedOut } from '../src/Redux/actions';
import PhoneInput from "react-native-phone-number-input";
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native';


var {height, width} = Dimensions.get("window");

function Adverts() {
    const { width, height } = Dimensions.get('window');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [userData, setUserData] = useState(null);
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
    const [hotProducts, setHotProducts] = useState([]);
      const [pressLoading, setPressLoading] = useState(false);
      const [fetchError, setFetchError] = useState(false);

    
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user);
   
    const translateX = useRef(new Animated.Value(0)).current;

    const ITEM_MARGIN = 8;
    const NUM_COLUMNS = 4;
    const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

  
      //  console.log("UserIdTok",userId)
      
        useEffect(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(translateX, {
                toValue: width - 200, // adjust 200 depending on text width
                duration: 3000,
                useNativeDriver: true,
              }),
              Animated.timing(translateX, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }, [translateX]);




    // console.log("A userId",userId)
    // Fetch Advert Data
    // useFocusEffect(
    //     useCallback(() => {
       
      
    //       const fetchData = async () => {
    //         try {
    //           const response = await fetch(`${baseURL}advert`);
    //           if (!response.ok) throw new Error('Failed to fetch data');
    //           const data = await response.json();
    //           setItems(data);
    //           setFetchError(false);
    //         } catch (error) {
    //           console.error('Error fetching adverts:', error.message);
    //           setFetchError(true);
    //         } finally {
    //           setIsLoading(false);
    //         }
    //       };
      
         
    //       fetchData();
    //     }, [])
    //   );


  const fetchHotProducts = async () => {
    try {
      const response = await fetch(`${baseURL}fashionpost/hot`);
      if (!response.ok) throw new Error('Mobile data is off. Turn on mobile data');
      const data = await response.json();
      setHotProducts(data);
    } catch (error) {
      console.error('Error fetching hot products:', error.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}advert`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setItems(data);
      setFetchError(false);
    } catch (error) {
      console.error('Error fetching adverts:', error.message);
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([fetchHotProducts(), fetchData()]);
  };

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

      

      // const fetchHotProducts = async () => {
      //   try {
      //     const response = await fetch(`${baseURL}fashionpost/hot`);
      //     if (!response.ok) throw new Error('Mobile data is off. Turn on mobile data');
      //     const data = await response.json();
      //     setHotProducts(data);
      //   } catch (error) {
      //     console.error('Error fetching hot products:', error.message);
      //   }
      // };
      
      // const fetchData = async () => {
      //   try {
      //     const response = await fetch(`${baseURL}advert`);
      //     if (!response.ok) throw new Error('Failed to fetch data');
      //     const data = await response.json();
      //     setItems(data);
      //     setFetchError(false);
      //   } catch (error) {
      //     console.error('Error fetching adverts:', error.message);
      //     setFetchError(true);
      //   } finally {
      //     setIsLoading(false);
      //   }
      // };
      


    // Fetch User Data on Focus
    useFocusEffect(
        useCallback(() => {
            const fetchUserData = async () => {
                console.log("Fetching user data for ID:", userId);

                if (!userId) {
                    console.warn("No user ID found, logging out...");
                    dispatch(loggedOut());
                    navigation.reset({ index: 0, routes: [{ name: "signup" }] });
                    return;
                }

                try {
                    const response = await axios.get(`${baseURL}userbyid/${userId}`);
                    const data = response.data;
                    setUserData(data);

                    if (data.report) {
                        navigation.navigate('report');
                        return;
                    } else if (!data.phone) {
                        setIsPhoneModalVisible(true); 
                    }
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.warn("User deleted from database, logging out...");
                        dispatch(loggedOut());
                        // console.log("Redux state after logout:", useSelector(state => state));
                        navigation.reset({ index: 0, routes: [{ name: "signup" }] });
                    } else {
                        console.error('Error fetching user data:', error?.response || error.message || error);
                    }
                }
            };

            fetchUserData();
        }, [userId, dispatch, navigation])
    );
    console.log("A user",userId)

    // Open Call Modal
    const handlePressCallButton = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    // Call Advertiser
    const openDialAdvert = async () => {
        await fetch(`${baseURL}call`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                receiverphone: selectedItem.phone,
                recname: selectedItem.name,
                pagename: "advert"
            })
        });

        const args = { number: selectedItem.phone, prompt: false, skipCanOpen: true };
        call(args).catch(console.error);
        setIsModalVisible(false);
    };

    // Open WhatsApp
    const openWhatsApp = async () => {
        await fetch(`${baseURL}whatsapp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                receiverphone: selectedItem.phone,
                recname: selectedItem.name,
                pagename: "advert"
            })
        });

        Linking.openURL(`https://wa.me/${selectedItem.whatsapp}`).catch(console.error);
        setIsModalVisible(false);
    };

    // Open Direct Call
    const openDial = () => {
        const args = { number: '+233209317581', prompt: false, skipCanOpen: true };
        call(args).catch(console.error);
    };

    // Open Direct WhatsApp
    const Whatsapp = () => {
        Linking.openURL(`https://wa.me/233209317581`).catch(console.error);
    };

  
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="red" />
            </View>
        );
    }


    const handlePhoneSubmit = async (e) => {
      
       
        let formattedPhoneNumber = newPhoneNumber;
  
    if (formattedPhoneNumber.startsWith("+")) {
      // Ensure the first zero **after** the country code is removed
      formattedPhoneNumber = formattedPhoneNumber.replace(/^(\+\d{1,3})0/, "$1");
    } else {
      // If no country code, assume default country (GH) and format correctly
      formattedPhoneNumber = `+233${formattedPhoneNumber.replace(/^0+/, "")}`;
    }
      
        console.log("Submitted phone number:", formattedPhoneNumber);
      
        try {
          const response = await fetch(`${baseURL}phone/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: formattedPhoneNumber }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            alert("Phone number updated successfully!");
            setIsPhoneModalVisible(false); // Close the modal
          } else {
            alert(data.message || "Failed to update phone number.");
          }
        } catch (error) {
          console.error("Error submitting phone number:", error);
        //   alert("An error occurred. Please try again.");
        }
      };



      if (fetchError) {
        return (
          <View style={{ alignItems: 'center', marginTop: 20, justifyContent: 'center', flex: 1 }}>
    <Text style={{ marginBottom: 10 }}>Mobile data is off. Turn on mobile data.</Text>
    <TouchableOpacity
      style={{ backgroundColor: "black", borderRadius: 10 }}
     onPress={refreshData}
    >
      <Text style={{ color: "white", paddingHorizontal: 10, paddingVertical: 6 }}>Refresh</Text>
    </TouchableOpacity>
  </View>
        );
      }
      

      const handleRefresh = async () => {
        setIsLoading(true);
        await Promise.all([fetchHotProducts(), fetchData()]);
        setIsLoading(false);
      };
      


    return (
 
<View style={{ flex: 1, backgroundColor: "#f5a53d" }}>
 {/* <Text style={{ top: height / 18, alignSelf: "center", color: "white", fontSize: 16 }}>
   
  </Text> */}

  <View style={{top:height/32, height:height/18}}>

  <HStack justifyContent={"space-between"} px={4} style={{ zIndex: 1,top: height / 20, }}>
          <TouchableOpacity onPress={Whatsapp}>
            <FontAwesome5 name="whatsapp-square" size={25} color="#07ed6b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openDial}>
            <Feather name="phone-call" style={{ top: 4 }} size={20} color="#07ed6b" />
          </TouchableOpacity>
        </HStack>


        <Animated.Text
          style={{
            fontSize: 16,
            alignSelf: 'flex-start',
            transform: [{ translateX }],
            color: 'white',
            // position: 'absolute',
            bottom:height/60
          }}
        >
          Send your flier to be posted here for ads.
        </Animated.Text>


        <Text style={{alignSelf:"center", top:2, color: 'white', }}> Use your thumb to control the adverts</Text>

        </View>

  <View style={{ height: height / 2.8 }}>
    {/* Header, WhatsApp/Call, Carousel here */}
    <Carousel
         loop
         width={width}
         autoPlay={true}
         data={items}
         style={{ height: height / 3, marginTop: 50 }} // Smaller height
         scrollAnimationDuration={1000}
         renderItem={({ item }) => (
           <View style={{ flex: 1, justifyContent: 'center' }}>
             <Image
               source={{ uri: item.picture }}
               style={{ height: height / 3.5 }}
               resizeMode="stretch"
               onError={(error) => console.error('Error loading image:', error)}
               mx={2}
               alt='pic'
             />
             <TouchableOpacity onPress={() => handlePressCallButton(item)} style={{ alignItems: "center", bottom:38}}>
               <Feather name="phone-call" size={30} color="#07ed6b" />
             </TouchableOpacity>
           </View>
         )}
       />
  </View>

  {/* Products - ONLY THIS SCROLLS */}
  <Text style={{alignSelf:"center", fontWeight:"bold"}}>Hot Products</Text>
  <FlatList
    data={hotProducts}
    keyExtractor={(item) => item._id}
    numColumns={NUM_COLUMNS}
    contentContainerStyle={{ padding: ITEM_MARGIN }}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <Pressable
        onPress={async () => {
          try {
            setPressLoading(true);
            const response = await fetch(`${baseURL}fashionpost/products/${item._id}`);
            const productData = await response.json();
            navigation.navigate("Page", productData);
          } catch (error) {
            console.error("Error viewing product:", error);
            alert("Mobile data is off. Turn on mobile data");
          } finally {
            setPressLoading(false);
          }
        }}
        style={{
          width: ITEM_WIDTH,
          backgroundColor: 'white',
          borderRadius: 10,
          marginBottom: 10,
          elevation: 3,
        }}
      >
        <Image
          source={{ uri: item.picture }}
          style={{
            width: '100%',
            height: height / 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          resizeMode="cover"
          alt='pic'
        />
        <Box px={2} py={1}>
          <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: "bold" }}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: "bold", color: "#f5a53d", alignSelf: "center" }}>
            Gh₵{item.price}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <Entypo name="location" size={9} color="#f5a53d" />
            <Text numberOfLines={1} style={{ fontSize: 10, marginLeft: 4, fontWeight: "bold" }}>
              {item.region}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <Entypo name="location-pin" size={9} color="#f5a53d" />
            <Text numberOfLines={1} style={{ fontSize: 10, marginLeft: 4, fontWeight: "bold" }}>
              {item.town}
            </Text>
          </View>
        </Box>
      </Pressable>
    )}
  />



<Modal
                 animationType="slide"
                 transparent={true}
                 visible={isModalVisible}
                 onRequestClose={() => setIsModalVisible(false)}
             >
                 <View style={styles.modalOverlay}>
                     <View style={styles.modalContainer}>
                         {/* Display the name of the selected item */}
                         <Text style={styles.modalText}>Welcome to {selectedItem?.name}</Text> 
                         <View style={styles.modalButtons}>
                             <TouchableOpacity onPress={openDialAdvert} style={styles.modalButton}>
                             <Feather name="phone-call" style={{ top: 4 }} size={30} color="#07ed6b" />
                             </TouchableOpacity>
                             <TouchableOpacity onPress={openWhatsApp} style={styles.modalButton}>
                                <FontAwesome5 name="whatsapp-square" size={35} color="#07ed6b" />
                             </TouchableOpacity>
                         </View>
                         <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                             <Text style={styles.modalCloseButtonText}>Cancel</Text>
                         </TouchableOpacity>
                     </View>
                 </View>
             </Modal>
 
</View>


      
)}

export default Adverts;
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f5a53d",
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: 300,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    modalButton: {
        padding: 10,
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f5a53d",
        borderRadius: 5,
    },
    modalCloseButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        position: 'relative',
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
      },
      phoneInput: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
      },
      saveButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      image:{height:height/9.5, width:width, borderRadius:12}

});
