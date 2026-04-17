import React, { use, useEffect, useState } from 'react';
import { Image, Box, Text, Spacer, Heading, Select, HStack, Button, Input, Stack, Center, Alert,   TextArea } from 'native-base';
import { Entypo, Ionicons , EvilIcons, MaterialIcons, FontAwesome6, FontAwesome} from "@expo/vector-icons";
import { ScrollView, View, Platform, Linking, StyleSheet, TouchableOpacity, ActivityIndicator, Modal as RNModal, Modal, FlatList, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import { Dimensions } from 'react-native';
import { TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const { width, height } = Dimensions.get('window');


const regions = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
  "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta",
  "Western", "Western North"
];

function OkadaCall({ route
 }) {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [newCommentPosted, setNewCommentPosted] = useState(false);
  const [visibleComments, setVisibleComments] = useState(2);
  const userId = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [complaintError, setComplaintError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showModal, setShowModal,] = useState(false);
  const [date, setDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);
const [showRegionDropdown, setShowRegionDropdown] = useState(false);
const [showDestDropdown, setShowDestDropdown] = useState(false);
const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [form, setForm] = useState({
    datepick: '',
    time: '',
    region: '',
    location: '',
    desregion: '',
    deslocation: '',
  });
  
 

  const item = route.params;

const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${userId}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone, verified:data.verified });

      const commentsResponse = await fetch(`${baseURL}okadacomment/comments/${item._id}`);
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
    fetchUserData();

  
  }, [newCommentPosted]);

  const openDial = async () => {
    // Check if user is verified
    if (!userData.verified) {
      // Navigate to the verification page if the user is not verified
      navigation.navigate("verificationpage");
      return;
    }
  
    // If user is verified, proceed to make the call
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
          pagename:"driver"
        })
      });
  
      if (response.ok) {
        // Open the dialer if the server call was successful
        Linking.openURL(`tel:${item.phone}`);
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
          recname: item.name
        })
      });

      if (response.ok) {
        Linking.openURL(`https://wa.me/${item.whatsapp}`);
      } else {
        console.error('Failed to send user data.');
      }
    } catch (error) {
      console.error('Error sending user data:', error);
    }
  };


  useEffect(() => {
    setImages([item.picture, item.picturesec]);
  }, [item.picture, item.picturesec]);

  
  const handlePostComment = async () => {
    try {
      const response = await fetch(`${baseURL}okadacomment/${item._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          content: comment
        })
      });

      if (response.ok) {
        console.log('Comment posted successfully.');
        setComment('');
        setNewCommentPosted(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to post comment:', errorData.message);
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



  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const saveEditComment = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}okadacomment/comments/${commentId}`, {
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
        setNewCommentPosted(true);
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
        alert("Driver reported successfully.");
        setIsComplaintModalOpen(false);
        setComplaint('');

        // Send PUT request to deactivate the item
        // const deactivateResponse = await fetch(`${baseURL}cars/${item._id}/deactivate`, {
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

      const deactivateResponse = await fetch(`${baseURL}cars/${item.author}/report`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!deactivateResponse.ok) {
        console.error("Failed to block user");
      }

      if (response.ok) {
        alert("Driver blocked successfully");
        setIsComplaintModalOpen(false);
        setComplaint('');

       
   
      } else {
        console.error("Failed to send block");
      }
    } catch (error) {
      console.error("Error sending block:", error);
    }
  };




  const confirmDeleteComment = async () => {
    try {
      const response = await fetch(`${baseURL}okadacomment/comments/${deleteCommentId}`, { method: 'DELETE' });

      if (response.ok) {
        console.log('Comment deleted successfully.');
        setNewCommentPosted(true);
        setIsDeleteModalOpen(false);
      } else {
        console.error('Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };



  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseURL}okadacomment/comments/${deleteCommentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Comment deleted successfully.");
        setIsDeleteModalOpen(false);
        setNewCommentPosted(true); // Refresh the comments
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  const handleChange = ({ name, value }) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };
  

  


  const handleSubmit = async () => {
    const appointmentData = {
      username: userData.name,
      userphone: userData.phone,
      drivername: driver.name,
      driverphone: driver.phone,
      time: form.time,
      region: form.region,
      location: form.location,
      desregion: form.desregion,
      deslocation: form.deslocation,
      datepick: form.datepick,
      userlocation: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
    };
  
    try {
      const res = await axios.post(`${baseURL}appointment`, appointmentData);
      console.log("Appointment saved:", res.data);
      setShowModal(false);
    } catch (err) {
      console.error("Error saving appointment:", err);
    }
  };

  

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDate(prev => new Date(
        prev.getFullYear(),
        prev.getMonth(),
        prev.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      ));
    }
  };
  


  const regions = [
    "Greater Accra", "Ashanti", "Eastern", "Western", "Central", "Volta",
    "Northern", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo",
    "Western North", "North East", "Savannah", "Oti"
  ];
  


  const handleBooking = async () => {
    if (!form.region || !form.location || !form.desregion || !form.deslocation) {
      alert("Please fill in all the fields.");
      return;
    }
  
    try {
      const payload = {
        username: userData.name,
        userphone: userData.phone,
        drivername: item.name,
        driverphone: item.phone,
        time: date.toLocaleTimeString(),
        datepick: date.toDateString(),
        region: form.region,
        location: form.location,
        desregion: form.desregion,
        deslocation: form.deslocation,
      };
  
      const response = await fetch(`${baseURL}appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Success:", data);
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };
  
  // console.log(userData.name)


return (
  <>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={{ flex: 1 }}
    >
  <ScrollView style={{backgroundColor:"white"}}>
  <View style={{backgroundColor:"black", flex:1}}>
    
      <View style={{top:8}} >
      <Center  >
    <Text style={{fontFamily:"robotty",color:"white", fontSize:16, left:5,
      
  }} >{item.name}</Text>
    
   {item.carpic ? (
  <Image 
    source={{ uri: item.carpic }} 
    style={{ height: 100, width: 100, borderRadius: 50, top: 30 }} 
    alt="" 
  />
) : (
  <EvilIcons 
    name="user" 
    size={100} 
    color="white" 
    style={{ top: 30 }} 
  />
)}

     <View style={{flexDirection:"col", bottom:80}} >
    <Text style={{ fontFamily:"robotty",color:"white", fontSize:16, left:5,
      top:120}} >Do you want to call </Text>
    <Text numberOfLines={3} style={{fontFamily:"robotty",color:"white", fontSize:16, left:5,
      top:120, color:"#07ed6b"
  }} >
      {item.name}?</Text>
    </View>
    </Center>


    <View style={{top:50, alignItems:"center"}}>
<MaterialIcons style={{alignSelf:"center"}} name="report" size={30} color="red" />
<Text style={{fontFamily:"robotty", fontSize:18, color:"white"}}>
  Note! All calls are being monitored for security purposes</Text>
</View>



    <View style={styles.callCont}>
      <View style={{bottom:100}}>
  <Text style={[styles.text,{left:7, fontFamily:"robotty"}]}>Yes</Text>
  <View style={styles.calls} >
  <TouchableOpacity onPress={()=>openDial()} >
  <Ionicons name="call" size={24} color="white" />
 </TouchableOpacity>
  </View>
      </View>



      <View style={{bottom:100}}>
  <Text style={[styles.text,{left:15, fontFamily:"robotty"}]}>No</Text>
  <View style={[styles.calls,{backgroundColor:"red"}]} >
      <TouchableOpacity onPress={()=>navigation.navigate("Back")} >
  <MaterialIcons name="call-end" size={24} color="white" />
  </TouchableOpacity>
      </View>

      
    
      </View>
      <View style={{bottom:100}}>
  <Text style={[styles.text,{left:15, fontFamily:"robotty"}]}>Book</Text>
  <View style={[styles.calls,{backgroundColor:"black"}]} >
      <TouchableOpacity style={{bottom:14}}   onPress={() => setShowModal(true)} >
      <FontAwesome6 name="first-order-alt"  size={46} color="white" />
  </TouchableOpacity>
      </View>
      </View>
      
    </View>

    </View>


<View style={{top:60, marginHorizontal:8 }}>
<View style={{flexDirection:"row", top:3}}>
        <Entypo name="location" size={14} style={{ top:2}} color="red" />
    <Text 
   style={{fontFamily:"robotty",color:"white", fontSize:16, left:5, }}
    
    >
        {item.region}
        </Text>
    </View>

          <View style={{flexDirection:"row", top:3}}>
          <Entypo name="location-pin" size={14} color="red" style={{top:3,}} />
          <Text numberOfLines={2} style={{fontFamily:"robotty",color:"white", fontSize:16, left:5}} >
              {item.town}
              </Text>
          </View>
          <View style={{flexDirection:"row", top:4}}>
          <EvilIcons name="location" size={14} color="red" style={{top:4,}} />
          <Text style={{fontFamily:"robotty",color:"white", fontSize:16, left:5}}>
              {item.location}
              </Text>
          </View>


          
          

          <Center marginHorizontal={8} style={{marginBottom:180}}>
          <Image source={{uri:item.driverpic}}
      rounded={"sm"}
     style={styles.image}
     resizeMode='stretch'
     alt='carpic'/>
          </Center>
        </View>
      
  </View>






  <TouchableOpacity style={{bottom:100, alignItems:"center" }} onPress={handleLodgeComplaint} top={1}  >
        <MaterialIcons  name="report-problem" size={24} color="red" />
                   <Text style={{color:"red"}}> Report Driver</Text>
                 </TouchableOpacity>



        <Stack space={2} style={{bottom:88}}>
                  <View style={{ flexDirection: "row" }}>
                  {/* <KeyboardAvoidingView behavior="position"> */}
                  <TextInput
                  
                    placeholder="How was the transaction. Leave a comment"
                    width={width / 1.3}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    style={{marginHorizontal:10, borderWidth:1, padding:8, borderRadius:29, borderColor:"black", backgroundColor:"white"}}
                  />
                  {/* </KeyboardAvoidingView> */}
                  <TouchableOpacity onPress={handlePostComment} disabled={!comment.trim()}>
                    <MaterialIcons style={{ left: 14, top: 2 }} name="send" size={28} color={comment.trim() ? "white" : "gray"} />
                  </TouchableOpacity>
                </View>
        
                <View style={{ marginBottom: 240 }}>
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
                        {comment.user && comment.user._id === userId && (
                          <HStack mt={2}>
                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              colorScheme="danger"
                              onPress={() => {
                                setDeleteCommentId(comment._id); // Set the comment ID to delete
                                setIsDeleteModalOpen(true); // Open the delete confirmation modal
                              }}
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
                      mb={10}
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
        
        
        
        
                 
                </Stack>


  </ScrollView>
</KeyboardAvoidingView>

 {/* Delete Comment Modal */}
 <RNModal
            animationType="slide"
            transparent={true}
            visible={isDeleteModalOpen}
            onRequestClose={() => setIsDeleteModalOpen(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>Are you sure you want to delete this comment?</Text>
                <TouchableOpacity onPress={confirmDeleteComment} style={{backgroundColor:"red", borderRadius:6}}>
                  <Text style={{color:"white", paddingHorizontal:20, }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={{backgroundColor:"black", borderRadius:6, marginTop:16}} back onPress={() => setIsDeleteModalOpen(false)}>
                  <Text style={{color:"white", paddingHorizontal:20,}}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </RNModal>

          {/* Complaint Modal */}
          <RNModal
            animationType="slide"
            transparent={true}
            visible={isComplaintModalOpen}
            onRequestClose={() => setIsComplaintModalOpen(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={{ fontWeight: 'bold' }}>
                  You are reporting{" "}
                  <Text style={{ color: "red", fontWeight: "bold" }}>{item.name}</Text>
                </Text>
                <TextInput
                  placeholder="Please select a complaint reason"
                  value={complaint}
                  onChangeText={setComplaint}
                  style={styles.modalInput}
                />
                <Text style={{ fontSize: 16, color: 'black', marginVertical: 10 }}>Complaint Options:</Text>
                {/* Drop-down with TouchableOpacity */}
                <View style={styles.dropdown}>
                  <TouchableOpacity onPress={() => setComplaint("Fraud")}>
                    <Text style={styles.dropdownText}>Fraud</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setComplaint("Scam")}>
                    <Text style={styles.dropdownText}>Scam</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setComplaint("Spam")}>
                    <Text style={styles.dropdownText}>Spam</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setComplaint("Phone not going throught")}>
                    <Text style={styles.dropdownText}>Phone is not going through</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setComplaint("Kept long")}>
                    <Text style={styles.dropdownText}>Kept long</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setComplaint("Infringes my right")}>
                    <Text style={styles.dropdownText}>Infringes my right</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setComplaint("Did not show up")}>
                    <Text style={styles.dropdownText}>Did not show up</Text>
                  </TouchableOpacity>
                </View>

                {complaintError && <Text style={styles.errorText}>{complaintError}</Text>}

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                  <TouchableOpacity onPress={handleCompliants}>
                    <Text style={styles.reportButton}>Report Driver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsComplaintModalOpen(false)}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </RNModal>

            {/* Delete Modal */}
            <RNModal
  animationType="slide"
  transparent={true}
  visible={isDeleteModalOpen}
  onRequestClose={() => setIsDeleteModalOpen(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Are you sure you want to delete this comment?
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        {/* Confirm Delete */}
        <TouchableOpacity
          onPress={async () => {
            await handleDelete(); // Trigger delete action
          }}
        >
          <Text style={styles.reportButton}>Delete</Text>
        </TouchableOpacity>
        {/* Cancel Action */}
        <TouchableOpacity onPress={() => setIsDeleteModalOpen(false)}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</RNModal>
        

{showModal && (
 <Modal
 transparent
 animationType="slide"
 visible={showModal}
 onRequestClose={() => setShowModal(false)}
>
 <View style={styles.modalOverlay}>
   <View style={styles.modalContent}>
     <Text style={styles.modalTitle}>Book Appointment</Text>

     {/* Date Picker */}
     <Text style={styles.label}>Pick Date</Text>
     <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
       <Text>{date.toDateString()}</Text>
     </TouchableOpacity>
     {/* {showDatePicker && (
       <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
     )} */}

     {/* Time Picker */}
     <Text style={styles.label}>Pick Time</Text>
     <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
       <Text>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
     </TouchableOpacity>
     {showTimePicker && (
       <DateTimePicker value={date} mode="time" display="default" onChange={onTimeChange} />
     )}

     {/* Pickup Region */}
     <Text style={styles.label}>Select your Pickup Region</Text>
     <TouchableOpacity
       style={styles.dropdownInput}
       onPress={() => setShowPickupDropdown(!showPickupDropdown)}
     >
       <Text>{form.region || "Select a region"}</Text>
       <FontAwesome name="chevron-down" size={16} />
     </TouchableOpacity>
     {showPickupDropdown && (
       <View style={styles.dropdownList}>
         <FlatList
           data={[
             "Greater Accra", "Ashanti", "Eastern", "Western", "Central", "Volta",
             "Northern", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo",
             "Western North", "North East", "Savannah", "Oti"
           ]}
           keyExtractor={(item) => item}
           renderItem={({ item }) => (
             <TouchableOpacity
               style={styles.dropdownItem}
               onPress={() => {
                 setForm({ ...form, region: item });
                 setShowPickupDropdown(false);
               }}
             >
               <Text style={{ color: "white" }}>{item}</Text>
             </TouchableOpacity>
           )}
         />
       </View>
     )}

     {/* Pickup Location */}
     <TextInput
       type="text"
       style={{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
      }}
       placeholder="Enter the pickup location"
       value={form.location}
       onChangeText={(text) => setForm({ ...form, location: text })}
     />

     {/* Destination Region */}
     <Text style={styles.label}>Select your Destination Region</Text>
     <TouchableOpacity
       style={styles.dropdownInput}
       onPress={() => setShowDestDropdown(!showDestDropdown)}
     >
       <Text>{form.desregion || "Select a region"}</Text>
       <FontAwesome name="chevron-down" size={16} />
     </TouchableOpacity>
     {showDestDropdown && (
       <View style={styles.dropdownList}>
         <FlatList
           data={[
             "Greater Accra", "Ashanti", "Eastern", "Western", "Central", "Volta",
             "Northern", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo",
             "Western North", "North East", "Savannah", "Oti"
           ]}
           keyExtractor={(item) => item}
           renderItem={({ item }) => (
             <TouchableOpacity
               style={styles.dropdownItem}
               onPress={() => {
                 setForm({ ...form, desregion: item });
                 setShowDestDropdown(false);
               }}
             >
               <Text style={{ color: "white" }}>{item}</Text>
             </TouchableOpacity>
           )}
         />
       </View>
     )}

     {/* Destination Location */}
     <TextInput
       type="text"
       style={{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
      }}
       placeholder="Enter the destination location"
       value={form.deslocation}
       onChangeText={(text) => setForm({ ...form, deslocation: text })}
     />

     {/* Submit & Cancel Buttons */}
     <View style={styles.modalButtons}>
       <TouchableOpacity style={styles.submitBtn} onPress={handleBooking}>
         <Text style={styles.submitText}>Submit</Text>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => setShowModal(false)}>
         <Text style={styles.cancelButton}>Cancel</Text>
       </TouchableOpacity>
     </View>
   </View>
 </View>
</Modal>

)}





  

  </>
)
}

export default OkadaCall;
const styles = StyleSheet.create({
  calls:{
      backgroundColor:"#07ed6b", padding:15, borderRadius:30
  },
  callCont:{
      flexDirection:"row", justifyContent:"space-between", marginHorizontal:60,
      top:160
  },
  text:{
      fontSize:16,
      fontWeight:"bold",
      color:"white"
  },
  image:{height:height/3, width:width, borderRadius:6, marginLeft:8, top:10},
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
    color: 'red',
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
    padding:2,
    borderRadius:6
  },
  reportButton: {
    color: 'red',
    fontSize: 16,
    padding: 10,
  },
  cancelButton: {
    color: 'gray',
    fontSize: 16,
    padding: 10,
  },

  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
  borderRadius: 8,
  paddingHorizontal: 10,
  height: 50,
  justifyContent: 'center',
  marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  submitText: {
    color: '#fff',
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelText: {
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 50,
    marginBottom: 10,
  },
  
  dropdownList: {
    backgroundColor: 'black',
    borderRadius: 8,
    elevation: 3,
    maxHeight: 200,
    marginBottom: 10,
  },
  
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  
})