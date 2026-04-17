import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  ScrollView, 
  Platform, 
  Linking, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  
  Entypo, 
  Feather, 
  FontAwesome, 
  AntDesign,
  Ionicons,
  EvilIcons
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useVideoPlayer, VideoView } from 'expo-video';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

// --- Modern Video Component ---
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

// --- Auto-Changing Carousel ---
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
    }, 4500);
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
          <View key={i} style={[styles.dot, { backgroundColor: currentIndex === i ? '#f5a53d' : 'rgba(255,255,255,0.5)', width: currentIndex === i ? 20 : 8 }]} />
        ))}
      </View>
    </View>
  );
}

function EquipAdminSig({ route }) {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [media, setMedia] = useState([]);
  const myProducts = useSelector((state) => state);
  const navigation = useNavigation();
  const item = route.params;

  useEffect(() => {
    fetchUserData();
    const tempMedia = [
      { type: 'image', uri: item.picture },
      { type: 'image', uri: item.picturesec },
    ].filter(m => m.uri);
    
    if (item.video) tempMedia.push({ type: 'video', uri: item.video });
    setMedia(tempMedia);
  }, [item]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${myProducts.user}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const openDial = async () => {
    try {
      await fetch(`${baseURL}call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name, email: userData.email, phone: userData.phone,
          receiverphone: item.phone, recname: item.name
        })
      });
      Linking.openURL(`tel:${item.phone}`);
    } catch (e) { console.error(e); }
  };

  const openWhatsapp = async () => {
    try {
      await fetch(`${baseURL}whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name, email: userData.email, phone: userData.phone,
          receiverphone: item.whatsapp, recname: item.name
        })
      });
      Linking.openURL(`https://wa.me/${item.whatsapp}`);
    } catch (e) { console.error(e); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("equipmana")} style={styles.backBtn}>
           <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerText}>Equipment Details</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomMediaCarousel data={media} />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.categoryLabel}>Verified Equipment</Text>
            </View>
            <Text style={styles.priceText}>Gh¢{item.price}</Text>
          </View>

          <View style={styles.divider} />

          {/* Contact Details Card */}
          <Text style={styles.sectionTitle}>Vendor Contacts</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem} onPress={openDial}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <Feather name="phone" size={18} color="#2E7D32" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactLabel}>Phone Number</Text>
                <Text style={styles.contactValue}>{item.phone || 'N/A'}</Text>
              </View>
              <Entypo name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>

            <View style={styles.innerDivider} />

            <TouchableOpacity style={styles.contactItem} onPress={openWhatsapp}>
              <View style={[styles.iconBox, { backgroundColor: '#E1F5FE' }]}>
                <FontAwesome name="whatsapp" size={20} color="#0288D1" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>{item.whatsapp || 'N/A'}</Text>
              </View>
              <Entypo name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>{item.description}</Text>

          <View style={styles.locationBox}>
            <View style={styles.locRow}>
              <Entypo name="location" size={16} color="#f5a53d" />
              <Text style={styles.locText}> Region: {item.region}</Text>
            </View>
            <View style={styles.locRow}>
              <Entypo name="location-pin" size={16} color="#f5a53d" />
              <Text style={styles.locText}> Town: {item.town}</Text>
            </View>
            <View style={styles.locRow}>
              <EvilIcons name="location" size={18} color="#f5a53d" />
              <Text style={styles.locText}> Location: {item.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingBottom: 90, bottom: 20 },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', flexDirection: 'row', alignItems: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerText: { marginLeft: 15, fontWeight: '700', fontSize: 16 },
  carouselContainer: { height: height * 0.35, width: width },
  carouselMedia: { width: width, height: height * 0.35 },
  pagination: { position: 'absolute', bottom: 15, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 6, borderRadius: 20 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  content: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  categoryLabel: { fontSize: 12, color: '#f5a53d', fontWeight: 'bold', textTransform: 'uppercase' },
  priceText: { fontSize: 20, fontWeight: '900', color: '#2C3E50' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12, color: '#333' },
  contactCard: { backgroundColor: '#FFF', borderRadius: 15, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 11, color: '#999', fontWeight: '500' },
  contactValue: { fontSize: 14, fontWeight: '700', color: '#333' },
  innerDivider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 15 },
  descText: { fontSize: 14, color: '#666', lineHeight: 22 },
  locationBox: { marginTop: 20, padding: 15, backgroundColor: '#F9F9F9', borderRadius: 12 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  locText: { color: '#444', fontSize: 14 }
});

export default EquipAdminSig;