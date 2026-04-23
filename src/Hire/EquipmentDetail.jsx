import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Dimensions, ScrollView, Platform, Linking,
  Text, TouchableOpacity, StyleSheet, TextInput,
  ActivityIndicator, Modal as RNModal, SafeAreaView,
  Image, KeyboardAvoidingView, Alert,
  BackHandler
} from 'react-native';
import {
  MaterialIcons, Entypo, Feather, FontAwesome, Ionicons
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import * as Network from 'expo-network';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

// --- Helper: Dynamic Relative Date Formatting ---
const formatDate = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return "Just now"; // Default fallback
};

export default function EquipmentDetail({ route }) {
  const item = route.params;
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user);
  const scrollViewRef = useRef(null);
  const carouselRef = useRef(null);
  const autoPlayTimer = useRef(null);

  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (item?._id) {
      setImages([item.picture, item.picturesec].filter(Boolean));
      fetchPageData();
      fetchUserData();
    }
  }, [item._id]);

  // --- AutoPlay Logic ---
  const startAutoPlay = useCallback(() => {
    if (images.length <= 1) return;
    autoPlayTimer.current = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;
      carouselRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000);
  }, [currentIndex, images.length]);

  const stopAutoPlay = () => {
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${baseURL}userbyid/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserData({ name: data.name, email: data.email, phone: data.phone });
      }
    } catch (e) { console.error(e); }
  };

  const fetchPageData = async () => {
    try {
      const [cRes, rRes] = await Promise.all([
        fetch(`${baseURL}equipmentcomment/comments/${item._id}`),
        fetch(`${baseURL}equipmentmain/${item._id}/related`)
      ]);
      const cData = await cRes.json();
      const rData = await rRes.json();
      setComments(cData.comments || []);
      setRelatedProducts(Array.isArray(rData) ? rData : []);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleContact = async (type) => {
    const network = await Network.getNetworkStateAsync();
    if (!network.isConnected) {
      Alert.alert("No Connection", "Please check your internet.");
      return;
    }
    const endpoint = type === 'call' ? 'call' : 'whatsapp';
    const url = type === 'call' ? `tel:${item.phone}` : `https://wa.me/${item.whatsapp}`;

    try {
      await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name, email: userData.email, phone: userData.phone,
          receiverphone: type === 'call' ? item.phone : item.whatsapp,
          recname: item.name
        })
      });
    } catch (e) { console.log(`${type} logging failed`); }
    Linking.openURL(url);
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    setIsActionLoading(true);
    const res = await fetch(`${baseURL}equipmentcomment/${item._id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content: comment })
    });
    if (res.ok) { 
      setComment(''); 
      fetchPageData();
    }
    setIsActionLoading(false);
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

  if (loading) return <View style={styles.center}><ActivityIndicator color="#f5a53d" size="large" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* Professional Carousel */}
          <View style={styles.carouselWrapper}>
            <ScrollView
              ref={carouselRef}
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={stopAutoPlay}
              onScrollEndDrag={startAutoPlay}
              onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            >
              {images.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.carouselImage} />
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />
              ))}
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.titleRow}>
              <View style={{flex: 1}}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.locRow}>
                  <Entypo name="location-pin" size={16} color="#f5a53d" />
                  <Text style={styles.locTxt}>{item.location},{item.town}, {item.region}</Text>
                </View>
              </View>
              <Text style={styles.price}>Gh₵{item.price?.toLocaleString()}</Text>
            </View>

            <View style={styles.divider} />

            {/* Quick Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.btn, styles.callBtn]} onPress={() => handleContact('call')}>
                <Feather name="phone" size={18} color="#2E7D32" />
                <Text style={styles.callTxt}>Call Vendor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.waBtn]} onPress={() => handleContact('whatsapp')}>
                <FontAwesome name="whatsapp" size={20} color="#00695C" />
                <Text style={styles.waTxt}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            {/* Features/Amenities */}
            {item.amenities && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Key Specifications</Text>
                <View style={styles.amenityGrid}>
                  {item.amenities.split(',').map((am, i) => (
                    <View key={i} style={styles.amenityItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#f5a53d" />
                      <Text style={styles.amenityTxt}>{am.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Equipment Details</Text>
              <Text style={styles.descText}>{item.description}</Text>
            </View>

            <View style={styles.divider} />

            {/* Reviews Section */}
            <Text style={styles.sectionLabel}>Customer Reviews</Text>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.textInput} placeholder="Ask a question..." 
                value={comment} onChangeText={setComment} multiline
              />
              <TouchableOpacity onPress={postComment} disabled={isActionLoading}>
                {isActionLoading ? <ActivityIndicator size="small" color="#f5a53d" /> : <MaterialIcons name="send" size={24} color={comment.trim() ? "#f5a53d" : "#CCC"} />}
              </TouchableOpacity>
            </View>

            {comments.map((c) => (
              <View key={c._id} style={styles.commentCard}>
                <View style={styles.cHeader}>
                  <View style={styles.avatar}><Text style={styles.avatarTxt}>{c.user?.name?.charAt(0)}</Text></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cUser}>{c.user?.name || 'Verified User'}</Text>
                    <Text style={styles.cDate}>{formatDate(c.dateCreated)}</Text>
                  </View>
                  {c.user?._id === userId && (
                  <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => {setEditingId(c._id); setNewComment(c.content);}}><Feather name="edit-3" size={14} color="#666" /></TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteComment(c._id)} style={{marginLeft:15}}><Feather name="trash-2" size={14} color="#ff5252" /></TouchableOpacity>
                  </View>
                  )}
                </View>
                <Text style={styles.cBody}>{c.content}</Text>
              </View>
            ))}

            <Text style={[styles.sectionLabel, {marginTop: 30}]}>Related Equipment</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -20, paddingLeft: 20}}>
              {relatedProducts.map((rp) => (
                <TouchableOpacity key={rp._id} style={styles.relCard} onPress={() => { navigation.setParams(rp); scrollViewRef.current?.scrollTo({y: 0, animated: true}); }}>
                  <Image source={{ uri: rp.picture }} style={styles.relImg} />
                  <View style={styles.relInfo}>
                    <Text numberOfLines={1} style={styles.relTitle}>{rp.name}</Text>
                    <Text style={styles.relPrice}>Gh₵{rp.price?.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Actions */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity style={styles.footerBtn} onPress={() => handleContact('call')}>
          <Feather name="phone-call" size={18} color="#FFF" />
          <Text style={styles.footerBtnTxt}>Inquire Now</Text>
        </TouchableOpacity>
      </View>

      {/* Modern Delete Modal */}
      <RNModal visible={deleteId !== null} transparent animationType="fade">
        <View style={styles.modalBack}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Remove Review?</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setDeleteId(null)} style={styles.mCancel}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                const res = await fetch(`${baseURL}equipmentcomment/comments/${deleteId}`, { method: 'DELETE' });
                if (res.ok) { setDeleteId(null); fetchPageData(); }
              }} style={styles.mDelete}><Text style={{color:'#FFF'}}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', top:40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  carouselWrapper: { width, height: height * 0.38, backgroundColor: '#000' },
  carouselImage: { width, height: '100%', resizeMode: 'cover' },
  pagination: { flexDirection: 'row', position: 'absolute', bottom: 50, alignSelf: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#f5a53d', width: 18 },

  detailsCard: { 
    marginTop: -35, backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, 
    padding: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  price: { fontSize: 20, color: '#f5a53d', fontWeight: '800' },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locTxt: { marginLeft: 4, color: '#666', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },

  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 15 },
  descText: { fontSize: 14, color: '#555', lineHeight: 24 },

  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 12 },
  amenityTxt: { fontSize: 13, color: '#444', marginLeft: 8, fontWeight: '500' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  btn: { flex: 0.48, height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  callBtn: { backgroundColor: '#E8F5E9' }, callTxt: { color: '#2E7D32', fontWeight: '700', marginLeft: 8 },
  waBtn: { backgroundColor: '#E0F2F1' }, waTxt: { color: '#00695C', fontWeight: '700', marginLeft: 8 },

  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
  textInput: { flex: 1, minHeight: 45, fontSize: 14, paddingVertical: 12 },

  commentCard: { borderBottomWidth: 1, borderBottomColor: '#F8F9FA', paddingVertical: 15 },
  cHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f5a53d', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontWeight: 'bold', color: '#FFF', fontSize: 13 },
  cUser: { fontWeight: '700', fontSize: 14 },
  cDate: { fontSize: 11, color: '#AAA' },
  cBody: { fontSize: 14, color: '#444', marginLeft: 46, lineHeight: 20 },

  relCard: { width: 140, marginRight: 15, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  relImg: { width: '100%', height: 100 },
  relInfo: { padding: 10 },
  relTitle: { fontWeight: '700', fontSize: 12 },
  relPrice: { color: '#f5a53d', fontWeight: '800', fontSize: 12, marginTop: 4 },

  stickyFooter: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: Platform.OS === 'ios' ? 35 : 20 },
  footerBtn: { backgroundColor: '#1A1A1A', height: 54, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerBtnTxt: { color: '#FFF', fontWeight: '800', marginLeft: 10 },

  modalBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: '#FFF', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  mCancel: { padding: 12, flex: 1, alignItems: 'center', backgroundColor: '#EEE', borderRadius: 12 },
  mDelete: { padding: 12, flex: 1, alignItems: 'center', backgroundColor: '#D32F2F', borderRadius: 12 },
  commentActions: { flexDirection: 'row'}
});