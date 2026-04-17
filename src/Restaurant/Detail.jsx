import React, { useEffect, useRef, useState } from 'react';
import { Image, Box, View,  Spacer, Heading, HStack, Stack, Center, Alert, Button  } from 'native-base';
import { MaterialCommunityIcons, Entypo, EvilIcons, MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import { ScrollView, Platform, Linking, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Text, Modal as RNModal, Pressable, BackHandler  } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import { Dimensions } from 'react-native';
import { Video } from 'expo-av';

const {width,height} = Dimensions.get('window');


function CustomMediaCarousel({ data }) {
 const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const isManualScrolling = useRef(false);

  

  useEffect(() => {
    if (!data || data.length === 0) return;

    startAutoSlide();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [data]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isManualScrolling.current) return; // skip if user is interacting

      setCurrentIndex((prev) => {
        const next = (prev + 1) % data.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 3500);
  };


  

  const onScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setCurrentIndex(newIndex);
    isManualScrolling.current = false;
    startAutoSlide();
  };

  const onScrollBeginDrag = () => {
    isManualScrolling.current = true;
    clearInterval(intervalRef.current);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    startAutoSlide();
  };

  const goPrev = () => {
    const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    goToIndex(prevIndex);
  };

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    goToIndex(nextIndex);
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={{ width, height: height / 3 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        style={{ flex: 1 , top:4}}
      >
        {data.map((item, idx) => (
          <View
            key={idx}
            style={{ width, height: height / 3, justifyContent: 'center', alignItems: 'center' }}
          >
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.uri }}
                resizeMode="cover"
                alt="Image"
                style={{ width: width - 40, height: height / 3, borderRadius: 10 }}
              />
            ) : (
              <Video
                source={{ uri: item.uri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="stretch"
                shouldPlay={idx === currentIndex} // play only current video
                useNativeControls
                style={{ width: width - 40, height: height / 3, borderRadius: 10 }}
              />
            )}
          </View>
        ))}
      </ScrollView>

      {/* Prev/Next Buttons */}
      {/* <TouchableOpacity
        onPress={goPrev}
        style={[myStyle.navButton, { left: 10 }]}
        activeOpacity={0.7}
      >
        <MaterialIcons name="chevron-left" size={30} color="#f5a53d" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goNext}
        style={[myStyle.navButton, { right: 10 }]}
        activeOpacity={0.7}
      >
        <MaterialIcons name="chevron-right" size={30} color="#f5a53d" />
      </TouchableOpacity> */}

      {/* Dots Indicator */}
      {/* <View style={myStyle.dotsContainer}>
        {data.map((_, idx) => (
          <TouchableOpacity key={idx} onPress={() => goToIndex(idx)}>
            <View
              style={[
                myStyle.dot,
                { backgroundColor: idx === currentIndex ? '#f5a53d' : '#999' },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View> */}
    </View>
  );
}



function Detail({ route }) {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [newCommentPosted, setNewCommentPosted] = useState(false);
  const [visibleComments, setVisibleComments] = useState(2);
  const myProducts = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [complaintError, setComplaintError] = useState('');
  const [isInterestedModalOpen, setIsInterestedModalOpen] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const scrollViewRef = useRef(null);

useEffect(() => {
  const backAction = () => {
    navigation.goBack();   // 👈 Take user back
    return true;           // prevent default behavior
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);

  useEffect(() => {
    fetchUserData();

   
  }, [navigation, newCommentPosted]);

 console.log("****************",myProducts)

  const item = route.params;

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${myProducts}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone });

      const commentsResponse = await fetch(`${baseURL}foodcomment/comments/${item._id}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData.comments);

    } catch (error) {
      console.error('Error fetching user data or comments:', error);
    } finally {
      setIsCommentsLoading(false);
      setNewCommentPosted(false);
    }
  };



  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`${baseURL}food/${item._id}/related`);
        const text = await response.text(); // Get raw response
  
        console.log("Raw response:", text); // Log raw response before parsing
  
        const data = JSON.parse(text); // Try to parse JSON manually
        console.log("Related products:", data); // Log parsed related products
  
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
  
    fetchRelatedProducts();
  }, [item._id]);
  
  



  const openDial = async () => {
    try {
      const response = await fetch(`${baseURL}call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: item.phone,
          recname: item.name,
          pagename: "fashion"
        })
      });

      if (response.ok) {
        if (Platform.OS === "ios") {
          Linking.openURL(`tel:${item.phone}`);
        } else if (Platform.OS === "android") {
          Linking.openURL(`tel:${item.phone}`);
        }

        const responseview = await fetch(`${baseURL}viewers/${item._id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: myProducts,
            content: userData.phone
          })
        });
  
        if (responseview.ok) {
          console.log('Comment posted successfully.');
        }
      } else {
        console.error('Failed to send user data.');
      }
    } catch (error) {
      console.error('Error sending user data:', error);
    }
  };

  const openWhatsap = async () => {
    try {
      const response = await fetch(`${baseURL}whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: item.whatsapp,
          recname: item.name,
          pagename:"fashion"
        })
      });

      if (response.ok) {
        if (Platform.OS === "ios") {
          Linking.openURL(`https://wa.me/${item.whatsapp}`);
        } else if (Platform.OS === "android") {
          Linking.openURL(`https://wa.me/${item.whatsapp}`);
        }
      } else {
        console.error('Failed to send user data.');
      }
    } catch (error) {
      console.error('Error sending user data:', error);
    }
  };



  useEffect(() => {
  
    const newImages = [
      { type: 'image', uri: item.picture },
      { type: 'image', uri: item.picturesec },
    ];
  
    if (item.video) {
      newImages.push({ type: 'video', uri: item.video });
    }
  
    setImages(newImages);
  }, [item.picture, item.picturesec, item.video]);
  



  const handlePostComment = async () => {
    try {
      const response = await fetch(`${baseURL}foodcomment/${item._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: myProducts,
          content: comment
        })
      });

      if (response.ok) {
        console.log('Comment posted successfully.');
        setComment('');
        setNewCommentPosted(true);  // Trigger re-fetch
      } else {
        const errorText = await response.text();
        console.error(`Failed to post comment: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    return "1 hour ago";
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}foodcomment/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Comment deleted successfully.');
        // Update comments list by refetching
        setNewCommentPosted(true);  // Trigger re-fetch
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment.');
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const saveEditComment = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}foodcomment/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editingContent,
        }),
      });

      if (response.ok) {
        console.log('Comment updated successfully.');
        setEditingCommentId(null);
        setEditingContent('');
        setNewCommentPosted(true);  // Trigger re-fetch or update state
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update comment.');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      setError('Failed to edit comment.');
    }
  };

  const handleLodgeComplaint = () => {
    setIsComplaintModalOpen(true);
  };




  const handleCompliants = async () => {
    if (!complaint.trim()) {
      setComplaintError("Selection one option above");
      return;
    }

    const complaintData = {
      sendername: userData.name,
      senderphone: userData.phone,
      product: item.name,
      productphone: item.phone,
      complaint: complaint,
    };

    try {
      const response = await fetch(`${baseURL}compliants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });

      if (response.ok) {
        alert("Report is sent successfully.");
        setIsComplaintModalOpen(false);
        setComplaint('');

        // Send PUT request to deactivate the item
        // const deactivateResponse = await fetch(`${baseURL}fashionpost/${item._id}/deactivate`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (!deactivateResponse.ok) {
        //   console.error("Failed to deactivate item");
        // }
      } else {
        console.error("Failed to block products");
      }
    } catch (error) {
      console.error("Error sending block:", error);
    }
  };


  const handleBlockUser = async () => {
    if (!complaint.trim()) {
      setComplaintError("Select one option above");
      return;
    }

    const complaintData = {
      sendername: userData.name,
      senderphone: userData.phone,
      product: item.name,
      productphone: item.phone,
      complaint: complaint,
    };

    try {
      const response = await fetch(`${baseURL}compliants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });

      // const deactivateResponse = await fetch(`${baseURL}${item.author}/report`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (!deactivateResponse.ok) {
      //   console.error("Failed to block user");
      // }

      if (response.ok) {
        alert("User blocked successfully");
        setIsComplaintModalOpen(false);
        setComplaint('');

       
   
      } else {
        console.error("Failed to send block");
      }
    } catch (error) {
      console.error("Error sending block:", error);
    }
  };

  const handleCloseModal = () => {
    setIsInterestedModalOpen(false);
  };
  // console.log(item.author)
  // console.log(userData)



 


  const handleProductPress = async (item) => {
    try {
      // setPressLoading(true);
      
      // Send a GET request to fetch product details and increment view count
      const response = await fetch(`${baseURL}food/products/${item._id}`);
      const productData = await response.json();
      
      // Navigate to the detail page with the updated product data
      // navigation.navigate("Detail", productData);
  
      // Call handleRelatedProductPress to update the navigation params and fetch comments
      await handleRelatedProductPress(productData);
    } catch (error) {
      console.error("Error viewing product:", error);
      alert("Mobile data is off. Turn on mobile data");
    }
  };
  
  const handleRelatedProductPress = async (product) => {
    try {
      // Update the navigation params with the new product details
      navigation.setParams(product);
      
      // Fetch comments for the selected product
      await fetchComments(product._id);
    } catch (error) {
      console.error("Error fetching product comments:", error);
    }
  };
  
  // Function to fetch comments for the selected product
  const fetchComments = async (productId) => {
    try {
      const response = await fetch(`${baseURL}foodcomment/comments/${productId}`);
      const commentsData = await response.json();
      setComments(commentsData.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  // Scroll to top when product changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    // Refresh comments when item changes
    if (item?._id) {
      fetchComments(item._id);
    }
  }, [item]);

  

const openMap = () => {
    const url = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
    Linking.openURL(url);
  };


 const isOpenNow = (openingTimeStr, closingTimeStr) => {
  if (!openingTimeStr || !closingTimeStr) return false;

  const now = new Date();

  // Normalize time strings (remove whitespace and invisible chars)
  const cleanTime = (t) => t.replace(/[^\x20-\x7E]/g, '').trim();

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const time = cleanTime(timeStr);

    // Handle 12-hour format (with AM/PM)
    const ampmMatch = time.match(/(\d{1,2}):?(\d{0,2})?\s*(AM|PM|am|pm)?/);
    if (!ampmMatch) return null;

    let [_, hour, minute, ampm] = ampmMatch;
    hour = parseInt(hour);
    minute = minute ? parseInt(minute) : 0;

    if (ampm) {
      if (ampm.toLowerCase() === 'pm' && hour < 12) hour += 12;
      if (ampm.toLowerCase() === 'am' && hour === 12) hour = 0;
    }

    const parsed = new Date();
    parsed.setHours(hour, minute, 0, 0);
    return parsed;
  };

  const openingTime = parseTime(openingTimeStr);
  const closingTime = parseTime(closingTimeStr);

  if (!openingTime || !closingTime) return false;

  // Handle restaurants that close after midnight
  if (closingTime < openingTime) {
    if (now >= openingTime || now <= closingTime) {
      return true;
    }
  }

  return now >= openingTime && now <= closingTime;
};

  

  return (
    <Box
      w="full"
      h="full"
      position="absolute"
      px="3"
      justifyContent="center"
      
    >
  <View style={{ height: height / 3, alignItems: 'center' }}>
          <CustomMediaCarousel data={images} />
        </View>

           <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          style={{ flex: 1 }}
        >
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{bottom:20}}>
        
      <View>
          <FontAwesome name="product-hunt" style={{ top: 43, marginRight: 10 }} size={24} color="#f5a53d" />
          <Heading left={7} mt={4} numberOfLines={4} style={{ fontFamily: "regular", width: 290 }}>
            <Text numberOfLines={1} style={{ fontFamily: "regular", width: 10, fontSize: 18 }}>{item.name} </Text>
          </Heading>
        <View>
            <Text my={5} style={{ fontFamily: "regular", fontSize: 16 }}>
              {item.foodtypes}
            </Text>
          </View>
          <View style={{justifyContent:"space-between", flexDirection:"row", top:8 }}>
            <View style={{flexDirection:"row"}}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color="black" />
          
             
           <Text style={{fontWeight:"bold", fontSize:18, color:"#000000"}}> Gh₵{item.price}</Text>
             
           </View>
              
               <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16,  color: isOpenNow(item.openingTime, item.closingTime) ? '#f5a53d' : 'red' }}>
    {isOpenNow(item.openingTime, item.closingTime) ? 'Open Now' : 'Closed'}
  </Text> 
 
              
            </View>
           
          </View>
        </View>
        
    <View style={{  marginTop: 10, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
      
        
         <Text>Opening Time: {item.openingTime}</Text>
  <Text>Closing Time: {item.closingTime}</Text>
    
    </View>
  

                 

  
        <HStack my={5}  style={{ flexDirection: "column" }}>
          <View>
            <Text my={5} style={{ fontFamily: "regular", fontSize: 16 }}>
              {item.description}
            </Text>
          </View>

          <View style={{ backgroundColor: "white", padding: 5, borderRadius: 20 }}>
            <View style={myStyle.place}>
              <Entypo name="location" size={10} color="#f5a53d" style={{top:4}} />
              <Text style={{ fontFamily: "regular", left: 4, fontSize: 13, fontWeight:"bold"}}>Region: {item.region} </Text>
            </View>
            <View style={myStyle.place}>
              <Entypo name="location-pin" size={12} color="#f5a53d" style={{top:2}} />
              <Text style={{ fontFamily: "regular", fontSize: 13, fontWeight:"bold"}}>Town: {item.town} </Text>
            </View>
            <View style={myStyle.place}>
              <EvilIcons name="location" size={12} color="#f5a53d" style={{top:4}} />
              <Text style={{ fontFamily: "regular", fontSize: 13, fontWeight:"bold"}}>Location: {item.location} </Text>
            </View>
          </View>
        </HStack>




     <TouchableOpacity
      style={{
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
      }}
      onPress={openMap}
    >
      <Text style={{ color: 'white' }}>Open Location in Map</Text>
    </TouchableOpacity>


        <View style={{bottom:10}}>
          <MaterialIcons style={{ alignSelf: "center" }} name="report" size={24} color="red" />
          <Text style={{ fontFamily: "regular", fontSize: 12, alignSelf: "center" }}>Note! All calls are being monitored for security purposes</Text>
        </View>



<HStack justifyContent={"space-between"} mt={5} px={2} bottom={5}>
          <TouchableOpacity
            w="25%"
            // h={55}
            mt={2}
            // leftIcon={}
            onPress={openDial}
            // style={{ backgroundColor: "black" }}
          >
            <Feather name="phone-call" size={24} color="#00bb2d" />
            <Text color="white" style={{ fontSize: 11, fontFamily: "regular" }}>
              Call
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            w="50%"
            h={55}
            mt={2}
            // leftIcon={}
            onPress={openWhatsap}
            style={{ alignItems: "center"}}
          >
            <FontAwesome name="whatsapp" size={26} color="#00bb2d" />
            <Text color="white" style={{ fontSize: 11, fontFamily: "regular" }}>
              WhatsApp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
           
            onPress={handleLodgeComplaint}
            style={{ marginTop:2 }}
          >
           <FontAwesome style={{alignSelf:"center"}} name="flag" size={24} color="red" />
            <Text color="white" style={{ fontSize: 11, fontFamily: "regular" }}>
              Report
            </Text>
          </TouchableOpacity>
        </HStack>






        <Stack space={2} >
          <View style={{ flexDirection: "row" }}>
         
          <TextInput
          
            placeholder="How was the food? Leave a comment"
            width={width / 1.3}
            value={comment}
            onChangeText={(text) => setComment(text)}
            style={{marginHorizontal:10, borderWidth:1, padding:6, borderRadius:29}}
          />
         
          <TouchableOpacity onPress={handlePostComment} disabled={!comment.trim()}>
            <MaterialIcons style={{ left: 4, top: 2 }} name="send" size={28} color={comment.trim() ? "black" : "gray"} />
          </TouchableOpacity>
        </View>

        <View >
  {isCommentsLoading ? (
    <Center mt={4}>
      <ActivityIndicator size="large" color="#f5a53d" />
    </Center>
  ) : (
    <View>
      {Array.isArray(comments) && comments.length > 0 ? (
        <Box>
          {comments.slice(0, visibleComments).map((comment, index) => (
            <View key={comment._id || index}>
              <Box
                px="1"
                py="2"
                rounded="lg"
                my="2"
                mx="3"
                bg="gray.200"
                borderColor="coolGray.200"
                borderWidth="1"
              >
                {/* User Details and Comment Date */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <EvilIcons name="user" size={48} color="black" />
                  <Text
                    numberOfLines={1}
                    style={{
                      width: width / 2.1,
                      top: 6,
                    }}
                  >
                    {comment.user ? comment.user.name : "Unknown User"}
                  </Text>
                  <Text style={{ top: 6 }}>
                    {formatDate(comment.dateCreated)}
                  </Text>
                </View>

                {/* Comment Content or Edit Input */}
                {editingCommentId === comment._id ? (
                  <KeyboardAvoidingView behavior="position">
                    <TextInput
                      value={editingContent}
                      onChangeText={(text) => setEditingContent(text)}
                      style={{
                        backgroundColor: "gray.100",
                        borderColor: "gray.300",
                        borderWidth: 1,
                        marginTop: 8,
                        padding: 8,
                        borderRadius: 5,
                      }}
                      placeholder="Edit your comment"
                    />
                  </KeyboardAvoidingView>
                ) : (
                  <Text style={{ marginTop: 8 }}>{comment.content}</Text>
                )}

                {/* Action Buttons */}
                {comment.user && comment.user._id === myProducts && (
                  <HStack mt={2}>
                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      colorScheme="danger"
                      onPress={() => setDeleteCommentId(comment._id)} // Show confirmation modal
                      leftIcon={<MaterialIcons name="delete" size={16} color="red" />}
                    >
                      Delete
                    </Button>

                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      colorScheme="info"
                      onPress={() => handleEditComment(comment._id, comment.content)}
                      leftIcon={<MaterialIcons name="edit" size={16} color="black" />}
                    >
                      Edit
                    </Button>

                    {/* Save Button (shown only if editing the comment) */}
                    {editingCommentId === comment._id && (
                      <Button
                        variant="ghost"
                        colorScheme="success"
                        onPress={() => saveEditComment(comment._id)}
                        leftIcon={<MaterialIcons name="save" size={16} color="green" />}
                      >
                        Save
                      </Button>
                    )}
                  </HStack>
                )}




              </Box>
            </View>
          ))}



          {/* Load More Comments Button */}
          {visibleComments < comments.length && (
            <Button
              bg="black"
            
              onPress={() => setVisibleComments(visibleComments + 2)}
            >
              Load More Comments
            </Button>
          )}
        </Box>
      ) : (
        <Center>
          <Text>No comments yet. Be the first to comment!</Text>
        </Center>
      )}
    </View>
  )}
</View>



<View style={{marginBottom:32, bottom: 10}}>
  <Text style={{ alignSelf:"center", fontWeight:"bold"}}>Related Products</Text>
  {relatedProducts.length > 0 ? (
   <View >
      {relatedProducts.map((product) => (
     <Pressable
     onPress={() => handleProductPress(product)}
     w="100%"
     style={{
      backgroundColor: "white",
      justifyContent: "space-between",
      marginVertical: 4,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Required for Android shadows
    }}
  flexDirection="row"
    rounded="md"
    shadow={10}
    // my={1}
    pb={0.1}
    key={product._id}
    height={height/7.5}
   >
  <View style={{flex:0.4, height:height/8.5, top:4 }}>
 
         <Image
           source={{ uri: product.picture }}
           style={myStyle.image}
           // marginY={10}
           rounded="lg"
           left={2}
           alignSelf="center"
           alt="poor network"
           flex={1}
           resizeMode="stretch"
         />
    
     </View>

     <Box px={2} left={3} style={{flex:0.6, top:41}}>
       
  
       <Text
       numberOfLines={1}
       style={
       {  fontSize:12,  color: "black", marginBottom: 5,
        fontWeight:"bold",
        width:width/2.1, bottom:36, }
       }>
         {product.name}
        
       </Text>

       <Text
       numberOfLines={1}
       style={
       {  fontSize:13,  color: "black", marginBottom: 5,
      fontWeight:"300",
       width:width/2.1, bottom:36}
       }>{product.description}</Text>
      
      <View style={{flexDirection:"row", bottom:40, right:10}}>
      {/* <Fontisto name="money-symbol" size={20} color="black" /> */}
      <Text
       numberOfLines={1}
        style={{ 
         alignSelf:"center",width:width/4,
         fontSize:12, left:8,color:"#f5a53d",
         marginBottom: 5, fontWeight: "bold"}}>
          {product?.discount && product?.price ? (
// Calculate the discount
<>
<Text  numberOfLines={1} style={{ textDecorationLine: 'line-through', color: 'gray', marginRight: 5, fontSize:12 }}>
Gh₵{product.price}
{/* Gh123,000,000 sdgusgcusg */}
</Text>
</>
) : (
// If no discount, display the original price
<>
Gh₵{product.price}
</>)}
</Text>




       
       </View>

      <Text
       numberOfLines={1}
       style={
       {  fontSize:13,  color: "black", marginBottom: 5,
      fontWeight:"300",
       width:width/2.1, bottom:44}
       }>{product.foodtypes}</Text>

         <View style={{flexDirection:"row", left:6, bottom:52}}>
           <View>
       <Entypo name="location" size={8} style={{ top:8}} color="#f5a53d" />
       <Text  numberOfLines={1} style={{fontSize:10, fontWeight:"bold",  color: "black", marginBottom: 5,
     alignSelf:"center",  width:width/5.8, left:10, bottom:4 }}>
         {product.region}
       </Text> 
       </View>

       <View 
       style={{flexDirection:"row", left:12, }}
       >
       <Entypo name="location-pin" size={10} style={{ top:6}} color="#f5a53d" />
       <Text  numberOfLines={1} style={{fontSize:10,fontWeight:"bold",  color: "black",
     alignSelf:"center",  width:width/4.5,  bottom:2 }}>
         {product.town}
       </Text>
       </View>
       
       </View>

         {/* <View style={{flexDirection:"row", left:6, bottom:18}}>
       <Entypo name="location-pin" size={8} style={{ top:5}} color="#f5a53d" />
       <Text  numberOfLines={1} style={{fontSize:15,  color: "black", marginBottom: 5,
     alignSelf:"center",  width:width/2.5, left:10, }}>
         {product.town}
       </Text>
       </View> */}

       {/* {product?.discount && product?.price ? null : ( */}
{/* <> */}
<View style={{flexDirection:"row", left:6, bottom:60}}>
<View style={{flexDirection:"row"}}>
              <EvilIcons name="location" size={12} color="#f5a53d" style={{ top:2}}/>
            
            <Text  numberOfLines={1} style={{fontSize:10,  color: "black", 
          alignSelf:"center",  width:width/3, fontWeight:"bold" }}>
              {product.location}
              </Text>
            </View>


            <View>
            <Text
                   numberOfLines={1}
                   style={{
                     fontSize: 11, alignSelf: "flex-end",
                     color:"#f5a53d", fontWeight:"bold"
                   }}
                 >
                    {product?.condition && <Text > {product.condition}</Text>}
                 </Text>
                 </View>
            </View>
{/* </>)} */}

      

     </Box>


   
   </Pressable>
      ))}
   </View>
  ) : (
    <Text>No related products found.</Text>
  )}
</View>


   
        </Stack>
      </ScrollView>
</KeyboardAvoidingView>
      


      <RNModal
                animationType="slide"
                transparent={true}
                visible={deleteCommentId !== null}
                onRequestClose={() => setDeleteCommentId(null)}
              >
                <View style={myStyle.modalContainer}>
                  <View style={myStyle.modalContent}>
                    <Text>Are you sure you want to delete this comment?</Text>
                    <TouchableOpacity onPress={() => {
                  handleDeleteComment(deleteCommentId);
                  setDeleteCommentId(null);
                }} style={{backgroundColor:"red", borderRadius:6}}>
                      <Text style={{color:"white", paddingHorizontal:20, }}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{backgroundColor:"black", borderRadius:6, marginTop:16}} back onPress={() => setDeleteCommentId(null)}>
                      <Text style={{color:"white", paddingHorizontal:20,}}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </RNModal>



       <RNModal
                        animationType="slide"
                        transparent={true}
                        visible={isComplaintModalOpen}
                        onRequestClose={() => setIsComplaintModalOpen(false)}
                      >
                        <View style={myStyle.modalContainer}>
                          <View style={myStyle.modalContent}>
                            <Text style={{ fontWeight: 'bold' }}>
                              You are reporting{" "}
                              <Text style={{ color: "red", fontWeight: "bold" }}>{item.name}</Text>
                            </Text>
                            <TextInput
                              placeholder="Please select a complaint reason"
                              value={complaint}
                              onChangeText={setComplaint}
                              style={myStyle.modalInput}
                            />
                            <Text style={{ fontSize: 16, color: 'black', marginVertical: 10 }}>Complaint Options:</Text>
                            {/* Drop-down with TouchableOpacity */}
                            <View style={myStyle.dropdown}>
                              <TouchableOpacity onPress={() => setComplaint("Fraud")}>
                                <Text style={myStyle.dropdownText}>Fraud</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setComplaint("Scam")}>
                                <Text style={myStyle.dropdownText}>Scam</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setComplaint("Spam")}>
                                <Text style={myStyle.dropdownText}>Spam</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setComplaint("Phone not going throught")}>
                                <Text style={myStyle.dropdownText}>Phone is not going through</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setComplaint("Kept long")}>
                                <Text style={myStyle.dropdownText}>Kept long</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setComplaint("Infringes my right")}>
                                <Text style={myStyle.dropdownText}>Infringes my right</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setComplaint("Did not show up")}>
                                <Text style={myStyle.dropdownText}>Did not show up</Text>
                              </TouchableOpacity>
                            </View>
            
                            {complaintError && <Text style={myStyle.errorText}>{complaintError}</Text>}
            
                            <View style={{ flexDirection: "row", justifyContent:"space-between", marginTop: 10 }}>
                              <TouchableOpacity onPress={handleCompliants} style={{backgroundColor:"red", borderRadius:6,paddingHorizontal:4, marginRight:10, }}>
                                <Text style={{top:12, color:"white"}}>Report Product</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setIsComplaintModalOpen(false)} style={{backgroundColor:"black", borderRadius:6, marginLeft:10}}>
                                <Text style={myStyle.cancelButton}>Cancel</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </RNModal>


{/* Interest Modal */}
{/* <RNModal
  animationType="slide"
  transparent={true}
  visible={isInterestedModalOpen}
  onRequestClose={handleCloseModal}
>
  <View style={myStyle.modalContainer}>
    <View style={myStyle.modalContent}>
      <TouchableOpacity style={myStyle.closeButton} onPress={handleCloseModal}>
        <Text style={myStyle.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={myStyle.modalHeader}>Owner of {item.name} may contact you</Text>
      <Text style={myStyle.modalBodyText}>Are you interested in this product?</Text>
      <View style={myStyle.modalFooter}>
        <TouchableOpacity style={myStyle.button} onPress={handleCloseModal}>
          <Text style={myStyle.buttonText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[myStyle.button, myStyle.primaryButton]}
          onPress={() => {
            handleCloseModal();
            openDial();
          }}
        >
          <Text style={myStyle.primaryButtonText}>Yes Contact Me Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</RNModal> */}

    </Box>
  );
}

export default Detail;
const myStyle = StyleSheet.create({
  place: {
    margin: 4,
    flexDirection: "row"
  },
  butt:{
     backgroundColor:"black",alignItems:"center", borderRadius:10
  },
  text:{
    color:"white", fontFamily:"regular"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 10,
  },
  dropdown: {
    marginVertical: 10,
    width: '100%',
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    paddingVertical: 10,
    color: 'blue',
  },
  reportButton: {
    color: 'black',
    fontSize: 16,
    backgroundColor:"black",
    padding:4,
    borderRadius:6,
    marginRight:30
  },
  cancelButton: {
    color: 'white',
    fontSize: 16,
    backgroundColor:"black",
    padding:4,
    borderRadius:6
  },
  reportButton: {
    color: 'red',
    fontSize: 16,
    padding: 10,
  },
  cancelButton: {
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalBodyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
     right: 14,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    margin:1
  },
  buttonText: {
    fontSize: 16,
    color: '#555',
  },
  primaryButton: {
    backgroundColor: '#f5a53d',
    borderColor: '#f5a53d',
  },
  primaryButtonText: {
    fontSize: 16,
    color: 'white',
  },
  navButton: {
    position: 'absolute',
    top: '45%',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 25,
    padding: 5,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  image:{height:height/10.5, width:width, borderRadius:6}
});