import React, { useEffect, useState } from 'react';
import { 
  View, 
  Alert, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions, 
  ScrollView, 
  StyleSheet,
  Image, // Imported from react-native
  Text,  // Imported from react-native
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";

import { loggedOut } from '../Redux/actions';
import baseURL from '../../assets/common/BaseUrl';
import Error from "../../src/User/Error";

const { width } = Dimensions.get('window');

const Profile = () => {
  const userId = useSelector((state) => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [isIDModalVisible, setIsIDModalVisible] = useState(false);
  
  const [oldpassword, setoldPassword] = useState('');
  const [newpassword, setnewPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [passVisible, setPassVisible] = useState({ current: false, new: false, confirm: false });

  const [avatar, setAvatar] = useState(null);
  const [picture, setPicture] = useState(null);
  const [ghback, setGhback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${userId}`);
      const data = await response.json();
      setFetchedUserData(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newpassword !== confirmpassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    try {
      const response = await fetch(`${baseURL}changepass`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: fetchedUserData._id,
          currentPassword: oldpassword,
          newPassword: newpassword,
        }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Password updated!');
        setIsPassModalVisible(false);
        setoldPassword(''); setnewPassword(''); setconfirmPassword('');
      } else {
        const result = await response.json();
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (err) {
      Alert.alert('Error', 'Server error occurred.');
    }
  };

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled) setter(result.assets[0].uri);
  };

  const submitImages = async () => {
    if (!avatar || !picture || !ghback) {
      Alert.alert("Missing Files", "Please select all 3 required images.");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("avatar", { uri: avatar, name: "avatar.jpg", type: "image/jpeg" });
    formData.append("picture", { uri: picture, name: "front.jpg", type: "image/jpeg" });
    formData.append("ghback", { uri: ghback, name: "back.jpg", type: "image/jpeg" });

    try {
      const response = await fetch(`${baseURL}card/${userId}/picture`, {
        method: "PUT",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      if (response.ok) {
        Alert.alert("Success", "Documents submitted for verification.");
        setIsIDModalVisible(false);
        fetchUserData();
      } else {
        Alert.alert("Error", "Upload failed.");
      }
    } catch (err) {
      Alert.alert("Error", "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#f5a53d" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {fetchedUserData?.avatar ? (
              <Image source={{ uri: fetchedUserData.avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <FontAwesome name="user" size={50} color="#ddd" />
              </View>
            )}
            <View style={styles.onlineBadge} />
          </View>
          
          <Text style={styles.userName}>{fetchedUserData?.name} {fetchedUserData?.lastname}</Text>
          <Text style={styles.userEmail}>{fetchedUserData?.email}</Text>
          
          <View style={styles.tag}>
            <Text style={styles.tagText}>Active Account</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Contact Details</Text>
          <View style={styles.infoRow}>
            <Feather name="phone" size={18} color="#f5a53d" />
            <Text style={styles.infoValue}>{fetchedUserData?.phone}</Text>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Security & Verification</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={() => setIsPassModalVisible(true)}>
            <View style={[styles.actionIcon, { backgroundColor: '#eef2ff' }]}>
              <MaterialCommunityIcons name="lock-reset" size={22} color="#4f46e5" />
            </View>
            <Text style={styles.actionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => setIsIDModalVisible(true)}>
            <View style={[styles.actionIcon, { backgroundColor: '#fff7ed' }]}>
              <MaterialCommunityIcons name="card-account-details-outline" size={22} color="#f5a53d" />
            </View>
            <Text style={styles.actionText}>Identity Verification</Text>
            {fetchedUserData?.picture ? (
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            ) : (
                <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => { dispatch(loggedOut()); navigation.navigate('show'); }}
        >
          <Text style={styles.logoutText}>Logout Account</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- PASSWORD MODAL --- */}
      <Modal visible={isPassModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Password</Text>
              <TouchableOpacity onPress={() => setIsPassModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputWrap}>
              <TextInput
                placeholder="Current Password"
                style={styles.modalInput}
                secureTextEntry={!passVisible.current}
                value={oldpassword}
                onChangeText={setoldPassword}
              />
              <TouchableOpacity onPress={() => setPassVisible({...passVisible, current: !passVisible.current})}>
                <Ionicons name={passVisible.current ? "eye-off" : "eye"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputWrap}>
              <TextInput
                placeholder="New Password"
                style={styles.modalInput}
                secureTextEntry={!passVisible.new}
                value={newpassword}
                onChangeText={setnewPassword}
              />
              <TouchableOpacity onPress={() => setPassVisible({...passVisible, new: !passVisible.new})}>
                <Ionicons name={passVisible.new ? "eye-off" : "eye"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputWrap}>
              <TextInput
                placeholder="Confirm New Password"
                style={styles.modalInput}
                secureTextEntry={!passVisible.confirm}
                value={confirmpassword}
                onChangeText={setconfirmPassword}
              />
              <TouchableOpacity onPress={() => setPassVisible({...passVisible, confirm: !passVisible.confirm})}>
                <Ionicons name={passVisible.confirm ? "eye-off" : "eye"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleChangePassword}>
              <Text style={styles.primaryBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- ID UPLOAD MODAL --- */}
      <Modal visible={isIDModalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.fullModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Identity</Text>
              <TouchableOpacity onPress={() => setIsIDModalVisible(false)}>
                <Ionicons name="close" size={28} color="#111" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSub}>Upload clear photos of yourself and your Ghana Card (Front & Back).</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setAvatar)}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.uploadPreview} />
                ) : (
                  <View style={styles.uploadPlaceholderContent}>
                    <Ionicons name="person" size={30} color="#ccc" />
                    <Text style={styles.uploadLabel}>Your Profile Picture</Text>
                  </View>
                )}
                <View style={styles.uploadPlus}><Ionicons name="add" size={16} color="white" /></View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setPicture)}>
                {picture ? (
                  <Image source={{ uri: picture }} style={styles.uploadPreview} />
                ) : (
                  <View style={styles.uploadPlaceholderContent}>
                    <Ionicons name="card" size={30} color="#ccc" />
                    <Text style={styles.uploadLabel}>Ghana Card (Front)</Text>
                  </View>
                )}
                <View style={styles.uploadPlus}><Ionicons name="add" size={16} color="white" /></View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setGhback)}>
                {ghback ? (
                  <Image source={{ uri: ghback }} style={styles.uploadPreview} />
                ) : (
                  <View style={styles.uploadPlaceholderContent}>
                    <Ionicons name="card" size={30} color="#ccc" />
                    <Text style={styles.uploadLabel}>Ghana Card (Back)</Text>
                  </View>
                )}
                <View style={styles.uploadPlus}><Ionicons name="add" size={16} color="white" /></View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.primaryBtn, { marginTop: 20, opacity: submitting ? 0.6 : 1 }]} 
                onPress={submitImages}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnText}>Verify Identity</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollBody: { padding: 20 },
  profileCard: { backgroundColor: "white", borderRadius: 24, padding: 30, alignItems: "center", elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 25 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#f9fafb", marginBottom: 15 },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  onlineBadge: { position: 'absolute', bottom: 5, right: 5, width: 18, height: 18, backgroundColor: '#22c55e', borderRadius: 10, borderWidth: 3, borderColor: 'white' },
  userName: { fontSize: 22, fontWeight: "800", color: "#111", textAlign: 'center' },
  userEmail: { fontSize: 14, color: "#666", marginTop: 2, textAlign: 'center' },
  tag: { backgroundColor: "#fef3c7", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 12 },
  tagText: { color: "#d97706", fontSize: 12, fontWeight: "700" },
  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 12, fontWeight: "bold", color: "#f5a53d", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 18, borderRadius: 18 },
  infoValue: { marginLeft: 12, fontSize: 16, fontWeight: "600", color: "#111" },
  actionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 18, marginBottom: 12 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionText: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: "600", color: "#111" },
  logoutBtn: { padding: 18, alignItems: 'center', marginTop: 10 },
  logoutText: { color: "#ef4444", fontWeight: "bold", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 24, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: '#111' },
  modalSub: { color: '#666', marginBottom: 25, lineHeight: 20, fontSize: 14 },
  modalInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  modalInput: { flex: 1, height: 52, fontSize: 15, color: '#000' },
  primaryBtn: { backgroundColor: 'black', padding: 18, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  fullModalContent: { flex: 1, padding: 25 },
  uploadBox: { height: 140, backgroundColor: '#f9fafb', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
  uploadPlaceholderContent: { alignItems: 'center' },
  uploadPreview: { width: '100%', height: '100%' },
  uploadLabel: { fontSize: 12, color: '#999', marginTop: 8, fontWeight: '600' },
  uploadPlus: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#f5a53d', borderRadius: 10, padding: 4 }
});

export default Profile;