import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Platform,
  Linking,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  StatusBar,
  Alert,
  BackHandler,
} from 'react-native';
import {
  MaterialIcons,
  FontAwesome,
  Feather,
  Ionicons
} from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

// --- Video Component ---
const VideoPlayerItem = ({ uri, isVisible }) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    if (isVisible) player.play();
  });
  useEffect(() => {
    isVisible ? player.play() : player.pause();
  }, [isVisible, player]);
  return <VideoView style={styles.mediaMain} player={player} allowsFullscreen={false} contentFit="cover" />;
};

const DetailPage = ({ route }) => {
  const userId = useSelector((state) => state.user);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const carouselRef = useRef(null);

  // --- State ---
  const [localItem, setLocalItem] = useState(route.params);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  // --- 1. Automatic Carousel Logic ---
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;
      carouselRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  // --- 2. Corrected Hardware Back Button Handling ---
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      // Modern way: addEventListener returns a subscription object
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Corrected cleanup using subscription.remove()
      return () => subscription.remove();
    }, [navigation])
  );

  // --- 3. Data Fetching ---
  useEffect(() => {
    const media = [{ type: 'image', uri: localItem.picture }];
    if (localItem.picturesec) media.push({ type: 'image', uri: localItem.picturesec });
    if (localItem.video) media.push({ type: 'video', uri: localItem.video });
    
    setImages(media);
    setCurrentIndex(0);
    fetchComments(localItem._id);
    fetchRelated(localItem._id);
  }, [localItem]);

  const fetchComments = async (id) => {
    setIsCommentsLoading(true);
    try {
      const res = await fetch(`${baseURL}sparecomment/comments/${id}`);
      const data = await res.json();
      const sorted = (data.comments || []).sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      setComments(sorted);
    } catch (e) { console.error(e); }
    finally { setIsCommentsLoading(false); }
  };

  const fetchRelated = async (id) => {
    try {
      const res = await fetch(`${baseURL}sparepartsmainpost/${id}/related`);
      const data = await res.json();
      setRelatedProducts(data || []);
    } catch (e) { console.error(e); }
  };

  // --- 4. Comment Actions ---
  const handlePostComment = async () => {
    if (!comment.trim()) return;
    setIsActionLoading(true);
    try {
      const response = await fetch(`${baseURL}sparecomment/${localItem._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, content: comment })
      });
      if (response.ok) {
        setComment('');
        fetchComments(localItem._id);
      }
    } catch (e) { console.error(e); }
    finally { setIsActionLoading(false); }
  };

  const saveEditComment = async (id) => {
    if (!editingContent.trim()) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`${baseURL}sparecomment/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent.trim() }),
      });
      if (res.ok) {
        setEditingCommentId(null);
        fetchComments(localItem._id);
      }
    } catch (e) { console.error(e); }
    finally { setIsActionLoading(false); }
  };

  const handleDeleteComment = (id) => {
    Alert.alert("Delete Review", "Remove this message permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await fetch(`${baseURL}sparecomment/comments/${id}`, { method: 'DELETE' });
          fetchComments(localItem._id);
      }}
    ]);
  };

  const openDial = () => Linking.openURL(`tel:${localItem.phone}`);
  const openWhatsapp = () => Linking.openURL(`https://wa.me/${localItem.whatsapp}`);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, }}>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          
          {/* Automatic Carousel */}
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={carouselRef}
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            >
              {images.map((img, idx) => (
                <View key={idx} style={styles.mediaFrame}>
                  {img.type === 'image' ? (
                    <Image source={{ uri: img.uri }} style={styles.mediaMain} resizeMode="cover" />
                  ) : (
                    <VideoPlayerItem uri={img.uri} isVisible={idx === currentIndex} />
                  )}
                </View>
              ))}
            </ScrollView>
            <View style={styles.indicatorContainer}>
              {images.map((_, i) => <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />)}
            </View>
          </View>

          <View style={styles.contentBody}>
            <View style={styles.headerSection}>
              <View style={{ flex: 1 }}>
                <Text style={styles.brandTag}>SPARE PARTS</Text>
                <Text style={styles.productName}>{localItem.name}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>Gh₵{localItem.price?.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.locationTag}>
              <Ionicons name="location-sharp" size={14} color="#f5a53d" />
              <Text style={styles.locationText}>{localItem.region} • {localItem.town}</Text>
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.descriptionText}>{localItem.description}</Text>

            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.callBtn} onPress={openDial}>
                <Feather name="phone" size={18} color="#FFF" />
                <Text style={styles.btnText}>Call Seller</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waBtn} onPress={openWhatsapp}>
                <FontAwesome name="whatsapp" size={20} color="#FFF" />
                <Text style={styles.btnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <Text style={styles.reviewCount}>{comments.length} reviews</Text>
            </View>

            <View style={styles.commentInputWrapper}>
              <TextInput 
                style={styles.input} 
                placeholder="Ask a question..." 
                value={comment} 
                onChangeText={setComment} 
              />
              <TouchableOpacity 
                onPress={handlePostComment} 
                disabled={!comment.trim() || isActionLoading}
                style={[styles.sendBtn, !comment.trim() && { backgroundColor: '#EEE' }]}
              >
                {isActionLoading ? <ActivityIndicator size="small" color="#FFF" /> : <MaterialIcons name="arrow-upward" size={20} color={comment.trim() ? "#FFF" : "#999"} />}
              </TouchableOpacity>
            </View>

            {isCommentsLoading ? <ActivityIndicator color="#f5a53d" /> : (
              comments.map((c) => (
                <View key={c._id} style={styles.commentCard}>
                  <View style={styles.commentUserRow}>
                    <View style={styles.avatar}><Text style={styles.avatarTxt}>{c.user?.name?.charAt(0) || 'U'}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.commentUser}>{c.user?.name || 'User'}</Text>
                    </View>
                    
                    {c.user?._id === userId && editingCommentId !== c._id && (
                      <View style={styles.miniActions}>
                        <TouchableOpacity onPress={() => { setEditingCommentId(c._id); setEditingContent(c.content); }}>
                          <Feather name="edit-3" size={14} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteComment(c._id)} style={{ marginLeft: 15 }}>
                          <Feather name="trash-2" size={14} color="#FF5252" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {editingCommentId === c._id ? (
                    <View style={styles.editBox}>
                      <TextInput style={styles.editInput} value={editingContent} onChangeText={setEditingContent} multiline />
                      <View style={styles.editButtons}>
                        <TouchableOpacity onPress={() => setEditingCommentId(null)}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => saveEditComment(c._id)} style={styles.updateBtn}><Text style={styles.updateTxt}>Update</Text></TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.commentText}>{c.content}</Text>
                  )}
                </View>
              ))
            )}

            <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Related Listings</Text>
            <View style={styles.relatedGrid}>
              {relatedProducts.map((prod) => (
                <TouchableOpacity key={prod._id} style={styles.gridCard} onPress={() => setLocalItem(prod)}>
                  <Image source={{ uri: prod.picture }} style={styles.gridImg} />
                  <View style={styles.gridInfo}>
                    <Text numberOfLines={1} style={styles.gridName}>{prod.name}</Text>
                    <Text style={styles.gridPrice}>Gh₵{prod.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', top: 40 },
  carouselContainer: { width, height: height * 0.38, backgroundColor: '#000' },
  mediaFrame: { width, height: height * 0.38 },
  mediaMain: { width: '100%', height: '100%' },
  indicatorContainer: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 4 },
  activeDot: { width: 18, backgroundColor: '#FFF' },
  contentBody: { padding: 24 },
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brandTag: { fontSize: 10, fontWeight: 'bold', color: '#f5a53d', letterSpacing: 1, marginBottom: 4 },
  productName: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  priceContainer: { backgroundColor: '#FFF9F0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#f5a53d' },
  locationTag: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  locationText: { fontSize: 13, color: '#666', marginLeft: 5, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 12 },
  descriptionText: { fontSize: 15, color: '#555', lineHeight: 24 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  callBtn: { flex: 0.48, height: 54, borderRadius: 15, backgroundColor: '#1A1A1A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  waBtn: { flex: 0.48, height: 54, borderRadius: 15, backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { marginLeft: 10, color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 15 },
  reviewCount: { fontSize: 12, color: '#999', fontWeight: '600' },
  commentInputWrapper: { flexDirection: 'row', backgroundColor: '#F3F5F7', borderRadius: 18, paddingLeft: 16, paddingRight: 8, alignItems: 'center', height: 56, marginBottom: 20 },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  sendBtn: { backgroundColor: '#f5a53d', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  commentCard: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  commentUserRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8ECEF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarTxt: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  commentUser: { fontWeight: '700', fontSize: 14, color: '#1A1A1A' },
  commentText: { fontSize: 14, color: '#4A4A4A', lineHeight: 20 },
  miniActions: { flexDirection: 'row', alignItems: 'center' },
  editBox: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f5a53d', marginTop: 5 },
  editInput: { fontSize: 14, color: '#333', minHeight: 40 },
  editButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, alignItems: 'center' },
  cancelTxt: { color: '#888', marginRight: 15, fontSize: 13, fontWeight: '600' },
  updateBtn: { backgroundColor: '#1A1A1A', paddingHorizontal: 15, paddingVertical: 7, borderRadius: 8 },
  updateTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: (width - 64) / 2, backgroundColor: '#FFF', borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  gridImg: { width: '100%', height: 130, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  gridInfo: { padding: 12 },
  gridName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  gridPrice: { fontSize: 14, color: '#f5a53d', fontWeight: '800', marginTop: 4 }
});

export default DetailPage;