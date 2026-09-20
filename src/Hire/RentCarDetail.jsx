import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Entypo,
  MaterialIcons,
  FontAwesome,
  Feather,
  Ionicons
} from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import * as Network from 'expo-network'; // Ensure expo-network is installed
import {
  View,
  Dimensions,
  ScrollView,
  Linking,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Modal as RNModal,
  Image,
  StatusBar,
  Alert,
  BackHandler
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { width, height } = Dimensions.get('window');

// --- VIDEO ITEM COMPONENT ---
const VideoItem = ({ uri, isVisible }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    isVisible ? player.play() : player.pause();
  });

  useEffect(() => {
    isVisible ? player.play() : player.pause();
  }, [isVisible, player]);

  return <VideoView style={styles.mediaContent} player={player} allowsFullscreen contentFit="cover" />;
};

// --- AUTO-SLIDING CAROUSEL ---
function CustomMediaCarousel({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const autoPlayTimer = useRef(null);
  const isDragging = useRef(false);

  const formattedData = data.filter(item => item).map(item => {
    const ext = item?.split('.').pop().toLowerCase();
    return ['mp4', 'mov', 'avi', 'm4v'].includes(ext) 
      ? { type: 'video', uri: item } 
      : { type: 'image', uri: item };
  });

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer.current = setInterval(() => {
      if (!isDragging.current && formattedData.length > 0) {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % formattedData.length;
          scrollRef.current?.scrollTo({ x: next * width, animated: true });
          return next;
        });
      }
    }, 4000);
  };

  const stopAutoPlay = () => { if (autoPlayTimer.current) clearInterval(autoPlayTimer.current); };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [formattedData]);

  return (
    <View style={{ width, height: height / 2.8 }}>
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => { isDragging.current = true; stopAutoPlay(); }}
        onScrollEndDrag={() => { isDragging.current = false; startAutoPlay(); }}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {formattedData.map((item, idx) => (
          <View key={idx} style={styles.carouselItem}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.mediaContent} resizeMode="cover" />
            ) : (
              <VideoItem uri={item.uri} isVisible={idx === currentIndex} />
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationRow}>
        {formattedData.map((_, i) => (
          <View key={i} style={[styles.dot, { opacity: i === currentIndex ? 1 : 0.4, backgroundColor: i === currentIndex ? '#f5a53d' : '#fff' }]} />
        ))}
      </View>
    </View>
  );
}

// --- MAIN DETAIL COMPONENT ---
function RentCarDetail({ route }) {
  const item = route.params;
  const userId = useSelector((state) => state.user);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState(3);
  
  // Logic States for Edit/Delete
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState(null); 
  const [editValue, setEditValue] = useState('');

  // Engagement States
  const [isCalling, setIsCalling] = useState(false);
  const [isWhatsApping, setIsWhatsApping] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });


   const navigation = useNavigation();

  useEffect(() => { 
    fetchData(); 
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${baseURL}userbyid/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData({ name: data.name, email: data.email, phone: data.phone });
      }
    } catch (err) { console.error('Error fetching user data:', err); }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseURL}rentcarcomment/comments/${item._id}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) { console.error(e); } finally { setIsCommentsLoading(false); }
  };

  const checkInternet = async () => {
    const network = await Network.getNetworkStateAsync();
    if (!network.isConnected) {
      Alert.alert("No Connection", "Check your internet connection.");
      return false;
    }
    return true;
  };

  const openDial = async () => {
    if (isCalling) return;
    const hasNet = await checkInternet();
    if (!hasNet) return;

    setIsCalling(true);
    try {
      await fetch(`${baseURL}call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: item.phone,
          recname: item.name
        })
      });
      Linking.openURL(`tel:${item.phone}`);
    } catch (err) {
      Linking.openURL(`tel:${item.phone}`);
    } finally {
      setIsCalling(false);
    }
  };

  const openWhatsap = async () => {
    if (isWhatsApping) return;
    const hasNet = await checkInternet();
    if (!hasNet) return;

    setIsWhatsApping(true);
    try {
      await fetch(`${baseURL}whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          receiverphone: item.whatsapp,
          recname: item.name
        })
      });
      Linking.openURL(`https://wa.me/${item.whatsapp}`);
    } catch (err) {
      Linking.openURL(`https://wa.me/${item.whatsapp}`);
    } finally {
      setIsWhatsApping(false);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await fetch(`${baseURL}rentcarcomment/${item._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: comment })
      });
      if (res.ok) { setComment(''); fetchData(); }
    } catch (e) { console.error(e); }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`${baseURL}rentcarcomment/comments/${deleteCommentId}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); } finally { setDeleteCommentId(null); }
  };

  const handleUpdateComment = async () => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch(`${baseURL}rentcarcomment/comments/${editingComment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editValue })
      });
      if (res.ok) { setEditingComment(null); fetchData(); }
    } catch (e) { console.error(e); }
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
      <StatusBar barStyle="light-content" />
       <CustomMediaCarousel data={[item.picture, item.picturesec]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150, top:10 }}>
        
       

        <View style={styles.contentWrapper}>
          <View style={styles.titleSection}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <View style={styles.priceBadge}><Text style={styles.priceValue}>Gh₵{item.price}</Text></View>
          </View>

           <Text style={styles.descriptionText}>{item.description}</Text>

          <View style={styles.locationCard}>
             <View style={styles.locationItem}>
              <Entypo name="location" size={16} color="#f5a53d" />
              <Text style={styles.locationText}>{item.region}, {item.town}</Text>
            </View>
            <View style={styles.locationItem}>
              <MaterialIcons name="my-location" size={16} color="#f5a53d" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, {backgroundColor: '#1b5e20'}]} 
              onPress={openDial}
              disabled={isCalling}
            >
              {isCalling ? <ActivityIndicator size="small" color="#fff" /> : (
                <>
                  <Feather name="phone-call" size={18} color="#fff" />
                  <Text style={[styles.actionBtnText, {color: '#fff'}]}>Call Seller</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, {backgroundColor: '#25D366'}]} 
              onPress={openWhatsap}
              disabled={isWhatsApping}
            >
              {isWhatsApping ? <ActivityIndicator size="small" color="#fff" /> : (
                <>
                  <FontAwesome name="whatsapp" size={20} color="#fff" />
                  <Text style={[styles.actionBtnText, {color: '#fff'}]}>WhatsApp</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.sectionLabel}>Questions & Messages</Text>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Ask a question..." style={styles.commentInput} value={comment} onChangeText={setComment} />
              <TouchableOpacity onPress={handlePostComment}><Ionicons name="send" size={24} color="#f5a53d" /></TouchableOpacity>
            </View>

            {isCommentsLoading ? <ActivityIndicator color="#f5a53d" style={{ marginTop: 20 }} /> : (
              comments.slice(0, visibleComments).map((c) => (
                <View key={c._id} style={styles.commentBubble}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{c.user?.name || 'User'}</Text>
                    {c.user?._id === userId && (
                      <View style={styles.commentActions}>
                        <TouchableOpacity onPress={() => { setEditingComment(c); setEditValue(c.content); }}>
                          <MaterialIcons name="edit" size={18} color="#666" style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDeleteCommentId(c._id)}>
                          <MaterialIcons name="delete-outline" size={18} color="red" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentText}>{c.content}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* DELETE MODAL */}
      <RNModal visible={deleteCommentId !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Comment?</Text>
            <Text style={styles.modalSubtitle}>This action cannot be undone.</Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setDeleteCommentId(null)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: 'red'}]} onPress={handleDeleteComment}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* EDIT MODAL */}
      <RNModal visible={editingComment !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: width * 0.9 }]}>
            <Text style={styles.modalTitle}>Edit Comment</Text>
            <TextInput 
              style={styles.editInput} 
              multiline 
              value={editValue} 
              onChangeText={setEditValue} 
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEditingComment(null)}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, {backgroundColor: '#f5a53d'}]} onPress={handleUpdateComment}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff', top:50 },
  carouselItem: { width, height: height / 2.8, backgroundColor: '#000' },
  mediaContent: { width: '100%', height: '100%' },
  paginationRow: { position: 'absolute', bottom: 15, flexDirection: 'row', width: '100%', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  contentWrapper: { padding: 20, marginTop: -25, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  descriptionText: { marginTop: 10, color: 'black', fontSize: 14, lineHeight: 22 },
  itemTitle: { fontSize: 22, fontWeight: '800', color: '#333', flex: 1 },
  priceBadge: { backgroundColor: '#f5a53d20', padding: 10, borderRadius: 12 },
  priceValue: { color: '#f5a53d', fontWeight: 'bold', fontSize: 18 },
  locationCard: { backgroundColor: '#f9f9f9', borderRadius: 15, padding: 15, marginTop: 15 },
  locationItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  locationText: { marginLeft: 8, color: '#666', fontSize: 14 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  actionBtn: { flex: 0.48, paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  commentSection: { marginTop: 30 },
  sectionLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputContainer: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 25, paddingHorizontal: 15, alignItems: 'center', height: 50, marginBottom: 10 },
  commentInput: { flex: 1 },
  commentBubble: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentUser: { fontWeight: 'bold', color: '#333' },
  commentActions: { flexDirection: 'row' },
  commentText: { color: '#555', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: 300, backgroundColor: 'white', padding: 25, borderRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  modalSubtitle: { textAlign: 'center', color: '#666', marginBottom: 20 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 10, backgroundColor: '#eee' },
  editInput: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee', marginBottom: 15 }
});

export default RentCarDetail;