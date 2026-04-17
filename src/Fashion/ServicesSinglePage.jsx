import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  Linking,
  ActivityIndicator,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MaterialIcons,
  Feather,
  Ionicons,
  FontAwesome,
  AntDesign
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Network from 'expo-network';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 3; 

// --- Video Player Component ---
function VideoPlayer({ uri, isActive }) {
  const player = useVideoPlayer(uri, (p) => { p.loop = true; });
  useEffect(() => {
    if (isActive) player.play();
    else player.pause();
  }, [isActive, player]);
  return <VideoView player={player} style={styles.mediaItem} contentFit="cover" />;
}

// --- Custom Media Carousel ---
function CustomMediaCarousel({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    if (!data || data.length <= 1) return;
    timerRef.current = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 4500);
  }, [currentIndex, data, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentIndex) setCurrentIndex(newIndex);
        }}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
      >
        {data.map((item, idx) => (
          <View key={idx} style={styles.carouselItem}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.mediaItem} resizeMode="cover" />
            ) : (
              <VideoPlayer uri={item.uri} isActive={idx === currentIndex} />
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationDots}>
        {data.length > 1 && data.map((_, i) => (
          <View key={i} style={[styles.dot, currentIndex === i ? styles.activeDot : null]} />
        ))}
      </View>
    </View>
  );
}

export default function ServicesSigPage({ route }) {
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user);
  const mainScrollRef = useRef(null);

  const [currentItem, setCurrentItem] = useState(route.params);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [userData, setUserData] = useState({ name: '', phone: '' });
  
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentLimit, setCommentLimit] = useState(3);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    if (currentItem?._id) {
      setLoading(true);
      fetchInitialData();
      
      const newImages = [{ type: 'image', uri: currentItem.picture }];
      if (currentItem.picturesec) newImages.push({ type: 'image', uri: currentItem.picturesec });
      if (currentItem.video) newImages.push({ type: 'video', uri: currentItem.video });
      setImages(newImages);

      if (mainScrollRef.current) mainScrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [currentItem]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchUserData(), fetchComments(), fetchRelatedProducts()]);
    } finally { setLoading(false); }
  };

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${baseURL}userbyid/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserData({ name: data.name, phone: data.phone });
      }
    } catch (e) { console.error(e); }
  };

  const fetchComments = async () => {
    setIsCommentsLoading(true);
    try {
      const res = await fetch(`${baseURL}servicescomment/comments/${currentItem._id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
      }
    } catch (e) { console.error(e); } finally { setIsCommentsLoading(false); }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(`${baseURL}services/${currentItem._id}/related`);
      if (res.ok) {
        const data = await res.json();
        setRelatedProducts(Array.isArray(data) ? data : (data.related || []));
      }
    } catch (e) { console.error(e); }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    setPostLoading(true);
    try {
      const res = await fetch(`${baseURL}servicescomment/${currentItem._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: comment })
      });
      if (res.ok) { setComment(""); fetchComments(); }
    } catch (e) { console.error(e); } finally { setPostLoading(false); }
  };

  const saveEditComment = async (commentId) => {
    if (!editingContent.trim()) return;
    setPostLoading(true);
    try {
      const res = await fetch(`${baseURL}servicescomment/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent.trim() }),
      });
      if (res.ok) { setEditingCommentId(null); fetchComments(); }
    } catch (err) { console.error(err); } finally { setPostLoading(false); }
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert("Delete Message", "Remove this question?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
          try {
            await fetch(`${baseURL}servicescomment/comments/${commentId}`, { method: 'DELETE' });
            fetchComments();
          } catch (err) { console.error(err); }
      }}
    ]);
  };

  const openDial = async () => {
    setIsCalling(true);
    try {
      await fetch(`${baseURL}call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.name, phone: userData.phone, receiverphone: currentItem.phone, recname: currentItem.name })
      });
      Linking.openURL(`tel:${currentItem.phone}`);
    } catch (e) { Linking.openURL(`tel:${currentItem.phone}`); } finally { setIsCalling(false); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#f5a53d" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView ref={mainScrollRef} showsVerticalScrollIndicator={false}>
          <CustomMediaCarousel data={images} />

          <View style={styles.contentContainer}>
            <View style={styles.badgeRow}>
              <Text style={styles.conditionBadge}>VERIFIED PROVIDER</Text>
              {currentItem.discount > 0 && <Text style={styles.discountBadge}>{currentItem.discount}% OFF</Text>}
            </View>

            <Text style={styles.productName}>{currentItem?.name}</Text>

           

            <View style={styles.locationRow}>
              <MaterialIcons name="location-pin" size={16} color="#999" />
              <Text style={styles.locationText}>{currentItem.location},{currentItem.town}, {currentItem.region}</Text>
            </View>

            <View style={styles.descriptionBox}>
              <Text style={styles.sectionTitle}>Service Description</Text>
              <Text style={styles.descriptionText}>{currentItem?.description}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={openDial} disabled={isCalling} style={[styles.actionBtn, {backgroundColor: '#1b5e20'}]}>
                {isCalling ? <ActivityIndicator size="small" color="#fff" /> : (
                  <><Feather name="phone" size={18} color="#fff" /><Text style={styles.actionLabel}>Call Now</Text></>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${currentItem.whatsapp}`)} style={[styles.actionBtn, {backgroundColor: '#25D366'}]}>
                <FontAwesome name="whatsapp" size={20} color="#fff" /><Text style={styles.actionLabel}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* COMMENT SECTION */}
            <View style={styles.commentSection}>
              <Text style={styles.sectionTitle}>Inquiries</Text>
              <View style={styles.commentInputWrapper}>
                <TextInput
                  placeholder="Ask a question..."
                  value={comment}
                  onChangeText={setComment}
                  style={styles.textInput}
                />
                <TouchableOpacity 
                  onPress={handlePostComment} 
                  disabled={postLoading || !comment.trim()} 
                  style={[styles.sendIconCircle, !comment.trim() && {backgroundColor: '#ccc'}]}
                >
                  <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {isCommentsLoading ? <ActivityIndicator color="#f5a53d" /> : (
                comments.slice(0, commentLimit).map((cmt) => (
                  <View key={cmt._id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <View style={styles.userAvatar}><Text style={styles.avatarText}>{cmt.user?.name?.charAt(0) || 'U'}</Text></View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.userName}>{cmt.user?.name}</Text>
                        <Text style={styles.commentTime}>Recently</Text>
                      </View>
                    </View>

                    {editingCommentId === cmt._id ? (
                      <View style={styles.editContainer}>
                        <TextInput 
                          style={styles.editInput} 
                          value={editingContent} 
                          onChangeText={setEditingContent} 
                          multiline 
                        />
                        <View style={styles.editActionRow}>
                          <TouchableOpacity onPress={() => setEditingCommentId(null)}>
                            <Text style={styles.cancelLink}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => saveEditComment(cmt._id)} style={styles.smallUpdateBtn}>
                            {postLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.updateBtnText}>Update</Text>}
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.commentText}>{cmt.content}</Text>
                        {cmt.user?._id === userId && (
                          <View style={styles.professionalActionRow}>
                            <TouchableOpacity onPress={() => { setEditingCommentId(cmt._id); setEditingContent(cmt.content); }} style={styles.iconBtn}>
                              <Feather name="edit-2" size={14} color="#666" /><Text style={styles.iconBtnText}>Edit</Text>
                            </TouchableOpacity>
                            <View style={styles.verticalSeparator} />
                            <TouchableOpacity onPress={() => handleDeleteComment(cmt._id)} style={styles.iconBtn}>
                              <Feather name="trash-2" size={14} color="#ff5252" /><Text style={[styles.iconBtnText, {color: '#ff5252'}]}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ))
              )}
              {comments.length > commentLimit && (
                <TouchableOpacity onPress={() => setCommentLimit(prev => prev + 3)} style={styles.loadMoreBtn}>
                  <Text style={styles.loadMoreText}>View more messages</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
              <View style={styles.relatedSection}>
                <Text style={styles.sectionTitle}>Similar Services</Text>
                <View style={styles.relatedGrid}>
                  {relatedProducts.map((rItem) => (
                    <TouchableOpacity key={rItem._id} style={styles.relatedCard} onPress={() => setCurrentItem(rItem)}>
                      <Image source={{ uri: rItem.picture }} style={styles.relatedImg} />
                      <View style={styles.relatedInfo}>
                        <Text numberOfLines={1} style={styles.relatedTitle}>{rItem.name}</Text>
                        <Text numberOfLines={1} style={styles.relatedPrice}>Gh₵{rItem.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  carouselWrapper: { width, height: height / 2.8 },
  carouselItem: { width, justifyContent: "center", alignItems: "center" },
  mediaItem: { width: width - 40, height: height / 3, borderRadius: 16, backgroundColor: '#f9f9f9' },
  paginationDots: { flexDirection: 'row', alignSelf: 'center', marginTop: -25 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.1)', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#f5a53d', width: 14 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20 },
  badgeRow: { flexDirection: 'row', marginBottom: 10 },
  conditionBadge: { backgroundColor: '#333', color: '#fff', fontSize: 9, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 8 },
  discountBadge: { backgroundColor: '#fff3e0', color: '#f5a53d', fontSize: 9, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 },
  priceContainer: { marginBottom: 15 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceLabel: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  oldPrice: { fontSize: 16, color: '#bbb', textDecorationLine: 'line-through' },
  promoLabel: { fontSize: 10, color: '#f5a53d', fontWeight: 'bold' },
  newPrice: { fontSize: 24, fontWeight: 'bold', color: '#f5a53d' },
  soloPrice: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  locationText: { color: '#777', fontSize: 14, marginLeft: 6 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  descriptionBox: { marginBottom: 25 },
  descriptionText: { fontSize: 15, color: '#555', lineHeight: 22 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12 },
  actionLabel: { marginLeft: 10, fontWeight: 'bold', color: '#fff', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#f4f4f4', marginBottom: 25 },
  
  // Comment Styles
  commentSection: { marginBottom: 30 },
  commentInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingLeft: 15, paddingRight: 5, paddingVertical: 6, marginBottom: 20 },
  textInput: { flex: 1, height: 40, fontSize: 14 },
  sendIconCircle: { backgroundColor: '#f5a53d', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  commentCard: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f4f4f4' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#888', fontSize: 12 },
  userName: { fontWeight: '700', color: '#333', fontSize: 14 },
  commentTime: { fontSize: 10, color: '#bbb' },
  commentText: { color: '#444', fontSize: 14, lineHeight: 20 },
  professionalActionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  iconBtnText: { fontSize: 12, color: '#777', marginLeft: 5, fontWeight: '600' },
  verticalSeparator: { width: 1, height: 12, backgroundColor: '#ddd', marginHorizontal: 15 },
  editContainer: { marginTop: 5 },
  editInput: { backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#f5a53d', borderRadius: 8, padding: 10, fontSize: 14, textAlignVertical: 'top' },
  editActionRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 },
  cancelLink: { color: '#999', marginRight: 20, fontSize: 13, fontWeight: '600' },
  smallUpdateBtn: { backgroundColor: '#333', paddingHorizontal: 18, paddingVertical: 7, borderRadius: 6, minWidth: 80, alignItems: 'center' },
  updateBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  loadMoreBtn: { padding: 12, alignSelf: 'center' },
  loadMoreText: { color: '#f5a53d', fontWeight: 'bold', fontSize: 13 },

  relatedSection: { marginTop: 10 },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  relatedCard: { width: ITEM_WIDTH, marginBottom: 15, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  relatedImg: { width: '100%', height: ITEM_WIDTH, resizeMode: 'cover' },
  relatedInfo: { padding: 8 },
  relatedTitle: { fontSize: 11, fontWeight: '700', color: '#444' },
  relatedPrice: { fontSize: 11, color: '#f5a53d', fontWeight: 'bold', marginTop: 2 },
});