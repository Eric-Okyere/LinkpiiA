import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  Alert,
  BackHandler,
} from 'react-native';
import {
  MaterialIcons,
  FontAwesome,
  Feather,
  Ionicons
} from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import baseURL from '../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');
const CONTAINER_PADDING = 30; 
const GRID_SPACING = 10; 
const ITEM_WIDTH = (width - CONTAINER_PADDING - (GRID_SPACING * 2)) / 3;

const scheduleTask = (callback) => {
  if (global.requestIdleCallback) {
    return global.requestIdleCallback(callback);
  } else {
    return setTimeout(callback, 1);
  }
};

function VideoPlayer({ uri, isActive }) {
  const player = useVideoPlayer(uri, (p) => { p.loop = true; });
  useEffect(() => {
    if (isActive) player.play();
    else player.pause();
  }, [isActive]);
  return <VideoView player={player} style={styles.mediaItem} contentFit="contain" />;
}

function CustomMediaCarousel({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    if (!data || data.length <= 1) return;
    
    timerRef.current = setInterval(() => {
      scheduleTask(() => {
        if (scrollRef.current) {
          const nextIndex = (currentIndex + 1) % data.length;
          scrollRef.current.scrollTo({
            x: nextIndex * width,
            animated: true,
          });
          setCurrentIndex(nextIndex);
        }
      });
    }, 4500);
  }, [currentIndex, data, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  if (!data || data.length === 0) return null;

  return (
    <View style={{ width, height: height / 2.8 }}>
      <ScrollView
        ref={scrollRef}
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={32} 
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentIndex) setCurrentIndex(newIndex);
        }}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
        style={{ flex: 1 }}
      >
        {data.map((item, idx) => (
          <View key={idx} style={styles.carouselItem}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} resizeMode="cover" style={styles.mediaItem} />
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

export default function HotDetail({ route }) {
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [commentLimit, setCommentLimit] = useState(3);

  const myProducts = useSelector((state) => state.user);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const item = route.params;

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

  useEffect(() => {
    if (item?._id) {
      fetchComments(item._id);
      fetchRelatedData();
    }
    const newImages = [{ type: 'image', uri: item.picture }];
    if (item.picturesec) newImages.push({ type: 'image', uri: item.picturesec });
    if (item.video) newImages.push({ type: 'video', uri: item.video });
    setImages(newImages);
  }, [item]);

  const fetchComments = async (itemId) => {
    setIsCommentsLoading(true);
    try {
      const endpoints = [
        `${baseURL}comment/comments/${itemId}`,
        `${baseURL}buidingcomment/comments/${itemId}`,
        `${baseURL}shopcomment/comments/${itemId}`
      ];
      const responses = await Promise.all(endpoints.map(u => fetch(u)));
      const data = await Promise.all(responses.map(r => r.ok ? r.json() : { comments: [] }));
      const allComments = data.flatMap(d => d.comments || []);
      setComments(allComments.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
    } catch (error) { console.error(error); } 
    finally { setIsCommentsLoading(false); }
  };

  const fetchRelatedData = async () => {
    try {
      const endpoints = [`${baseURL}fashionpost/${item._id}/hotrelated`, `${baseURL}buildings/${item._id}/hotrelated`, `${baseURL}shops/${item._id}/hotrelated` ];
      const res = await Promise.all(endpoints.map(u => fetch(u)));
      const data = await Promise.all(res.map(r => r.ok ? r.json() : []));
      setRelatedProducts(data.flat());
    } catch (err) { console.warn(err); } 
    finally { setLoadingRelated(false); }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    setIsActionLoading(true);
    let type = item.type?.toLowerCase() === 'fashion' ? 'comment' : item.type?.toLowerCase() === 'building' ? 'buidingcomment' : 'shopcomment';
    try {
      const response = await fetch(`${baseURL}${type}/${item._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myProducts, content: comment })
      });
      if (response.ok) { setComment(''); fetchComments(item._id); setCommentLimit(3); }
    } catch (e) { console.log(e); }
    finally { setIsActionLoading(false); }
  };

  const saveEditComment = async (commentId) => {
    let endpoint;
    const itemType = item?.type?.toLowerCase();
    switch (itemType) {
      case 'fashion': endpoint = `${baseURL}comment/comments/${commentId}`; break;
      case 'building': endpoint = `${baseURL}buidingcomment/comments/${commentId}`; break;
      case 'shop': endpoint = `${baseURL}shopcomment/comments/${commentId}`; break;
      default: return;
    }
    setIsActionLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      });
      if (response.ok) { setEditingCommentId(null); setEditingContent(''); await fetchComments(item._id); }
    } catch (error) { console.error(error); } 
    finally { setIsActionLoading(false); }
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert("Delete Comment", "Are you sure you want to remove this message?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
          let endpoint;
          const itemType = item?.type?.toLowerCase();
          switch (itemType) {
            case 'fashion': endpoint = `${baseURL}comment/comments/${commentId}`; break;
            case 'building': endpoint = `${baseURL}buidingcomment/comments/${commentId}`; break;
            case 'shop': endpoint = `${baseURL}shopcomment/comments/${commentId}`; break;
            default: return;
          }
          setIsActionLoading(true);
          try {
            const response = await fetch(endpoint, { method: 'DELETE' });
            if (response.ok) await fetchComments(item._id);
          } catch (error) { console.error(error); } 
          finally { setIsActionLoading(false); }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomMediaCarousel data={images} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={styles.mainScroll}>
          
          <View style={styles.infoSection}>
            <View style={styles.badgeRow}>
              <Text style={styles.conditionBadge}>{item?.condition?.toUpperCase()}</Text>
              {item.discount > 0 && <Text style={styles.discountBadge}>{item.discount}% OFF</Text>}
            </View>
            
            <Text style={styles.productTitle}>{item.name}</Text>

            <View style={styles.priceContainer}>
                {item?.discount && item?.price ? (
                    <View style={styles.priceRow}>
                        <View>
                           <Text style={styles.oldPriceLabel}>Original Price</Text>
                           <Text style={styles.oldPriceText}>Gh₵{item.price}</Text>
                        </View>
                        <MaterialIcons name="arrow-forward" size={18} color="#ddd" style={{marginHorizontal: 12, marginTop: 12}} />
                        <View>
                           <Text style={styles.newPriceLabel}>Promo Price</Text>
                           <Text style={styles.newPriceText}>Gh₵{(item.price - (item.price * item.discount) / 100).toFixed(2)}</Text>
                        </View>
                    </View>
                ) : (
                    <View>
                        {item.price ? <Text style={styles.soloPrice}>Gh₵{item.price}</Text> : (
                            <View style={styles.callForPrice}>
                               <Feather name="info" size={16} color="#f5a53d" />
                               <Text style={styles.callForPriceText}>Call for pricing</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {item.discount > 0 && (
                <View style={styles.savingsBanner}>
                    <Ionicons name="sparkles" size={16} color="green" />
                    <Text style={styles.savingsText}>You save Gh₵{(item?.price * item?.discount / 100).toFixed(2)}</Text>
                </View>
            )}

            <View style={styles.locationRow}>
                <MaterialIcons name="location-pin" size={16} color="#999" />
               <Text numberOfLines={1} style={styles.locationText}>
                  {(item.region || item.product?.region)?.trim()}, {(item.town || item.product?.town)?.trim()}, {(item.location || item.product?.location)?.trim()}
                </Text>
            </View>

            <View style={styles.descriptionBox}>
                <Text style={styles.sectionTitle}>Details</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)} style={[styles.actionBtn, {backgroundColor: '#1b5e20'}]}>
              <Feather name="phone" size={18} color="#fff" />
              <Text style={[styles.actionLabel, {color: '#fff'}]}>Call Seller</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp}`)} style={[styles.actionBtn, {backgroundColor: '#25D366'}]}>
              <FontAwesome name="whatsapp" size={18} color="#fff" />
              <Text style={[styles.actionLabel, {color: '#fff'}]}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* REFACTORED COMMENT SECTION */}
          <View style={styles.commentSection}>
            <Text style={styles.sectionTitle}>Questions & Messages</Text>
            <View style={styles.commentInputWrapper}>
                <TextInput 
                  placeholder="Ask the seller a question..." 
                  value={comment} 
                  onChangeText={setComment} 
                  style={styles.textInput} 
                  editable={!isActionLoading} 
                />
                <TouchableOpacity 
                  onPress={handlePostComment} 
                  disabled={!comment.trim() || isActionLoading} 
                  style={[styles.sendIconCircle, !comment.trim() && {backgroundColor: '#ccc'}]}
                >
                  <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {isCommentsLoading ? <ActivityIndicator color="#f5a53d" style={{marginTop: 10}} /> : (
                <View>
                {comments.slice(0, commentLimit).map((cmt) => (
                    <View key={cmt._id} style={styles.commentCard}>
                        <View style={styles.commentHeader}>
                            <View style={styles.userAvatar}>
                              <Text style={styles.avatarText}>{cmt.user?.name?.charAt(0) || "U"}</Text>
                            </View>
                            <View style={{flex: 1, marginLeft: 10}}>
                              <Text style={styles.userName}>{cmt.user?.name || "Anonymous"}</Text>
                              <Text style={styles.commentTime}>Just now</Text> 
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
                                      <Text style={styles.updateBtnText}>Update</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                          <View>
                            <Text style={styles.commentText}>{cmt.content}</Text>
                            {cmt.user?._id === myProducts && (
                              <View style={styles.professionalActionRow}>
                                <TouchableOpacity 
                                  onPress={() => { setEditingCommentId(cmt._id); setEditingContent(cmt.content); }}
                                  style={styles.iconBtn}
                                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                >
                                    <Feather name="edit-2" size={14} color="#666" />
                                    <Text style={styles.iconBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <View style={styles.verticalSeparator} />
                                <TouchableOpacity 
                                  onPress={() => handleDeleteComment(cmt._id)}
                                  style={styles.iconBtn}
                                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                >
                                    <Feather name="trash-2" size={14} color="#ff5252" />
                                    <Text style={[styles.iconBtnText, {color: '#ff5252'}]}>Delete</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                    </View>
                ))}
                {comments.length > commentLimit && (
                    <TouchableOpacity onPress={() => setCommentLimit(prev => prev + 3)} style={styles.loadMoreBtn}>
                        <Text style={styles.loadMoreText}>View more comments</Text>
                    </TouchableOpacity>
                )}
                </View>
            )}
          </View>

          <View style={styles.relatedSection}>
            
            <View style={styles.relatedGrid}>
                {loadingRelated ? <ActivityIndicator color="#f5a53d" /> : relatedProducts.map((prod, index) => (
                <TouchableOpacity key={index} style={styles.relatedCard} onPress={() => { navigation.setParams(prod); scrollViewRef.current?.scrollTo({ y: 0, animated: true }); }}>
                    <Image source={{ uri: prod.picture }} style={styles.relatedImg} />
                    <View style={styles.relatedInfo}>
                        <Text numberOfLines={1} style={styles.relatedTitle}>{prod.name}</Text>
                        <Text style={styles.relatedPrice}>Gh₵{prod.price}</Text>
                        <Text numberOfLines={1} style={styles.locationText}>
                        {(item.region || item.product?.region)?.trim()}, {(item.town || item.product?.town)?.trim()},{(item.location || item.product?.location)?.trim()}
                      </Text>
                    </View>
                </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainScroll: { paddingHorizontal: 20 },
  carouselItem: { width, justifyContent: "center", alignItems: "center" },
  mediaItem: { width: width - 40, height: height / 3, borderRadius: 16, backgroundColor: '#f0f0f0' },
  paginationDots: { flexDirection: 'row', alignSelf: 'center', marginTop: -25 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#f5a53d', width: 12 },
  infoSection: { marginTop: 20 },
  badgeRow: { flexDirection: 'row', marginBottom: 6 },
  conditionBadge: { backgroundColor: '#333', color: '#fff', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, marginRight: 6 },
  discountBadge: { backgroundColor: '#fff3e0', color: '#f5a53d', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  productTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  priceContainer: { marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  oldPriceLabel: { fontSize: 10, color: '#999', fontWeight: '600' },
  oldPriceText: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },
  newPriceLabel: { fontSize: 10, color: '#f5a53d', fontWeight: 'bold' },
  newPriceText: { fontSize: 22, fontWeight: 'bold', color: '#f5a53d' },
  soloPrice: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  callForPrice: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#fef7e0', borderRadius: 6 },
  callForPriceText: { marginLeft: 6, color: '#795548', fontWeight: '700', fontSize: 12 },
  savingsBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 6, borderRadius: 6, marginBottom: 10 },
  savingsText: { marginLeft: 6, color: '#2e7d32', fontSize: 12, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  locationText: { color: '#888', fontSize: 12, marginLeft: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 10 },
  descriptionText: { fontSize: 14, color: '#444', lineHeight: 21 },
  descriptionBox: { marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
  actionLabel: { marginLeft: 8, fontWeight: 'bold', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 20 },
  
  // Comment Section Styles
  commentSection: { marginBottom: 25 },
  commentInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingLeft: 15, paddingRight: 5, paddingVertical: 6, marginBottom: 20 },
  textInput: { flex: 1, height: 40, fontSize: 14, color: '#333' },
  sendIconCircle: { backgroundColor: '#f5a53d', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  commentCard: { backgroundColor: '#fff', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f4f4f4' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  avatarText: { fontWeight: 'bold', color: '#888', fontSize: 12 },
  userName: { fontWeight: '700', color: '#333', fontSize: 14 },
  commentTime: { fontSize: 10, color: '#bbb', marginTop: 1 },
  commentText: { color: '#444', fontSize: 14, lineHeight: 20, marginBottom: 10, paddingLeft: 2 },
  
  // Professional Buttons Row
  professionalActionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  iconBtnText: { fontSize: 12, color: '#777', marginLeft: 5, fontWeight: '600' },
  verticalSeparator: { width: 1, height: 12, backgroundColor: '#ddd', marginHorizontal: 15 },
  
  editContainer: { marginTop: 5 },
  editInput: { backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#f5a53d', borderRadius: 8, padding: 10, fontSize: 14, color: '#333', textAlignVertical: 'top' },
  editActionRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 },
  cancelLink: { color: '#999', marginRight: 20, fontSize: 13, fontWeight: '600' },
  smallUpdateBtn: { backgroundColor: '#333', paddingHorizontal: 18, paddingVertical: 7, borderRadius: 6 },
  updateBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  
  loadMoreBtn: { padding: 12, alignSelf: 'center', marginTop: 10 },
  loadMoreText: { color: '#f5a53d', fontWeight: 'bold', fontSize: 13 },
  
  relatedSection: { paddingBottom: 80, },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  relatedCard: { width: ITEM_WIDTH, marginBottom: 15, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#f0f0f0' },
  relatedImg: { width: '100%', height: ITEM_WIDTH, resizeMode: 'cover' },
  relatedInfo: { padding: 6 },
  relatedTitle: { fontSize: 10, fontWeight: '700', color: '#333' },
  relatedPrice: { fontSize: 10, color: '#f5a53d', fontWeight: '800' },
});