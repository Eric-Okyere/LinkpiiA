import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import { useVideoPlayer, VideoView } from 'expo-video';
import { 
  MaterialCommunityIcons, 
  Entypo, 
  EvilIcons, 
  MaterialIcons, 
  FontAwesome5, 
  FontAwesome, 
  AntDesign, 
  Feather,
  Ionicons 
} from "@expo/vector-icons";
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
  Pressable,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

// --- Modern Video Player for Carousel ---
const CarouselVideo = ({ uri, isActive }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    isActive ? player.play() : player.pause();
  });

  useEffect(() => {
    isActive ? player.play() : player.pause();
  }, [isActive, player]);

  return <VideoView player={player} style={styles.carouselMedia} contentMode="cover" />;
};

// --- Custom Media Carousel ---
function CustomMediaCarousel({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const totalItems = data.length;

  useEffect(() => {
    if (totalItems <= 1) return;
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % totalItems;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, totalItems]);

  const onScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      >
        {data.map((item, idx) => (
          <View key={idx} style={{ width }}>
            {item.type === 'video' ? (
              <CarouselVideo uri={item.uri} isActive={currentIndex === idx} />
            ) : (
              <Image source={{ uri: item.uri }} style={styles.carouselMedia} resizeMode="cover" />
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: currentIndex === i ? '#f5a53d' : 'rgba(255,255,255,0.5)', width: currentIndex === i ? 18 : 7 }]} />
        ))}
      </View>
    </View>
  );
}

function AdminShop({ route }) {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [media, setMedia] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState(3);
  const [visibleCommentsec, setVisibleCommentsec] = useState(3);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [commentsec, setCommentsec] = useState([]);

  const navigation = useNavigation();
  const myProducts = useSelector((state) => state);
  const item = route.params;

  useEffect(() => {
    fetchComments();
    fetchUserData();
    
    const tempMedia = [
      { type: 'image', uri: item.picture },
      { type: 'image', uri: item.picturesec },
    ].filter(m => m.uri);
    if (item.video) tempMedia.push({ type: 'video', uri: item.video });
    setMedia(tempMedia);
  }, [item._id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${myProducts.user}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone });
    } catch (error) { console.error(error); }
  };

  const fetchComments = async () => {
    try {
      const [comRes, secRes] = await Promise.all([
        fetch(`${baseURL}shopcomment/comments/${item._id}`),
        fetch(`${baseURL}shopviewers/comments/${item._id}`)
      ]);
      const comData = await comRes.json();
      const secData = await secRes.json();
      setComments(comData.comments || []);
      setCommentsec(secData.commentsec || []);
    } catch (e) { console.error(e); }
    finally { setIsCommentsLoading(false); }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    const res = await fetch(`${baseURL}shopcomment/${item._id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: myProducts.user, content: comment })
    });
    if (res.ok) {
      setComment('');
      fetchComments();
    }
  };

  const openDial = () => Linking.openURL(`tel:${item.phone}`);
  const openWhatsapp = () => Linking.openURL(`https://wa.me/${item.whatsapp}`);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.headerAction}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={24} color="#333" />
          <Text style={styles.headerTitle}>Shop Admin View</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomMediaCarousel data={media} />

        <View style={styles.contentPadding}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainTitle}>{item.name}</Text>
              <Text style={styles.categoryText}>Verified Product</Text>
            </View>
            <Text style={styles.priceTag}>Gh¢{item.price}</Text>
          </View>

          <View style={styles.divider} />

          {/* Contact Details Card */}
          <Text style={styles.sectionHeader}>Contact Information</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactRow} onPress={openDial}>
              <View style={[styles.contactIconBg, { backgroundColor: '#e8f5e9' }]}>
                <Feather name="phone" size={18} color="#2e7d32" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactLabel}>Phone Number</Text>
                <Text style={styles.contactValue}>{item.phone || 'N/A'}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.innerDivider} />

            <TouchableOpacity style={styles.contactRow} onPress={openWhatsapp}>
              <View style={[styles.contactIconBg, { backgroundColor: '#e1f5fe' }]}>
                <FontAwesome name="whatsapp" size={20} color="#0288d1" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactLabel}>WhatsApp Message</Text>
                <Text style={styles.contactValue}>{item.whatsapp || 'N/A'}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          {/* Location Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Entypo name="location" size={18} color="#f5a53d" />
              <Text style={styles.infoText}>Region: <Text style={{ fontWeight: '700' }}>{item.region}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="storefront" size={18} color="#f5a53d" />
              <Text style={styles.infoText}>Town: <Text style={{ fontWeight: '700' }}>{item.town}</Text></Text>
            </View>
          </View>

          {/* Internal Discussion */}
          <Text style={styles.sectionHeader}>Admin Discussion</Text>
          <View style={styles.commentInputRow}>
            <TextInput
              placeholder="Add a note..."
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handlePostComment} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {isCommentsLoading ? <ActivityIndicator style={{ marginTop: 20 }} color="#f5a53d" /> : (
            comments.slice(0, visibleComments).map((com) => (
              <View key={com._id} style={styles.commentBubble}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{com.user?.name || 'User'}</Text>
                  <Text style={styles.commentDate}>{formatDate(com.dateCreated)}</Text>
                </View>
                <Text style={styles.commentBody}>{com.content}</Text>
              </View>
            ))
          )}

          {visibleComments < comments.length && (
            <TouchableOpacity onPress={() => setVisibleComments(v => v + 3)} style={styles.loadMore}>
              <Text style={styles.loadMoreText}>Load More Comments</Text>
            </TouchableOpacity>
          )}

          {/* Viewers/Leads */}
          <Text style={styles.sectionHeader}>Interested Viewer Leads</Text>
          {commentsec.length > 0 ? (
            commentsec.slice(0, visibleCommentsec).map((lead, index) => (
              <View key={lead._id} style={styles.leadCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.leadPhone}>{index + 1}. {lead.content}</Text>
                  <Text style={styles.leadDate}>Captured: {formatDate(lead.dateCreated)}</Text>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${lead.content}`)} style={styles.callCircle}>
                  <Feather name="phone-call" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No viewer leads recorded yet.</Text>
          )}
        </View>
      </ScrollView>

      {/* Basic Delete Modal */}
      <RNModal transparent visible={deleteCommentId !== null} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Delete Note?</Text>
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setDeleteCommentId(null)} style={styles.modalCancel}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalDelete}><Text style={{ color: 'white' }}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  headerAction: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { marginLeft: 15, fontSize: 16, fontWeight: '700', color: '#333' },
  carouselContainer: { height: height * 0.35, width: width },
  carouselMedia: { width: width, height: height * 0.35 },
  pagination: { position: 'absolute', bottom: 15, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 6, borderRadius: 20 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  contentPadding: { padding: 20 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  categoryText: { fontSize: 12, color: '#f5a53d', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 2 },
  priceTag: { fontSize: 18, fontWeight: '900', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 20 },
  sectionHeader: { fontSize: 16, fontWeight: '800', marginTop: 25, marginBottom: 12, color: '#333' },
  contactCard: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#eee', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  contactIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 11, color: '#999', fontWeight: '500' },
  contactValue: { fontSize: 15, fontWeight: '700', color: '#333' },
  innerDivider: { height: 1, backgroundColor: '#f9f9f9', marginHorizontal: 15 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  infoCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, marginTop: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  infoText: { marginLeft: 12, color: '#444' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 5 },
  input: { flex: 1, height: 40, color: '#333' },
  sendBtn: { backgroundColor: '#f5a53d', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  commentBubble: { padding: 12, borderRadius: 12, marginTop: 10, backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#f1f1f1' },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentAuthor: { fontWeight: 'bold', fontSize: 13, color: '#444' },
  commentDate: { fontSize: 10, color: '#bbb' },
  commentBody: { color: '#555', fontSize: 14 },
  loadMore: { marginTop: 10, alignItems: 'center' },
  loadMoreText: { color: '#f5a53d', fontWeight: '700', fontSize: 13 },
  leadCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  leadPhone: { fontWeight: '700', color: '#333' },
  leadDate: { fontSize: 11, color: '#999' },
  callCircle: { backgroundColor: '#2ecc71', padding: 8, borderRadius: 20 },
  emptyText: { color: '#bbb', fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  modalCancel: { padding: 10 },
  modalDelete: { backgroundColor: '#ff4757', padding: 10, borderRadius: 8, paddingHorizontal: 20 }
});

export default AdminShop;