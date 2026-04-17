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
  ActivityIndicator,
  Modal,
  SafeAreaView
} from 'react-native';
import { 
  Entypo, 
  Feather, 
  FontAwesome, 
  MaterialIcons, 
  AntDesign,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';

const { width, height } = Dimensions.get('window');

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
    }, 4500);
    return () => clearInterval(interval);
  }, [currentIndex, totalItems]);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {data.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.carouselMedia} resizeMode="cover" />
        ))}
      </ScrollView>
      
      <View style={styles.statusBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE LISTING</Text>
      </View>

      <View style={styles.pagination}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: currentIndex === i ? '#f5a53d' : 'rgba(255,255,255,0.5)', width: currentIndex === i ? 20 : 6 }]} />
        ))}
      </View>
    </View>
  );
}

function AdminRest({ route }) {
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [commentsec, setCommentsec] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  
  const myProducts = useSelector((state) => state.user);
  const navigation = useNavigation();
  const item = route.params;

  useEffect(() => {
    fetchUserData();
    fetchComments();
  }, [item._id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseURL}userbyid/${myProducts}`);
      const data = await response.json();
      setUserData({ name: data.name, email: data.email, phone: data.phone });
    } catch (error) { console.error(error); }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseURL}foodcomment/comments/${item._id}`);
      const data = await response.json();
      setCommentsec(data.commentsec || []);
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  const handleDeleteCommentsec = (id) => {
    setSelectedCommentId(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${baseURL}foodcomment/${item._id}/comments/${selectedCommentId}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchComments();
    } catch (error) { console.error(error); }
    finally { setIsDeleteModalVisible(false); }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("manarest")} style={styles.backBtn}>
           <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={fetchComments} style={styles.refreshBtn}>
           <Ionicons name="refresh" size={22} color="#f5a53d" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <CustomMediaCarousel data={[item.picture, item.picturesec].filter(Boolean)} />

        <View style={styles.content}>
          <View style={styles.mainInfoCard}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.catRow}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={14} color="#999" />
                  <Text style={styles.categoryLabel}>Restaurant & Dining</Text>
                </View>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Business Details</Text>
            <Text style={styles.descText}>{item.description}</Text>

            <View style={styles.locationBox}>
              <Entypo name="location-pin" size={18} color="#f5a53d" />
              <Text style={styles.locText}>{item.town}, {item.region}</Text>
            </View>
          </View>

          {/* Quick Contact View */}
          <View style={styles.contactRow}>
            <View style={styles.contactCard}>
              <Feather name="phone" size={18} color="#f5a53d" />
              <Text style={styles.contactValue}>{item.phone}</Text>
            </View>
            <View style={[styles.contactCard, { marginLeft: 10 }]}>
              <FontAwesome name="whatsapp" size={18} color="#25D366" />
              <Text style={styles.contactValue}>Support</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.leadsTitle}>Recent Lead Interests</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{commentsec.length}</Text>
            </View>
          </View>

          {isLoading ? (
            <ActivityIndicator color="#f5a53d" size="large" style={{ marginTop: 30 }} />
          ) : (
            commentsec.map((viewer, index) => (
              <View key={viewer._id} style={styles.viewerCard}>
                <View style={styles.viewerMain}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{index + 1}</Text>
                  </View>
                  <View style={styles.viewerDetails}>
                    <Text style={styles.viewerPhone}>{viewer.content}</Text>
                    <Text style={styles.viewerDate}>Interested on {formatDate(viewer.dateCreated)}</Text>
                  </View>
                </View>
                
                <View style={styles.viewerActions}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.callBtn]} 
                    onPress={() => Linking.openURL(`tel:${viewer.content}`)}
                  >
                    <Feather name="phone" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.deleteBtn]} 
                    onPress={() => handleDeleteCommentsec(viewer._id)}
                  >
                    <AntDesign name="delete" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {commentsec.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <Feather name="users" size={40} color="#CCC" />
              <Text style={styles.emptyText}>No viewer interests yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modern Delete Modal */}
      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.warningIcon}>
              <MaterialIcons name="delete-outline" size={30} color="#FF4D4D" />
            </View>
            <Text style={styles.modalTitle}>Delete Entry?</Text>
            <Text style={styles.modalSub}>Are you sure you want to remove this lead? This cannot be undone.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.cancelText}>Keep</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmDelete}>
                <Text style={styles.confirmText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFB' },
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16,
    backgroundColor: '#FFF'
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  backBtn: { padding: 4 },
  refreshBtn: { padding: 4 },
  carouselContainer: { height: height * 0.32, width: width },
  carouselMedia: { width: width, height: height * 0.32 },
  statusBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 6 },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  pagination: { position: 'absolute', bottom: 15, flexDirection: 'row', alignSelf: 'center' },
  dot: { height: 4, borderRadius: 2, marginHorizontal: 3 },
  
  content: { padding: 20 },
  mainInfoCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    marginTop: -40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  catRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  categoryLabel: { fontSize: 12, color: '#999', marginLeft: 4, fontWeight: '600' },
  priceBadge: { backgroundColor: '#FFF9F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#f5a53d' },
  priceText: { fontSize: 16, fontWeight: '800', color: '#f5a53d' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  descText: { fontSize: 14, color: '#666', lineHeight: 22 },
  locationBox: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  locText: { fontSize: 14, color: '#444', fontWeight: '600', marginLeft: 4 },
  
  contactRow: { flexDirection: 'row', marginTop: 15 },
  contactCard: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFF', 
    paddingVertical: 12, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  contactValue: { fontSize: 13, fontWeight: '700', marginLeft: 8, color: '#333' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  leadsTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  countBadge: { backgroundColor: '#f5a53d', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 10 },
  countText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  viewerCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  viewerMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontWeight: '800', color: '#f5a53d' },
  viewerPhone: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  viewerDate: { fontSize: 11, color: '#AAA', marginTop: 2 },
  viewerActions: { flexDirection: 'row' },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  callBtn: { backgroundColor: '#4CAF50' },
  deleteBtn: { backgroundColor: '#FF4D4D' },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 14, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 24, padding: 30, alignItems: 'center' },
  warningIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  modalSub: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', marginTop: 30, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  confirmBtn: { flex: 1, backgroundColor: '#FF4D4D', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelText: { fontWeight: '800', color: '#666' },
  confirmText: { fontWeight: '800', color: '#FFF' }
});

export default AdminRest;