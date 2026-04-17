import React, { useEffect, useState } from 'react';
import { 
  Entypo, Ionicons, MaterialIcons, FontAwesome6, FontAwesome, MaterialCommunityIcons 
} from "@expo/vector-icons";
import { 
  ScrollView, View, Platform, Linking, StyleSheet, TouchableOpacity, 
  ActivityIndicator, Modal as RNModal, KeyboardAvoidingView, 
  Dimensions, TextInput, Text, Image, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const regions = [
  "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
  "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta",
  "Western", "Western North"
];

function PhoneCall({ route }) {
  const item = route.params;
  const myProducts = useSelector((state) => state.user);
  const navigation = useNavigation();

  // State
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', verified: false });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);
  const [showModal, setShowModal] = useState(false);
  
  // Edit State
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [form, setForm] = useState({ region: '', location: '', desregion: '', deslocation: '' });

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${myProducts}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone, verified: data.verified });

      const commentsResponse = await fetch(`${baseURL}drivercomment/comments/${item._id}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [refreshTrigger]);

  const handlePostComment = async () => {
    try {
      const response = await fetch(`${baseURL}drivercomment/${item._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myProducts, content: comment })
      });
      if (response.ok) { 
        setComment(''); 
        setRefreshTrigger(!refreshTrigger); 
      }
    } catch (error) { console.error('Comment error:', error); }
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert("Delete Review", "Are you sure you want to remove this feedback?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            const response = await fetch(`${baseURL}drivercomment/comments/${commentId}`, {
              method: 'DELETE',
            });
            if (response.ok) setRefreshTrigger(!refreshTrigger);
          } catch (error) { console.error('Delete error:', error); }
        } 
      }
    ]);
  };

  const handleUpdateComment = async () => {
    try {
      const response = await fetch(`${baseURL}drivercomment/comments/${editingComment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
      if (response.ok) {
        setShowEditModal(false);
        setRefreshTrigger(!refreshTrigger);
      }
    } catch (error) { console.error('Update error:', error); }
  };

  // ... (Keep existing openDial and handleBooking functions)
  const openDial = async () => {
    if (!userData.verified) { navigation.navigate("verificationpage"); return; }
    try {
      await fetch(`${baseURL}call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.name, email: userData.email, phone: userData.phone, receiverphone: item.phone, recname: item.name, pagename: "driver" })
      });
      Linking.openURL(`tel:${item.phone}`);
    } catch (error) { console.error('Call log error:', error); }
  };

  const handleBooking = async () => {
    if (!form.region || !form.location || !form.desregion || !form.deslocation) { Alert.alert("Incomplete Form", "Please provide all details."); return; }
    try {
      const response = await fetch(`${baseURL}appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userData.name, userphone: userData.phone, drivername: item.name, driverphone: item.phone, time: date.toLocaleTimeString(), datepick: date.toDateString(), ...form }),
      });
      if (response.ok) { Alert.alert("Success", "Booking request sent."); setShowModal(false); }
    } catch (err) { Alert.alert("Error", "Server connection failed."); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: "#F4F6F8" }} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.profileCircle}>
            <Image source={{ uri: item.carpic }} style={styles.profileImage} />
          </View>
          <Text style={styles.driverNameText}>{item.name}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{item.carnum}</Text></View>
            <View style={[styles.badge, styles.sizeBadge]}>
                <MaterialCommunityIcons name="car-info" size={14} color="#007BFF" />
                <Text style={[styles.badgeText, { color: "#007BFF", marginLeft: 4 }]}>{item.size || "Standard"}</Text>
            </View>
          </View>
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={openDial} style={styles.actionBtn}>
              <View style={[styles.iconBg, {backgroundColor: '#28A745'}]}><Ionicons name="call" size={22} color="white" /></View>
              <Text style={styles.actionLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(true)} style={styles.actionBtn}>
              <View style={[styles.iconBg, {backgroundColor: '#FFC107'}]}><FontAwesome6 name="calendar-check" size={20} color="white" /></View>
              <Text style={styles.actionLabel}>Book</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.actionBtn}>
              <View style={[styles.iconBg, {backgroundColor: '#6C757D'}]}><MaterialIcons name="arrow-back" size={22} color="white" /></View>
              <Text style={styles.actionLabel}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Operating Route Card */}
        <View style={styles.contentCard}>
          <View style={styles.sectionHeader}>
            <Entypo name="location-pin" size={18} color="#007BFF" />
            <Text style={styles.sectionTitle}>Operating Route</Text>
          </View>
          <Text style={styles.locationDetail}>{item.region} — {item.town}</Text>
          <Image source={{ uri: item.driverpic }} style={styles.driverCardImage} resizeMode="cover" />
        </View>

        {/* Client Feedback Section */}
        <View style={styles.commentContainer}>
          <Text style={styles.sectionTitle}>Client Feedback</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="Share your experience..." 
              value={comment}
              onChangeText={setComment}
              style={styles.textInput}
            />
            <TouchableOpacity onPress={handlePostComment} disabled={!comment.trim()}>
              <MaterialIcons name="send" size={24} color={comment.trim() ? "#007BFF" : "#BDC3C7"} />
            </TouchableOpacity>
          </View>

          {isCommentsLoading ? (
            <ActivityIndicator color="#007BFF" style={{marginTop: 20}} />
          ) : (
            comments.slice(0, visibleComments).map((c) => (
              <View key={c._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.reviewerName}>{c.user?.name || "Guest User"}</Text>
                    <Ionicons name="checkmark-circle" size={14} color="#28A745" />
                  </View>
                  
                  {/* Action buttons only visible to the owner */}
                  {c.user?._id === myProducts && (
                    <View style={styles.commentActions}>
                        <TouchableOpacity onPress={() => {
                            setEditingComment(c._id);
                            setEditContent(c.content);
                            setShowEditModal(true);
                        }}>
                            <MaterialIcons name="edit" size={18} color="#007BFF" style={{marginRight: 10}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteComment(c._id)}>
                            <MaterialIcons name="delete-outline" size={18} color="#DC3545" />
                        </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={styles.reviewBody}>{c.content}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Edit Comment Modal */}
      <RNModal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.editModalContent}>
            <Text style={styles.modalHeaderText}>Update Feedback</Text>
            <TextInput 
              style={styles.editInput}
              multiline
              value={editContent}
              onChangeText={setEditContent}
            />
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15}}>
                <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.cancelBtn}>
                    <Text style={{color: '#666'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdateComment} style={styles.saveBtn}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Save Changes</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Booking Modal (Keep Original) */}
      <RNModal visible={showModal} transparent animationType="slide">
        {/* ... (Existing Booking Modal Content) ... */}
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Confirm Booking</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Schedule</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}><Text style={styles.dateText}>{date.toDateString()}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePickerBtn}><Text style={styles.dateText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></TouchableOpacity>
              </View>
              {showDatePicker && <DateTimePicker value={date} mode="date" onChange={(e, d) => {setShowDatePicker(false); if(d) setDate(d);}} />}
              {showTimePicker && <DateTimePicker value={date} mode="time" onChange={(e, d) => {setShowTimePicker(false); if(d) setDate(d);}} />}
              <Text style={styles.inputLabel}>Pickup Details</Text>
              <TouchableOpacity style={styles.selector} onPress={() => {setShowPickupDropdown(!showPickupDropdown); setShowDestDropdown(false);}}>
                <Text style={form.region ? styles.selectedText : styles.placeholderText}>{form.region || "Select Region"}</Text>
                <FontAwesome name="angle-down" size={16} color="#999" />
              </TouchableOpacity>
              {showPickupDropdown && (
                <View style={styles.scrollSelector}>
                  <ScrollView nestedScrollEnabled style={{maxHeight: 150}}>
                    {regions.map((r) => (
                      <TouchableOpacity key={r} style={styles.selectorItem} onPress={() => { setForm({...form, region: r}); setShowPickupDropdown(false); }}>
                        <Text style={styles.itemText}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              <TextInput placeholder="Specific Pickup Location" style={styles.styledInput} onChangeText={(t) => setForm({...form, location: t})} />
              <Text style={styles.inputLabel}>Destination Details</Text>
              <TouchableOpacity style={styles.selector} onPress={() => {setShowDestDropdown(!showDestDropdown); setShowPickupDropdown(false);}}>
                <Text style={form.desregion ? styles.selectedText : styles.placeholderText}>{form.desregion || "Select Destination Region"}</Text>
                <FontAwesome name="angle-down" size={16} color="#999" />
              </TouchableOpacity>
              {showDestDropdown && (
                <View style={styles.scrollSelector}>
                  <ScrollView nestedScrollEnabled style={{maxHeight: 150}}>
                    {regions.map((r) => (
                      <TouchableOpacity key={r} style={styles.selectorItem} onPress={() => { setForm({...form, desregion: r}); setShowDestDropdown(false); }}>
                        <Text style={styles.itemText}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              <TextInput placeholder="Specific Destination Location" style={styles.styledInput} onChangeText={(t) => setForm({...form, deslocation: t})} />
              <TouchableOpacity style={styles.mainSubmitBtn} onPress={handleBooking}><Text style={styles.submitBtnText}>Submit Request</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </RNModal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ... (Keep existing styles and add these below)
  headerContainer: { backgroundColor: "#121212", paddingBottom: 40, paddingTop: 50, alignItems: "center", borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  profileCircle: { width: 125, height: 125, borderRadius: 65, padding: 3, backgroundColor: '#FFC107', marginBottom: 15 },
  profileImage: { width: '100%', height: '100%', borderRadius: 65, borderWidth: 2, borderColor: '#121212' },
  driverNameText: { color: "white", fontSize: 22, fontWeight: "bold" },
  badgeRow: { flexDirection: 'row', marginTop: 10 },
  badge: { backgroundColor: "rgba(255, 193, 7, 0.2)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginHorizontal: 5, borderWidth: 1, borderColor: '#FFC107' },
  sizeBadge: { backgroundColor: "rgba(0, 123, 255, 0.1)", borderColor: '#007BFF', flexDirection: 'row', alignItems: 'center' },
  badgeText: { color: "#FFC107", fontSize: 11, fontWeight: "800", textTransform: 'uppercase' },
  quickActions: { flexDirection: "row", justifyContent: "space-between", width: '80%', marginTop: 30 },
  actionBtn: { alignItems: "center" },
  iconBg: { width: 50, height: 50, borderRadius: 18, justifyContent: "center", alignItems: "center", elevation: 5 },
  actionLabel: { color: "#AAA", fontSize: 12, marginTop: 8, fontWeight: '600' },
  contentCard: { margin: 20, padding: 20, backgroundColor: "white", borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginLeft: 6 },
  locationDetail: { color: "#777", fontSize: 14, marginBottom: 15, paddingLeft: 24 },
  driverCardImage: { width: '100%', height: 210, borderRadius: 15 },
  commentContainer: { paddingHorizontal: 20, paddingBottom: 90 },
  inputWrapper: { flexDirection: "row", backgroundColor: "white", borderRadius: 15, padding: 12, alignItems: 'center', marginBottom: 25, elevation: 3 },
  textInput: { flex: 1, paddingHorizontal: 10, fontSize: 14 },
  reviewCard: { backgroundColor: "white", padding: 15, borderRadius: 15, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#007BFF', elevation: 2 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  reviewerName: { fontWeight: "bold", color: '#444', fontSize: 13, marginRight: 5 },
  reviewBody: { color: '#666', fontSize: 13 },
  commentActions: { flexDirection: 'row', alignItems: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  editModalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20 },
  editInput: { backgroundColor: '#F0F2F5', borderRadius: 10, padding: 15, marginTop: 10, height: 100, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#007BFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, marginRight: 10 },
  modalHeaderText: { fontSize: 18, fontWeight: "bold" },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: height * 0.8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  inputLabel: { marginTop: 15, fontWeight: "bold", fontSize: 12, color: '#666' },
  dateTimeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  datePickerBtn: { flex: 0.48, backgroundColor: '#F0F2F5', padding: 12, borderRadius: 10, alignItems: 'center' },
  dateText: { fontSize: 13, color: '#333', fontWeight: '600' },
  selector: { flexDirection: "row", justifyContent: "space-between", padding: 14, backgroundColor: '#F0F2F5', borderRadius: 10, marginTop: 8, alignItems: 'center' },
  selectedText: { color: '#333', fontWeight: '600' },
  placeholderText: { color: '#999' },
  scrollSelector: { backgroundColor: "#333", borderRadius: 10, marginTop: 5 },
  selectorItem: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#444' },
  itemText: { color: 'white' },
  styledInput: { backgroundColor: '#F0F2F5', borderRadius: 10, padding: 14, marginTop: 10 },
  mainSubmitBtn: { backgroundColor: '#121212', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default PhoneCall;