import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Dimensions, ScrollView, Platform, Linking,
  Text, TouchableOpacity, StyleSheet, TextInput,
  ActivityIndicator, Image, Alert, KeyboardAvoidingView, SafeAreaView
} from 'react-native';
import {
  MaterialIcons, FontAwesome, Feather, Ionicons, FontAwesome5
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Network from 'expo-network';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

// --- Helper: Format Date ---
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

// --- Video Component ---
function VideoItem({ uri, isVisible }) {
  const player = useVideoPlayer(uri, (p) => { p.loop = true; });
  useEffect(() => {
    isVisible ? player.play() : player.pause();
  }, [isVisible]);
  return <VideoView style={styles.carouselMedia} player={player} contentFit="cover" />;
}

const BuildingDetail = ({ route }) => {
  const item = route.params;
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const carouselRef = useRef(null);
  const autoPlayTimer = useRef(null);
  const userId = useSelector((state) => state.user);

  // States
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });

  // Comment States
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // AutoPlay Logic
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
    if (item?._id) {
      const mediaList = [
        { type: 'image', uri: item.picture },
        item.picturesec && { type: 'image', uri: item.picturesec },
        item.video && { type: 'video', uri: item.video }
      ].filter(Boolean);
      setImages(mediaList);
      fetchInitialData();
      fetchUserData();
    }
  }, [item._id]);

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

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [relatedRes, commentRes] = await Promise.all([
        fetch(`${baseURL}buildings/${item._id}/related`),
        fetch(`${baseURL}buidingcomment/comments/${item._id}`)
      ]);
      const relatedData = await relatedRes.json();
      const commentData = await commentRes.json();
      setRelatedProducts(Array.isArray(relatedData) ? relatedData : []);
      setComments(commentData.comments || []);
    } catch (error) { console.error(error); } 
    finally { setLoadingData(false); }
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
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: type === 'call' ? item.phone : item.whatsapp,
          recname: item.name
        })
      });
    } catch (e) { console.log(`${type} log failed`); }
    Linking.openURL(url);
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setIsActionLoading(true);
    try {
      const url = editingId 
        ? `${baseURL}buidingcomment/comments/${editingId}`
        : `${baseURL}buidingcomment/${item._id}/comments`;
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: newComment.trim() })
      });

      if (res.ok) {
        setNewComment('');
        setEditingId(null);
        fetchInitialData();
      }
    } catch (e) { console.error(e); }
    finally { setIsActionLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          
          {/* Auto-Playing Carousel */}
          <View style={styles.mediaWrapper}>
            <ScrollView
              ref={carouselRef}
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={stopAutoPlay}
              onScrollEndDrag={startAutoPlay}
              onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            >
              {images.map((img, idx) => (
                <View key={idx} style={{ width, height: height * 0.4 }}>
                  {img.type === 'image' ? (
                    <Image source={{ uri: img.uri }} style={styles.carouselMedia} />
                  ) : (
                    <VideoItem uri={img.uri} isVisible={idx === currentIndex} />
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
              ))}
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.titleRow}>
               <View style={{flex: 1}}>
                  <Text style={styles.mainTitle}>{item.name}</Text>
                  <View style={styles.locRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.locText}>{item.location},{item.town}, {item.region}</Text>
                  </View>
               </View>
               <Text style={styles.priceTag}>Gh₵{item.price?.toLocaleString()}</Text>
            </View>

            <View style={styles.divider} />

            {/* Quick Contact Icons */}
            <View style={styles.inlineActionRow}>
              <TouchableOpacity style={[styles.inlineBtn, styles.callInline]} onPress={() => handleContact('call')}>
                <Feather name="phone" size={18} color="#1b5e20" />
                <Text style={styles.callTxt}>Call Seller</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.inlineBtn, styles.waInline]} onPress={() => handleContact('whatsapp')}>
                <FontAwesome name="whatsapp" size={20} color="#00695C" />
                <Text style={styles.waTxt}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            {/* Amenities Section */}
            {item.amenities && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>Key Amenities</Text>
                <View style={styles.amenitiesGrid}>
                  {item.amenities.split(',').map((amenity, idx) => (
                    <View key={idx} style={styles.amenityItem}>
                      <MaterialIcons name="check-circle" size={16} color="#f5a53d" />
                      <Text style={styles.amenityText}>{amenity.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>Property Description</Text>
                <Text style={styles.descText}>{item.description}</Text>
            </View>

            <View style={styles.divider} />

            {/* Questions & Reviews */}
            <Text style={styles.sectionLabel}>Community Q&A</Text>
            <View style={styles.commentInputRow}>
              <TextInput 
                placeholder="Ask a question about this property..." style={styles.commentInput}
                value={newComment} onChangeText={setNewComment} multiline
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment} disabled={isActionLoading}>
                {isActionLoading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
              </TouchableOpacity>
            </View>

            {comments.map((c, i) => (
              <View key={i} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View style={styles.avatar}><Text style={styles.avatarTxt}>{c.user?.name?.charAt(0) || "U"}</Text></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.commentUser}>{c.user?.name || "Verified User"}</Text>
                    <Text style={styles.commentDate}>{formatDate(c.dateCreated)}</Text>
                  </View>
                  {c.user?._id === userId && (
                  <View style={styles.commentActions}>
                      <TouchableOpacity onPress={() => {setEditingId(c._id); setNewComment(c.content);}}><Feather name="edit-3" size={14} color="#666" /></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteComment(c._id)} style={{marginLeft:15}}><Feather name="trash-2" size={14} color="#ff5252" /></TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={styles.commentText}>{c.content}</Text>
              </View>
            ))}

            {/* Related Listings */}
            <Text style={[styles.sectionLabel, { marginTop: 30 }]}>You might also like</Text>
            <View style={styles.gridContainer}>
              {loadingData ? <ActivityIndicator color="#f5a53d" /> : relatedProducts.map((prod, i) => (
                <TouchableOpacity 
                  key={i} style={styles.gridCard} 
                  onPress={() => { navigation.setParams(prod); scrollViewRef.current?.scrollTo({ y: 0, animated: true }); }}
                >
                  <Image source={{ uri: prod.picture }} style={styles.gridImg} />
                  <View style={styles.gridInfo}>
                    <Text numberOfLines={1} style={styles.gridTitle}>{prod.name}</Text>
                    <Text style={styles.gridPrice}>Gh₵{prod.price?.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Footer */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity style={styles.callBtnFooter} onPress={() => handleContact('call')}>
          <Feather name="phone-call" size={18} color="#fff" />
          <Text style={styles.btnTxt}>Book a Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.waBtnFooter} onPress={() => handleContact('whatsapp')}>
          <FontAwesome5 name="whatsapp" size={20} color="#fff" />
          <Text style={styles.btnTxt}>Inquire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollBody: { paddingBottom: 130 },
  mediaWrapper: { height: height * 0.4, backgroundColor: '#000' },
  carouselMedia: { width, height: '100%' },
  pagination: { position: 'absolute', bottom: 50, flexDirection: 'row', alignSelf: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#f5a53d', width: 20 },
  
  detailsCard: { 
    marginTop: -35, backgroundColor: '#fff', borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, padding: 24, shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mainTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  priceTag: { fontSize: 20, fontWeight: '900', color: '#f5a53d' },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locText: { fontSize: 13, color: '#666', marginLeft: 4 },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },
  sectionContainer: { marginBottom: 25 },
  sectionLabel: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 15 },
  descText: { fontSize: 14, color: '#555', lineHeight: 24 },

  // Amenities Grid
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityItem: { 
    flexDirection: 'row', alignItems: 'center', width: '50%', 
    marginBottom: 12, paddingRight: 10 
  },
  amenityText: { fontSize: 13, color: '#444', marginLeft: 8, fontWeight: '500' },

  // Buttons
  inlineActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  inlineBtn: { flex: 0.48, height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  callInline: { backgroundColor: '#E8F5E9' }, 
  waInline: { backgroundColor: '#E0F2F1' },
  callTxt: { color: '#1b5e20', fontWeight: '700', marginLeft: 8 }, 
  waTxt: { color: '#00695C', fontWeight: '700', marginLeft: 8 },

  // Comments
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  commentInput: { flex: 1, minHeight: 45, backgroundColor: '#F8F9FA', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, borderWidth: 1, borderColor: '#EEE' },
  sendBtn: { backgroundColor: '#1A1A1A', width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  commentCard: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f5a53d', justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  commentUser: { fontWeight: '700', fontSize: 14 },
  commentDate: { fontSize: 11, color: '#999' },
  commentText: { fontSize: 14, color: '#444', marginLeft: 46, lineHeight: 20 },

  // Related Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: (width - 64) / 2, backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden' },
  gridImg: { width: '100%', height: 120 },
  gridInfo: { padding: 12 },
  gridTitle: { fontSize: 13, fontWeight: '700', color: '#333' },
  gridPrice: { fontSize: 13, color: '#f5a53d', fontWeight: '800', marginTop: 4 },

  // Sticky Footer
  stickyFooter: { 
    position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', 
    padding: 20, flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: Platform.OS === 'ios' ? 35 : 20
  },
  callBtnFooter: { flex: 0.48, backgroundColor: '#1A1A1A', height: 54, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  waBtnFooter: { flex: 0.48, backgroundColor: '#25D366', height: 54, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800', marginLeft: 8, fontSize: 14 },
  commentActions: { flexDirection: 'row',  }
});

export default BuildingDetail;