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
  BackHandler,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import {
  Entypo,
  Feather,
  FontAwesome5,
  MaterialIcons,
  AntDesign
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

// Utility for auto-play timing
const scheduleTask = (callback) => {
  if (global.requestIdleCallback) return global.requestIdleCallback(callback);
  return setTimeout(callback, 1);
};

// Video Player Component
function VideoPlayer({ uri, isActive }) {
  const player = useVideoPlayer(uri, (p) => { 
    p.loop = true; 
  });

  useEffect(() => {
    if (isActive) player.play();
    else player.pause();
  }, [isActive, player]);

  return <VideoView player={player} style={styles.mediaItem} contentFit="cover" />;
}

// Custom Media Carousel
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
          scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
          setCurrentIndex(nextIndex);
        }
      });
    }, 4500);
  }, [currentIndex, data, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
      >
        {data.map((item, idx) => (
          <View key={idx} style={styles.carouselItem}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.mediaItem} />
            ) : (
              <VideoPlayer uri={item.uri} isActive={idx === currentIndex} />
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.paginationDots}>
        {data.length > 1 && data.map((_, i) => (
          <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

export default function AdminServicesSig({ route }) {
  const item = route.params;
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    if (item?._id) fetchComments();
    
    // BACK HANDLER FIX: Use the .remove() method on the subscription
    const backAction = () => {
      navigation.navigate("servmana");
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const media = [];
    if (item.picture) media.push({ type: 'image', uri: item.picture });
    if (item.picturesec) media.push({ type: 'image', uri: item.picturesec });
    if (item.video) media.push({ type: 'video', uri: item.video });
    setImages(media);

    return () => backHandler.remove(); // This is the modern way to remove the listener
  }, [item]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${baseURL}userbyid/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserData({ name: data.name, email: data.email, phone: data.phone });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchComments = async () => {
    setIsCommentsLoading(true);
    try {
      const res = await fetch(`${baseURL}servicescomment/comments/${item._id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
      }
    } catch (e) { console.error(e); }
    finally { setIsCommentsLoading(false); }
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`${baseURL}servicescomment/${item._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: comment })
      });
      if (res.ok) {
        setComment('');
        fetchComments();
      }
    } catch (e) { console.error(e); }
    finally { setIsActionLoading(false); }
  };

  const deleteComment = (id) => {
    Alert.alert("Delete Comment", "Remove this message?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await fetch(`${baseURL}servicescomment/comments/${id}`, { method: 'DELETE' });
          fetchComments();
      }}
    ]);
  };

  const handleContact = (type) => {
    const destination = type === 'call' ? `tel:${item.phone}` : `https://wa.me/${item.whatsapp}`;
    Linking.openURL(destination);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#f5a53d" size="large" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("servmana")} style={styles.backBtn}>
        <Feather name="arrow-left" size={24} color="black" />
          <Text style={styles.headerTitle}>Admin Service View</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomMediaCarousel data={images} />

          <View style={styles.infoSection}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.priceText}>Contact for Pricing</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>

            <View style={styles.locationCard}>
              <View style={styles.locationRow}><Entypo name="location" size={16} color="#f5a53d" /><Text style={styles.locationText}>Region: {item.region}</Text></View>
              <View style={styles.locationRow}><Entypo name="location-pin" size={16} color="#f5a53d" /><Text style={styles.locationText}>Town: {item.town}</Text></View>
              <View style={styles.locationRow}><Entypo name="location-pin" size={16} color="#f5a53d" /><Text style={styles.locationText}>Area: {item.location}</Text></View>
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

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionCircle} onPress={() => handleContact('call')}><Feather name="phone-call" size={22} color="#07ed6b" /></TouchableOpacity>
              <TouchableOpacity style={styles.actionCircle} onPress={() => handleContact('whatsapp')}><FontAwesome5 name="whatsapp" size={24} color="#07ed6b" /></TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.commentContainer}>
              <Text style={styles.sectionHeading}>Messages</Text>
              <View style={styles.inputWrapper}>
                <TextInput placeholder="Leave a message..." value={comment} onChangeText={setComment} style={styles.input} />
                <TouchableOpacity onPress={postComment} disabled={isActionLoading || !comment.trim()} style={styles.sendBtn}>
                  <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {isCommentsLoading ? <ActivityIndicator color="#f5a53d" /> : comments.map((cmt) => (
                <View key={cmt._id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{cmt.user?.name?.[0] || 'U'}</Text></View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.userName}>{cmt.user?.name || "User"}</Text>
                      <Text style={styles.commentContent}>{cmt.content}</Text>
                    </View>
                    {cmt.user?._id === userId && (
                      <TouchableOpacity onPress={() => deleteComment(cmt._id)}><Feather name="trash-2" size={14} color="#ff5252" /></TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 15 },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  carouselWrapper: { width, height: height / 2.8 },
  carouselItem: { width, justifyContent: "center", alignItems: "center" },
  mediaItem: { width: width - 40, height: height / 3, borderRadius: 16, backgroundColor: '#f5f5f5' },
  paginationDots: { flexDirection: 'row', alignSelf: 'center', marginTop: -25 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.1)', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#f5a53d', width: 14 },
  infoSection: { padding: 20 },
  serviceName: { fontSize: 22, fontWeight: 'bold' },
  priceText: { fontSize: 16, color: '#f5a53d', fontWeight: 'bold', marginTop: 5 },
  descriptionText: { fontSize: 15, color: '#666', marginVertical: 15, lineHeight: 22 },
  locationCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { marginLeft: 10, color: '#444' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 25 },
  actionCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 30 },
  sectionHeading: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 25, paddingLeft: 15, paddingRight: 5, height: 45, marginBottom: 20 },
  input: { flex: 1, fontSize: 14 },
  sendBtn: { backgroundColor: '#f5a53d', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  commentCard: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f2f2f2' },
  commentHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', fontSize: 12 },
  userName: { fontWeight: 'bold', fontSize: 13 },
  commentContent: { fontSize: 14, color: '#555', marginTop: 2 },
  commentContainer:{
    marginBottom: 80
  },
    infoCard: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, marginTop: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' },
  infoText: { fontSize: 14, color: '#444', marginLeft: 10, fontWeight: '500' },

});