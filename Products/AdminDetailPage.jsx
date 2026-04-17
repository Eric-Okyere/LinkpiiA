import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../assets/common/BaseUrl';
import { useVideoPlayer, VideoView } from 'expo-video';
import { 
  Entypo, 
  MaterialIcons, 
  FontAwesome, 
  Feather, 
  Ionicons 
} from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
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
  StatusBar,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

// --- Reusable Video Component for Carousel ---
const CarouselVideo = ({ uri, isActive }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <VideoView 
      player={player} 
      style={styles.carouselMedia} 
      contentMode="cover" 
    />
  );
};

// --- Main Carousel Component ---
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
    }, 5000);

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
          <View 
            key={i} 
            style={[
              styles.dot, 
              { backgroundColor: currentIndex === i ? '#f5a53d' : 'rgba(255,255,255,0.5)', width: currentIndex === i ? 20 : 8 }
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const AdminDetail = ({ route }) => {
  const [media, setMedia] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [commentsec, setCommentsec] = useState([]);

  const navigation = useNavigation();
  const myProducts = useSelector((state) => state.user);
  const item = route.params;

  useEffect(() => {
    fetchData();
    
    const tempMedia = [];
    if (item.picture) tempMedia.push({ type: 'image', uri: item.picture });
    if (item.picturesec) tempMedia.push({ type: 'image', uri: item.picturesec });
    if (item.video) tempMedia.push({ type: 'video', uri: item.video });
    
    setMedia(tempMedia);
  }, [item._id]);

  const fetchData = async () => {
    try {
      const [comRes, secRes] = await Promise.all([
        fetch(`${baseURL}agriccomment/comments/${item._id}`),
        fetch(`${baseURL}productviewers/comments/${item._id}`)
      ]);
      const comData = await comRes.json();
      const secData = await secRes.json();
      setComments(comData.comments || []);
      setCommentsec(secData.commentsec || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    const res = await fetch(`${baseURL}agriccomment/${item._id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: myProducts, content: comment })
    });
    if (res.ok) {
      setComment('');
      fetchData();
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerAction}>
        <TouchableOpacity onPress={() => navigation.navigate('manage')} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Product Details</Text> */}
        {/* <TouchableOpacity style={styles.iconBtn}>
          <Feather name="share-2" size={22} color="#333" />
        </TouchableOpacity> */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, bottom:30 }}>
        <CustomMediaCarousel data={media} />

        <View style={styles.contentPadding}>
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainTitle}>{item.name}</Text>
              <Text style={styles.categoryText}>Admin View</Text>
            </View>
            <Text style={styles.priceTag}>Gh₵{item.price}</Text>
          </View>

          <View style={styles.customDivider} />

          {/* Contact Details Section */}
          <Text style={styles.sectionHeader}>Contact Information</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity 
                style={styles.contactRow} 
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
            >
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

            <TouchableOpacity 
                style={styles.contactRow} 
                onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp}`)}
            >
                <View style={[styles.contactIconBg, { backgroundColor: '#e1f5fe' }]}>
                    <FontAwesome name="whatsapp" size={20} color="#0288d1" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.contactLabel}>WhatsApp</Text>
                    <Text style={styles.contactValue}>{item.whatsapp || 'N/A'}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>About this item</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Entypo name="location-pin" size={20} color="#f5a53d" />
              <Text style={styles.infoText}>Region: <Text style={styles.boldText}>{item.region}</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="map" size={20} color="#f5a53d" />
              <Text style={styles.infoText}>Town: <Text style={styles.boldText}>{item.town}</Text></Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Internal Notes</Text>
          <View style={styles.commentInputRow}>
            <TextInput
              placeholder="Post a comment..."
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
            comments.map((com) => (
              <View key={com._id} style={styles.commentBubble}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{com.user?.name}</Text>
                  <Text style={styles.commentDate}>{new Date(com.dateCreated).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.commentBody}>{com.content}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff', marginBottom: 60 },
  headerAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', bottom: 30 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  iconBtn: { padding: 5 },
  carouselContainer: { height: height * 0.38, width: width },
  carouselMedia: { width: width, height: height * 0.38 },
  pagination: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 6, borderRadius: 15 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  contentPadding: { padding: 20 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  categoryText: { fontSize: 12, color: '#f5a53d', fontWeight: 'bold', textTransform: 'uppercase' },
  priceTag: { fontSize: 20, fontWeight: '900', color: '#2c3e50' },
  customDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  sectionHeader: { fontSize: 16, fontWeight: '800', marginTop: 25, marginBottom: 12, color: '#333' },
  contactCard: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#eee', paddingVertical: 5 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  contactIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 12, color: '#999', fontWeight: '500' },
  contactValue: { fontSize: 15, fontWeight: '700', color: '#333', marginTop: 1 },
  innerDivider: { height: 1, backgroundColor: '#f9f9f9', marginHorizontal: 15 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  infoCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, marginTop: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  infoText: { marginLeft: 10, color: '#444' },
  boldText: { fontWeight: 'bold', color: '#000' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 5 },
  input: { flex: 1, height: 40, color: '#333' },
  sendBtn: { backgroundColor: '#f5a53d', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  commentBubble: { padding: 12, borderRadius: 12, marginTop: 10, backgroundColor: '#fdfdfd', borderWidth: 1, borderColor: '#f1f1f1' },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  commentAuthor: { fontWeight: 'bold', fontSize: 13, color: '#444' },
  commentDate: { fontSize: 10, color: '#bbb' },
  commentBody: { color: '#555', fontSize: 14 }
});

export default AdminDetail;