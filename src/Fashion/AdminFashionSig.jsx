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
  Pressable,
} from 'react-native';
import {
  Entypo,
  MaterialIcons,
  FontAwesome,
  Feather, AntDesign
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

// --- Professional Carousel ---
const CustomMediaCarousel = ({ data, activeIndex }) => {
  const scrollRef = useRef(null);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {data.map((item, idx) => (
          <View key={idx} style={styles.mediaFrame}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.mediaMain} resizeMode="cover" />
            ) : (
              <VideoPlayerItem uri={item.uri} isVisible={idx === activeIndex} />
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

const VideoPlayerItem = ({ uri, isVisible }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    if (isVisible) player.play();
  });

  useEffect(() => {
    if (isVisible) player.play();
    else player.pause();
  }, [isVisible, player]);

  return <VideoView style={styles.mediaMain} player={player} allowsFullscreen={false} />;
};

// --- Main Page ---
const AdminFashionSig = ({ route }) => {
  const item = route.params;
  const navigation = useNavigation();
  const myProducts = useSelector((state) => state.user);

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsec, setCommentsec] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState(2);
  const [visibleCommentsec, setVisibleCommentsec] = useState(2);
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  useEffect(() => {
    const media = [
      { type: 'image', uri: item.picture },
      { type: 'image', uri: item.picturesec },
    ];
    if (item.video) media.push({ type: 'video', uri: item.video });
    setImages(media);
    fetchComments();
  }, [item._id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${baseURL}comment/comments/${item._id}`);
      const data = await res.json();
      setComments(data.comments || []);

      const resSec = await fetch(`${baseURL}viewers/comments/${item._id}`);
      const dataSec = await resSec.json();
      setCommentsec(dataSec.commentsec || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await fetch(`${baseURL}comment/${item._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myProducts, content: comment })
      });
      if (response.ok) {
        setComment('');
        fetchComments();
      }
    } catch (e) { console.error(e); }
  };

  const saveEditComment = async (id) => {
    try {
      const response = await fetch(`${baseURL}comment/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      });
      if (response.ok) {
        setEditingCommentId(null);
        fetchComments();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteComment = async (id) => {
    try {
      const response = await fetch(`${baseURL}comment/comments/${id}`, { method: 'DELETE' });
      if (response.ok) fetchComments();
    } catch (e) { console.error(e); }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Header Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
         <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.topNavText}>Product Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <CustomMediaCarousel 
          data={images} 
          activeIndex={currentIndex} 
        />

        <View style={styles.contentBody}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.conditionTag}>{item.condition}</Text>
            </View>
            <Text style={styles.priceText}>Gh₵{item.price?.toLocaleString()}</Text>
          </View>

          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <MaterialIcons name="local-offer" size={14} color="#FFF" />
              <Text style={styles.discountText}>{item.discount}% OFF - Limited Time</Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Entypo name="location-pin" size={18} color="#f5a53d" />
              <Text style={styles.infoText}>{item.region}, {item.town}, {item.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="phone" size={16} color="green" />
              <Text style={styles.infoText}>{item.phone}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="whats-app" size={24} color="green" />
              <Text style={styles.infoText}>{item.whatsapp}</Text>
              </View>
            </View>
          </View>

          {/* Contact Row */}
          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
              <FontAwesome name="phone" size={20} color="#FFF" />
              <Text style={styles.btnText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.waBtn} onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp}`)}>
              <FontAwesome name="whatsapp" size={20} color="#FFF" />
              <Text style={styles.btnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Buyer Comments</Text>
          <View style={styles.commentInputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="Write a reply..."
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity onPress={handlePostComment} disabled={!comment.trim()}>
              <MaterialIcons name="send" size={24} color={comment.trim() ? "#f5a53d" : "#CCC"} />
            </TouchableOpacity>
          </View>

          {isCommentsLoading ? <ActivityIndicator color="#f5a53d" /> : (
            comments.slice(0, visibleComments).map((c) => (
              <View key={c._id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{c.user?.name || 'User'}</Text>
                  <Text style={styles.commentDate}>{formatDate(c.dateCreated)}</Text>
                </View>

                {editingCommentId === c._id ? (
                  <View>
                    <TextInput
                      style={styles.editingInput}
                      value={editingContent}
                      onChangeText={setEditingContent}
                    />
                    <TouchableOpacity onPress={() => saveEditComment(c._id)}>
                      <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.commentText}>{c.content}</Text>
                )}

                {c.user?._id === myProducts && (
                  <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => { setEditingCommentId(c._id); setEditingContent(c.content); }}>
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDeleteCommentId(c._id)}>
                      <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}

          {/* Interested Viewers */}
          {/* <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Interested Viewers</Text>
          {commentsec.slice(0, visibleCommentsec).map((v, i) => (
            <View key={v._id} style={styles.viewerCard}>
              <Text style={styles.viewerIndex}>{i + 1}. Visitor</Text>
              <Text style={styles.viewerDate}>{formatDate(v.dateCreated)}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${v.content}`)}>
                 <Feather name="phone-call" size={18} color="#00bb2d" />
              </TouchableOpacity>
            </View>
          ))} */}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <RNModal visible={deleteCommentId !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Remove Comment?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteCommentId(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => { handleDeleteComment(deleteCommentId); setDeleteCommentId(null); }}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topNav: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 50 : 20, 
    paddingBottom: 15,
    backgroundColor: '#FFF'
  },
  topNavText: { fontSize: 18, fontWeight: '700', marginLeft: 15 },
  carouselContainer: { width, height: height / 3, backgroundColor: '#F0F0F0' },
  mediaFrame: { width, height: height / 3, justifyContent: 'center', alignItems: 'center' },
  mediaMain: { width: width - 40, height: height / 3.2, borderRadius: 15 },
  indicatorContainer: { position: 'absolute', bottom: 15, flexDirection: 'row', alignSelf: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CCC', marginHorizontal: 4 },
  activeDot: { width: 12, backgroundColor: '#f5a53d' },

  contentBody: { padding: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', width: '70%' },
  conditionTag: { fontSize: 12, color: '#f5a53d', fontWeight: '600', marginTop: 4 },
  priceText: { fontSize: 20, fontWeight: '700', color: '#333' },
  
  discountBadge: { 
    backgroundColor: '#FF4D4D', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 5, 
    marginTop: 10, 
    alignSelf: 'flex-start' 
  },
  discountText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 5 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  
  infoCard: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, marginTop: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' },
  infoText: { fontSize: 14, color: '#444', marginLeft: 10, fontWeight: '500' },

  contactContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  callBtn: { flex: 0.48, backgroundColor: '#000', height: 50, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  waBtn: { flex: 0.48, backgroundColor: '#00bb2d', height: 50, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: '700', marginLeft: 10, fontSize: 16 },

  commentInputBox: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F2F5', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    alignItems: 'center', 
    height: 45, 
    marginBottom: 20 
  },
  inputField: { flex: 1, fontSize: 14 },
  commentItem: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingVertical: 15, marginBottom:50 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentUser: { fontWeight: '700', fontSize: 14 },
  commentDate: { fontSize: 11, color: '#999' },
  commentText: { fontSize: 14, color: '#555' },
  commentActions: { flexDirection: 'row', marginTop: 10 },
  actionText: { fontSize: 12, color: '#f5a53d', fontWeight: '600', marginRight: 15 },

  viewerCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F9F9F9', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 120, 
    paddingBottom: 80
  },
  viewerIndex: { fontSize: 14, fontWeight: '600' },
  viewerDate: { fontSize: 12, color: '#888' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', padding: 25, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelBtn: { flex: 0.45, padding: 12, alignItems: 'center' },
  deleteBtn: { flex: 0.45, backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, alignItems: 'center' },
  deleteBtnText: { color: '#FFF', fontWeight: '700' },
  cancelBtnText: { color: '#666', fontWeight: '700' }
});

export default AdminFashionSig;