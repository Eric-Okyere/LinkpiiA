import React, { useCallback, useEffect, useState } from 'react';
import { 
  Image, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  View, 
  Platform, 
  Linking, 
  StyleSheet, 
  ActivityIndicator, 
  Modal, 
  KeyboardAvoidingView, 
  Dimensions, 
  TextInput, 
  StatusBar, 
  Alert,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Entypo, 
  Ionicons, 
  MaterialIcons, 
  FontAwesome6, 
  FontAwesome, 
  MaterialCommunityIcons 
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get('window');

const MechanicDetailScreen = ({ route }) => {
  const item = route.params;
  const userId = useSelector((state) => state.user);
  const navigation = useNavigation();

  // Core Data States
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', verified: false });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [newCommentPosted, setNewCommentPosted] = useState(false);

  // Modal & Form States
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Edit Comment States
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  
  // Booking Logic States
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [bookingForm, setBookingForm] = useState({ region: '', location: '' });

  const regions = ["Greater Accra", "Ashanti", "Eastern", "Western", "Central", "Volta", "Northern", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo", "Western North", "North East", "Savannah", "Oti"];

  useEffect(() => {
    fetchUserData();
  }, [newCommentPosted]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${userId}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone, verified: data.verified });

      const commentsResponse = await fetch(`${baseURL}mechanicscomment/comments/${item._id}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsCommentsLoading(false);
      setNewCommentPosted(false);
    }
  };

  // --- HANDLERS ---

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingForm.region || !bookingForm.location) {
      Alert.alert("Error", "Please provide your region and location.");
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
        region: bookingForm.region,
        location: bookingForm.location,
      };
      const response = await fetch(`${baseURL}appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        Alert.alert("Success", "Booking request sent.");
        setShowBookingModal(false);
      }
    } catch (err) { Alert.alert("Error", "Failed to submit booking."); }
  };

  const handleReport = async () => {
    if (!complaint) return Alert.alert("Selection Required", "Please select a reason for reporting.");
    try {
      const response = await fetch(`${baseURL}compliants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sendername: userData.name,
          senderphone: userData.phone,
          product: item.name,
          productphone: item.phone,
          complaint: complaint,
        }),
      });
      if (response.ok) {
        Alert.alert("Reported", "Your complaint has been submitted for review.");
        setIsComplaintModalOpen(false);
        setComplaint('');
      }
    } catch (e) { console.error(e); }
  };

  const handleEditComment = async (commentId) => {
    if (!editingContent.trim()) return;
    try {
      const response = await fetch(`${baseURL}mechanicscomment/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      });
      if (response.ok) {
        setNewCommentPosted(true);
        setEditingCommentId(null);
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`${baseURL}mechanicscomment/comments/${commentToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setNewCommentPosted(true);
        setIsDeleteModalOpen(false);
      }
    } catch (e) { console.error(e); }
  };

  const handlePostComment = async () => {
    try {
      const res = await fetch(`${baseURL}mechanicscomment/${item._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: comment })
      });
      if (res.ok) { setComment(''); setNewCommentPosted(true); }
    } catch (e) { console.error(e); }
  };

  const openDial = async () => {
    if (!userData.verified) return navigation.navigate("verificationpage");
     Linking.openURL(`tel:${item.phone}`);
  };

      useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <View style={styles.mainContainer}>
     
      <KeyboardAvoidingView >
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.blackHeader}>
          

            <View style={styles.profileSection}>
              <View style={styles.imageRing}>
                {item.picturesec ? (
                  <Image source={{ uri: item.picturesec }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}><FontAwesome name="user" size={50} color="#666" /></View>
                )}
                {userData.verified && <View style={styles.verifiedBadge}><MaterialIcons name="verified" size={18} color="#00E676" /></View>}
              </View>
              <Text style={styles.mechNameLarge}>{item.name}</Text>
              <Text style={styles.subTextLight}>{item.nickname}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.callButton} onPress={openDial}>
                <Ionicons name="call" size={20} color="#000" />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bookButton} onPress={() => setShowBookingModal(true)}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#FFC107" />
                <Text style={styles.bookBtnText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.serviceTag}>
              <FontAwesome6 name="screwdriver-wrench" size={14} color="#FFC107" />
              <Text style={styles.serviceText}>{item.services || "General Maintenance"}</Text>
            </View>

            <View style={styles.locationContainer}>
              <View style={styles.locItem}>
                <Entypo name="location" size={18} color="#FF4444" />
                <View style={styles.locTextGroup}>
                  <Text style={styles.locLabel}>Location</Text>
                  <Text style={styles.locMain}>{item.region}, {item.town}, {item.location}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackHeader}>
              <Text style={styles.sectionTitle}>Client Feedback</Text>
              <TouchableOpacity onPress={() => setIsComplaintModalOpen(true)}>
                <Text style={styles.reportText}>Report Professional</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentInputRow}>
              <TextInput placeholder="Leave a comment..." style={styles.commentInput} value={comment} onChangeText={setComment} placeholderTextColor="#999" />
              <TouchableOpacity onPress={handlePostComment} disabled={!comment.trim()} style={[styles.sendBtn, !comment.trim() && { opacity: 0.5 }]}>
                <MaterialIcons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {isCommentsLoading ? <ActivityIndicator color="#FFC107" /> : (
              comments.map((c, i) => (
                <View key={i} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{c.user?.name || "Anonymous"}</Text>
                    {c.user?._id === userId && (
                      <View style={{ flexDirection: 'row' }}>
                        {editingCommentId === c._id ? (
                          <>
                            <TouchableOpacity onPress={() => handleEditComment(c._id)} style={{ marginRight: 15 }}>
                              <MaterialIcons name="save" size={20} color="#00E676" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEditingCommentId(null)}>
                              <MaterialIcons name="cancel" size={20} color="#666" />
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            <TouchableOpacity onPress={() => { setEditingCommentId(c._id); setEditingContent(c.content); }} style={{ marginRight: 15 }}>
                              <MaterialIcons name="edit" size={18} color="#FFC107" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setCommentToDelete(c._id); setIsDeleteModalOpen(true); }}>
                              <MaterialIcons name="delete-outline" size={18} color="#FF4444" />
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                  {editingCommentId === c._id ? (
                    <TextInput style={styles.editInput} value={editingContent} onChangeText={setEditingContent} multiline />
                  ) : (
                    <Text style={styles.commentContent}>{c.content}</Text>
                  )}
                </View>
              ))
            )}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- MODALS --- */}

      {/* Booking */}
      <Modal visible={showBookingModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Appointment</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputField}>
              <Text style={{ color: '#FFF' }}>{date.toLocaleString()}</Text>
              <Ionicons name="calendar" size={18} color="#FFC107" />
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={date} mode="datetime" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />}
            <TouchableOpacity style={styles.inputField} onPress={() => setShowPickupDropdown(!showPickupDropdown)}>
              <Text style={{ color: '#FFF' }}>{bookingForm.region || "Select Region"}</Text>
              <FontAwesome name="chevron-down" size={14} color="#FFC107" />
            </TouchableOpacity>
            {showPickupDropdown && (
              <ScrollView style={styles.dropdownBox} nestedScrollEnabled>
                {regions.map((r, i) => (
                  <TouchableOpacity key={i} style={styles.dropItem} onPress={() => { setBookingForm({...bookingForm, region: r}); setShowPickupDropdown(false); }}><Text style={{ color: '#FFF' }}>{r}</Text></TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TextInput style={styles.inputField} placeholder="Location (Neighborhood)" placeholderTextColor="#666" value={bookingForm.location} onChangeText={(text) => setBookingForm({...bookingForm, location: text})} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleBooking}><Text style={styles.submitBtnText}>Confirm Appointment</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete */}
      <Modal visible={isDeleteModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '80%' }]}>
            <Text style={styles.modalTitle}>Delete Comment?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={styles.smallBtn} onPress={() => setIsDeleteModalOpen(false)}><Text style={{ color: '#FFF' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#FF4444' }]} onPress={handleDeleteComment}><Text style={{ color: '#FFF' }}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Report */}
      <Modal visible={isComplaintModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Service</Text>
            {["Fraud", "Unprofessional", "Poor Service"].map((reason, i) => (
              <TouchableOpacity key={i} style={styles.radioOption} onPress={() => setComplaint(reason)}>
                <Ionicons name={complaint === reason ? "radio-button-on" : "radio-button-off"} size={20} color="#FFC107" />
                <Text style={{ color: '#FFF', marginLeft: 10 }}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#FF4444' }]} onPress={handleReport}>
              <Text style={styles.submitBtnText}>Submit Report</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsComplaintModalOpen(false)}><Text style={styles.cancelText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, top:30},
  blackHeader: { backgroundColor: '#000', paddingBottom: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, paddingHorizontal: 20, paddingTop:10 },
  profileSection: { alignItems: 'center' },
  imageRing: { padding: 4, borderRadius: 60, borderWidth: 2, borderColor: '#FFC107' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  verifiedBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#000', borderRadius: 10 },
  mechNameLarge: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 15 },
  subTextLight: { color: '#AAA', fontSize: 13, fontWeight: '500' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  callButton: { flex: 0.48, backgroundColor: '#FFC107', height: 50, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  callBtnText: { color: '#000', fontWeight: '800', marginLeft: 8 },
  bookButton: { flex: 0.48, backgroundColor: '#1A1A1A', height: 50, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  bookBtnText: { color: '#FFC107', fontWeight: '800', marginLeft: 8 },
  infoCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -20, borderRadius: 20, padding: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 15 },
  serviceTag: { backgroundColor: '#FFF9E6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
  serviceText: { color: '#FFC107', fontWeight: '700', marginLeft: 8, fontSize: 13 },
  locationContainer: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20 },
  locItem: { flexDirection: 'row', alignItems: 'center' },
  locTextGroup: { marginLeft: 15 },
  locLabel: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase' },
  locMain: { fontSize: 14, color: '#333', fontWeight: '700', marginTop: 2 },
  feedbackContainer: { padding: 20 },
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportText: { color: '#FF4444', fontSize: 12, fontWeight: '700' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  commentInput: { flex: 1, backgroundColor: '#FFF', height: 45, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEE' },
  sendBtn: { width: 45, height: 45, backgroundColor: '#000', borderRadius: 12, marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  commentCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentUser: { fontWeight: '800', fontSize: 13, color: '#333' },
  commentContent: { color: '#666', fontSize: 13 },
  editInput: { backgroundColor: '#F0F0F0', borderRadius: 10, padding: 10, marginTop: 10, color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1A1A1A', width: '90%', borderRadius: 25, padding: 20 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  inputField: { backgroundColor: '#252525', borderRadius: 12, padding: 12, color: '#FFF', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  submitBtn: { backgroundColor: '#FFC107', padding: 16, borderRadius: 15, marginTop: 10, alignItems: 'center' },
  submitBtnText: { color: '#000', fontWeight: '800' },
  cancelText: { color: '#666', textAlign: 'center', marginTop: 15 },
  dropdownBox: { backgroundColor: '#252525', borderRadius: 12, maxHeight: 150, marginBottom: 15, padding: 10 },
  dropItem: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  radioOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  smallBtn: { flex: 0.45, backgroundColor: '#333', padding: 12, borderRadius: 10, alignItems: 'center' }
});

export default MechanicDetailScreen;