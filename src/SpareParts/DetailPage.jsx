import React, { useEffect, useRef, useState } from 'react';
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
  Modal as RNModal,
  Image,
  StatusBar,
} from 'react-native';
import {
  Entypo,
  MaterialIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

const VideoPlayerItem = ({ uri, isVisible }) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    if (isVisible) p.play();
  });
  useEffect(() => {
    isVisible ? player.play() : player.pause();
  }, [isVisible, player]);
  return <VideoView style={styles.mediaMain} player={player} allowsFullscreen={false} contentFit="cover" />;
};

const DetailPage = ({ route }) => {
  const myProducts = useSelector((state) => state);
  const scrollViewRef = useRef(null);

  // --- Dynamic State ---
  const [localItem, setLocalItem] = useState(route.params);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState(2);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Edit/Delete States
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  useEffect(() => {
    const media = [
      { type: 'image', uri: localItem.picture },
      { type: 'image', uri: localItem.picturesec },
    ];
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
      setComments(data.comments || []);
    } catch (e) { console.error(e); }
    finally { setIsCommentsLoading(false); }
  };

  const fetchRelated = async (id) => {
    try {
      const res = await fetch(`${baseURL}sparepartsmainpost/${id}/related`);
      const data = await res.json();
      setRelatedProducts(data);
    } catch (e) { console.error(e); }
  };

  // --- Actions ---
  const handleRelatedProductPress = (product) => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setEditingCommentId(null); // Close any open edits
    setDeleteCommentId(null);  // Close any open delete modals
    setLocalItem(product);
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await fetch(`${baseURL}sparecomment/${localItem._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myProducts.user, content: comment })
      });
      if (response.ok) {
        setComment('');
        fetchComments(localItem._id);
      }
    } catch (e) { console.error(e); }
  };

  const saveEditComment = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}sparecomment/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      });
      if (response.ok) {
        setEditingCommentId(null);
        fetchComments(localItem._id);
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`${baseURL}sparecomment/comments/${deleteCommentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDeleteCommentId(null);
        fetchComments(localItem._id);
      }
    } catch (e) { console.error(e); }
  };

  const openDial = () => Linking.openURL(`tel:${localItem.phone}`);
  const openWhatsapp = () => Linking.openURL(`https://wa.me/${localItem.whatsapp}`);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
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
            <Text style={styles.productName}>{localItem.name}</Text>
            <Text style={styles.productPrice}>Gh₵{localItem.price?.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{localItem.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}><Entypo name="location" size={16} color="#f5a53d" /><Text style={styles.infoLabel}>Region: <Text style={styles.infoValue}>{localItem.region}</Text></Text></View>
            <View style={styles.infoRow}><Entypo name="location-pin" size={18} color="#f5a53d" /><Text style={styles.infoLabel}>Town: <Text style={styles.infoValue}>{localItem.town}</Text></Text></View>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionBtnOutline} onPress={openDial}>
              <Feather name="phone-call" size={18} color="#00bb2d" /><Text style={[styles.actionText, { color: '#00bb2d' }]}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnSolid} onPress={openWhatsapp}>
              <FontAwesome name="whatsapp" size={20} color="#FFF" /><Text style={[styles.actionText, { color: '#FFF' }]}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Reviews</Text>
          <View style={styles.commentInputBox}>
            <TextInput style={styles.inputField} placeholder="Leave a review..." value={comment} onChangeText={setComment} />
            <TouchableOpacity onPress={handlePostComment} disabled={!comment.trim()}>
              <MaterialIcons name="send" size={24} color={comment.trim() ? "#f5a53d" : "#CCC"} />
            </TouchableOpacity>
          </View>

          {isCommentsLoading ? <ActivityIndicator color="#f5a53d" /> : (
            comments.slice(0, visibleComments).map((c) => (
              <View key={c._id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{c.user?.name || 'Customer'}</Text>
                </View>

                {editingCommentId === c._id ? (
                  <View style={styles.editWrapper}>
                    <TextInput style={styles.editInput} value={editingContent} onChangeText={setEditingContent} multiline />
                    <View style={styles.editBtnRow}>
                      <TouchableOpacity onPress={() => setEditingCommentId(null)}><Text style={styles.cancelLink}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => saveEditComment(c._id)} style={styles.saveBtn}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={styles.commentText}>{c.content}</Text>
                    {c.user?._id === myProducts.user && (
                      <View style={styles.metaRow}>
                        <TouchableOpacity onPress={() => { setEditingCommentId(c._id); setEditingContent(c.content); }} style={styles.metaBtn}>
                          <Feather name="edit-2" size={12} color="#666" /><Text style={styles.metaText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDeleteCommentId(c._id)} style={styles.metaBtn}>
                          <Feather name="trash-2" size={12} color="red" /><Text style={[styles.metaText, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            ))
          )}

          {/* Related Products Grid */}
          <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Related Products</Text>
          <View style={styles.relatedGrid}>
            {relatedProducts.map((prod) => (
              <TouchableOpacity key={prod._id} style={styles.gridCard} onPress={() => handleRelatedProductPress(prod)}>
                <Image source={{ uri: prod.picture }} style={styles.gridImg} />
                <View style={styles.gridContent}>
                  <Text numberOfLines={1} style={styles.gridName}>{prod.name}</Text>
                  <Text style={styles.gridPrice}>Gh₵{prod.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Delete Modal */}
      <RNModal visible={deleteCommentId !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Comment?</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setDeleteCommentId(null)}><Text style={styles.modalCancel}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalDelBtn} onPress={handleDeleteComment}><Text style={styles.modalDelTxt}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  carouselContainer: { width, height: height * 0.35, backgroundColor: '#000' },
  mediaFrame: { width, height: height * 0.35 },
  mediaMain: { width: '100%', height: '100%' },
  indicatorContainer: { position: 'absolute', bottom: 15, flexDirection: 'row', alignSelf: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 4 },
  activeDot: { width: 15, backgroundColor: '#f5a53d' },
  contentBody: { padding: 20 },
  headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 20, fontWeight: '800', flex: 1 },
  productPrice: { fontSize: 18, fontWeight: '700', color: '#f5a53d' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22 },
  infoCard: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginTop: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoLabel: { fontSize: 13, color: '#888', marginLeft: 10 },
  infoValue: { color: '#333', fontWeight: '600' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  actionBtnOutline: { flex: 0.48, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: '#00bb2d', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionBtnSolid: { flex: 0.48, height: 48, borderRadius: 12, backgroundColor: '#00bb2d', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionText: { marginLeft: 8, fontWeight: '700' },
  commentInputBox: { flexDirection: 'row', backgroundColor: '#F5F7F9', borderRadius: 25, paddingHorizontal: 15, alignItems: 'center', height: 48, marginBottom: 20 },
  inputField: { flex: 1, fontSize: 14 },
  commentCard: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingVertical: 12 },
  commentHeader: { marginBottom: 4 },
  commentUser: { fontWeight: '700', fontSize: 13 },
  commentText: { fontSize: 14, color: '#555' },
  metaRow: { flexDirection: 'row', marginTop: 8 },
  metaBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  metaText: { fontSize: 12, marginLeft: 4, color: '#888' },
  editWrapper: { marginTop: 5, backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8 },
  editInput: { fontSize: 14, minHeight: 60, textAlignVertical: 'top' },
  editBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 },
  cancelLink: { color: '#888', marginRight: 15 },
  saveBtn: { backgroundColor: '#f5a53d', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  saveBtnText: { color: '#FFF', fontWeight: '700' },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: (width - 50) / 2, backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  gridImg: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  gridContent: { padding: 10 },
  gridName: { fontSize: 12, fontWeight: '700' },
  gridPrice: { fontSize: 13, color: '#f5a53d', fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 40 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  modalCancel: { color: '#888', marginRight: 20, fontWeight: '700' },
  modalDelBtn: { backgroundColor: 'red', padding: 8, borderRadius: 6 },
  modalDelTxt: { color: '#FFF', fontWeight: '700' }
});

export default DetailPage;