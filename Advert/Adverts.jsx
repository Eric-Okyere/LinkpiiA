import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Modal,
  Animated,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
  BackHandler,
  TextInput,
} from 'react-native';
import { 
  Feather, 
  FontAwesome5, 
  Ionicons, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import call from 'react-native-phone-call';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Network from 'expo-network';
import ConfettiCannon from "react-native-confetti-cannon";
import { loggedOut } from '../src/Redux/actions';
import PhoneInput from 'react-native-phone-number-input';

import baseURL from '../assets/common/BaseUrl';
import LikeButton from '../src/components/Drawer/LikeButton';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import HomeCarousel from '../src/components/HomeCarousel';
import theme from '../src/Styles/designSystem';

const { height, width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 3; 

// Mirrors the website's Home.jsx categoryFilters - same keys as the
// item.type tags already assigned to the merged fashion/building/shop
// list below, so filtering is a straight equality check.
const CATEGORY_FILTERS = [
  { key: 'all', label: 'Everything' },
  { key: 'fashion', label: 'Products' },
  { key: 'shop', label: 'Shops' },
  { key: 'building', label: 'Housing' },
];

// --- UTILS ---
const fetchWithTimeout = (url, options, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
  ]);
};

// --- CAROUSEL COMPONENT ---
function CustomMediaCarousel({ data, setSelectedItem, setIsModalVisible }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const autoPlayTimer = useRef(null);

  const startAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      if (data && data.length > 0) {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 4500);
  }, [currentIndex, data]);

  useEffect(() => {
    if (data && data.length > 1) {
      startAutoPlay();
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [startAutoPlay, data]);

  const onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) setCurrentIndex(index);
    startAutoPlay();
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onTouchStart={() => { if (autoPlayTimer.current) clearInterval(autoPlayTimer.current); }}
      >
        {data.map((item, idx) => (
          <View key={idx} style={styles.carouselSlide}>
            <View style={styles.carouselImgWrapper}>
              <Image source={{ uri: item.picture }} style={styles.carouselImg} resizeMode="stretch" />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedItem(item);
                  setIsModalVisible(true);
                }}
                style={styles.carouselCallBtn}
              >
                <Feather name="phone-call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// --- MAIN PAGE ---
export default function Adverts() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [combinedItems, setCombinedItems] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const [likedProducts, setLikedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  
  const navigation = useNavigation();

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setHasError(false);
    try {
      const netState = await Network.getNetworkStateAsync();
      if (!netState.isConnected || !netState.isInternetReachable) {
        throw new Error('Offline');
      }

      const [advertRes, fashionRes, buildingRes, shopRes] = await Promise.all([
        fetchWithTimeout(`${baseURL}advert`),
        fetchWithTimeout(`${baseURL}fashionpost/hot`),
        fetchWithTimeout(`${baseURL}buildings/hot/building`),
        fetchWithTimeout(`${baseURL}shops/hot/shops`),
      ]);

      const adverts = await advertRes.json();
      const fashion = await fashionRes.json();
      const building = await buildingRes.json();
      const shop = await shopRes.json();

      const combined = [
        ...(Array.isArray(fashion) ? fashion : []).map(i => ({ ...i, type: 'fashion' })),
        ...(Array.isArray(building) ? building : []).map(i => ({ ...i, type: 'building' })),
        ...(Array.isArray(shop) ? shop : []).map(i => ({ ...i, type: 'shop' })),
      ];

      setItems(Array.isArray(adverts) ? adverts : []);
      setCombinedItems(combined);
      setHasError(false);
    } catch (e) {
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(true); }, [loadData]));

  // Distinct regions present in the loaded listings, for the region
  // dropdown - mirrors the website's Home.jsx (same computation, same
  // "All regions" default).
  const regions = useMemo(
    () => Array.from(new Set(combinedItems.map((p) => p.region).filter(Boolean))).sort(),
    [combinedItems]
  );

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return combinedItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
      const matchesRegion = activeRegion === 'all' || item.region === activeRegion;
      const matchesSearch = !term || (item.name || '').toLowerCase().includes(term);
      return matchesCategory && matchesRegion && matchesSearch;
    });
  }, [combinedItems, activeCategory, activeRegion, searchTerm]);

  const columns = useMemo(() => {
    const cols = [[], [], []];
    filteredItems.forEach((item, idx) => cols[idx % 3].push(item));
    return cols;
  }, [filteredItems]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale]);

  const loadUserData = useCallback(async () => {
    if (!userId) {
      dispatch(loggedOut());
      navigation.reset({ index: 0, routes: [{ name: 'signup' }] });
      return;
    }
    try {
      const response = await axios.get(`${baseURL}userbyid/${userId}`);
      setUserData(response.data);
      if (response.data?.report) navigation.navigate('report');
      else if (!response.data?.phone) setIsPhoneModalVisible(true);
    } catch (error) {
      if (error?.response?.status === 404) {
        dispatch(loggedOut());
        navigation.reset({ index: 0, routes: [{ name: 'signup' }] });
      }
    }
  }, [userId, dispatch, navigation]);

  useFocusEffect(useCallback(() => { loadUserData(); }, [loadUserData]));

  useEffect(() => {
    if (userId) {
      const increment = async () => {
        try {
          await axios.get(`${baseURL}user/${userId}/platused`);
        } catch (err) {
          console.error('❌ Failed to increment platfUsed:', err.message || err);
        }
      };
      increment();
    }
  }, [userId]);

  const handlePhoneSubmit = async () => {
    let formatted = newPhoneNumber;
    if (!formatted) return alert('Please enter phone number');
    formatted = formatted.startsWith('+') ? formatted.replace(/^(\+\d{1,3})0/, '$1') : `+233${formatted.replace(/^0+/, '')}`;
    try {
      const response = await fetch(`${baseURL}phone/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatted }),
      });
      if (response.ok) {
        alert('Updated!');
        setIsPhoneModalVisible(false);
      }
    } catch (error) { alert('Error occurred'); }
  };

  const confirmExitApp = () => {
    Alert.alert(
      'Exit App',
      'Do you want to close the app?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => { confirmExitApp(); return true; };
      const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => subscription.remove(); 
    }, [])
  );

  const openWhatsApp = async () => {
    const phone = selectedItem?.whatsapp || selectedItem?.phone;
    if (!phone) return Alert.alert("Contact Error", "No WhatsApp contact available.");
    const itemName = selectedItem?.name || "this item";
    const itemPrice = selectedItem?.price ? ` for GH₵${selectedItem.price}` : "";
    const message = `Hello, I saw "${itemName}"${itemPrice} on Linkpii Ads and I am interested. Is it still available?`;
    const cleanPhone = phone.replace(/\+/g, '').replace(/\s/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    try {
      await fetch(`${baseURL}whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData?.name, email: userData?.email, phone: userData?.phone,
          receiverphone: selectedItem?.phone, recname: selectedItem?.name, pagename: 'advert',
        }),
      });
      Linking.canOpenURL(url).then(supported => {
        if (supported) return Linking.openURL(url);
        return Linking.openURL(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`);
      }).catch(() => Alert.alert("Error", "WhatsApp is not installed."));
    } catch (error) { console.error("WhatsApp log error:", error); }
    setIsModalVisible(false);
  };

  const handlePhoneCall = async () => {
    const phone = selectedItem?.phone || selectedItem?.whatsapp;
    if (!phone) return Alert.alert("Error", "No phone number available.");
    try {
      await fetch(`${baseURL}call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData?.name, email: userData?.email, phone: userData?.phone,
          receiverphone: selectedItem?.phone, recname: selectedItem?.name, pagename: 'advert',
        }),
      });
      call({ number: phone, prompt: false });
    } catch (error) { call({ number: phone, prompt: false }); }
    setIsModalVisible(false);
  };

  const renderProduct = (item) => {
    const CARD_WIDTH = width / 3 - 16;
    const IMAGE_HEIGHT = CARD_WIDTH * 0.8;
    return (
      <View key={item._id} style={{ marginBottom: 8 }}>
        <TouchableOpacity
          onPress={async () => {
            setIsDetailLoading(true);
            try {
              let endpoint = item.type === 'fashion' ? 'fashionpost' : item.type === 'building' ? 'buildings' : 'shops';
              const response = await fetch(`${baseURL}${endpoint}/products/${item._id}`);
              const productData = await response.json();
              setIsDetailLoading(false);
              navigation.navigate("Page", { ...productData, type: item.type });
            } catch (error) {
              setIsDetailLoading(false);
              alert("Connection error. Turn on mobile data");
            }
          }}
          style={styles.itemCard}
        >
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: item.picture || item.image || item.uri }}
              style={{ width: '100%', height: IMAGE_HEIGHT, borderTopLeftRadius: theme.radius.md, borderTopRightRadius: theme.radius.md }}
              resizeMode="cover"
            />
            {item?.condition && (
              <View style={styles.conditionBadgeSmall}>
                <Text style={styles.conditionTextSmall}>{item.condition}</Text>
              </View>
            )}
            {item?.discount > 0 && (
              <View style={styles.discountBadgeSmall}>
                <Text style={styles.discountTextSmall}>{item.discount}%</Text>
              </View>
            )}
            <View style={{ position: 'absolute', top: 6, right: 6 }}>
              <LikeButton
                itemId={item._id}
                liked={!!likedProducts[item._id]}
                onToggle={(isLiked) => {
                  setLikedProducts((prev) => ({ ...prev, [item._id]: isLiked }));
                  if (isLiked) setCelebrate(true);
                }}
              />
            </View>
          </View>
          <View style={{ padding: 6 }}>
            <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 12 }}>{item.name}</Text>
            {!item?.price ? (
              <Text style={styles.priceText}>Call for price</Text>
            ) : item?.discount ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={{ textDecorationLine: 'line-through', color: 'gray', fontSize: 10, marginRight: 4 }}>₵{item.price}</Text>
                <Text style={styles.priceText}>₵{(item.price - item.price * (item.discount / 100)).toFixed(2)}</Text>
              </View>
            ) : (
              <Text style={styles.priceText}>Gh₵{item.price}</Text>
            )}
            <Text numberOfLines={1} style={styles.locationText}>
              {(item.region || item.product?.region)?.trim()}, {(item.town || item.product?.town)?.trim()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.proHeader}>
        <View style={styles.headerTop}>
          <Text style={styles.logoText}>Linkpii <Text style={{color: theme.colors.brand600}}>Ads</Text></Text>
          <View style={styles.headerSupport}>
            <TouchableOpacity onPress={() => setIsSupportModalVisible(true)}>
              <FontAwesome5 name="whatsapp" size={18} color="#25D366" />
            </TouchableOpacity>
            <View style={styles.vDivider} />
            <TouchableOpacity onPress={() => setIsSupportModalVisible(true)}>
              <Feather name="phone" size={18} color={theme.colors.ink700} />
            </TouchableOpacity>
          </View>
        </View>
        <Animated.Text style={[styles.subText, { transform: [{ scale }] }]}>Modern ads at your fingertips</Animated.Text>
      </View>

      {hasError && !isLoading ? (
        <View style={styles.errorScreen}>
          <MaterialCommunityIcons name="wifi-off" size={80} color="#CBD5E0" />
          <Text style={styles.errorTitle}>No Connection</Text>
          <Text style={styles.errorSub}>Please check your internet settings and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadData(true)}>
            <Ionicons name="refresh" size={20} color="white" style={{marginRight: 8}} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading && !isRefreshing ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={theme.colors.brand600} />
          <Text style={styles.loadingText}>Fetching Latest Ads...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); loadData(false); }} tintColor={theme.colors.brand600} />}
        >
          <HomeCarousel />

          <View style={styles.filterSection}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search listings by name..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchTerm('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsRow}
            >
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => setActiveCategory(cat.key)}
                    style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  >
                    <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {regions.length > 0 && (
              <TouchableOpacity
                style={styles.regionChipRow}
                onPress={() => setRegionModalVisible(true)}
              >
                <Ionicons name="location-outline" size={14} color="#333" />
                <Text style={styles.regionChipText} numberOfLines={1}>
                  {activeRegion === 'all' ? 'All regions' : activeRegion}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="magnify-close" size={56} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>No listings match your filters</Text>
              <Text style={styles.emptySub}>Try a different keyword, category or region.</Text>
            </View>
          ) : (
            <View style={styles.masonryContainer}>
              <View style={styles.col}>{columns[0].map(renderProduct)}</View>
              <View style={styles.col}>{columns[1].map(renderProduct)}</View>
              <View style={styles.col}>{columns[2].map(renderProduct)}</View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Modals & Overlays */}
      <Modal transparent visible={isDetailLoading} animationType="fade">
        <View style={styles.loadingOverlay}><View style={styles.loadingBox}><ActivityIndicator color={theme.colors.brand600} /><Text style={{marginTop:8, color: theme.colors.ink700}}>Opening...</Text></View></View>
      </Modal>

      <Modal transparent visible={regionModalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.regionOverlay}
          activeOpacity={1}
          onPress={() => setRegionModalVisible(false)}
        >
          <View style={styles.regionMenu}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              <TouchableOpacity
                style={styles.regionOption}
                onPress={() => { setActiveRegion('all'); setRegionModalVisible(false); }}
              >
                <Text style={styles.regionOptionText}>All regions</Text>
              </TouchableOpacity>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={styles.regionOption}
                  onPress={() => { setActiveRegion(region); setRegionModalVisible(false); }}
                >
                  <Text style={styles.regionOptionText}>{region}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal animationType="slide" transparent visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.callModalContainer}>
             <View style={styles.modalDragIndicator} />
             <Text style={styles.modalTitle}>Contact Seller</Text>
             <Text style={styles.modalSub}>{selectedItem?.name}</Text>
             <View style={styles.contactOptions}>
                <TouchableOpacity onPress={handlePhoneCall} style={styles.contactBtn}>
                  <View style={[styles.iconCircle, {backgroundColor: theme.colors.brand100}]}><Feather name="phone-call" size={24} color={theme.colors.brand600} /></View>
                  <Text style={styles.contactText}>Phone Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openWhatsApp} style={styles.contactBtn}>
                  <View style={[styles.iconCircle, {backgroundColor: '#E7FAF0'}]}><FontAwesome5 name="whatsapp" size={26} color="#25D366" /></View>
                  <Text style={styles.contactText}>WhatsApp</Text>
                </TouchableOpacity>
             </View>
             <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}><Text style={{color: '#999', fontWeight: 'bold'}}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={isPhoneModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.phoneModalContainer}>
            <View style={styles.iconHeader}><Ionicons name="phone-portrait-outline" size={40} color={theme.colors.brand600} /></View>
            <Text style={styles.title}>Update Phone Number</Text>
            <Text style={styles.phoneDesc}>Please provide your number so sellers can contact you easily.</Text>
            <PhoneInput defaultCode="GH" layout="first" onChangeFormattedText={setNewPhoneNumber} containerStyle={styles.phoneInputContainer} textContainerStyle={styles.phoneTextContainer} />
            <TouchableOpacity onPress={handlePhoneSubmit} style={[styles.actionBtn, styles.saveButton]}><Text style={styles.saveButtonText}>Verify & Save</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={isSupportModalVisible} onRequestClose={() => setIsSupportModalVisible(false)}>
        <View style={styles.supportOverlay}>
          <View style={styles.supportBox}>
            <View style={styles.supportHeader}><MaterialCommunityIcons name="headset" size={30} color={theme.colors.brand600} /><Text style={styles.supportTitle}>Linkpii Support</Text></View>
            <Text style={styles.supportSub}>How can we help you?</Text>
            <TouchableOpacity style={styles.supportOption} onPress={() => { Linking.openURL(`whatsapp://send?phone=233209317581`); setIsSupportModalVisible(false); }}>
              <FontAwesome5 name="whatsapp" size={20} color="#25D366" /><Text style={styles.supportOptionText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportOption} onPress={() => { call({ number: '+233209317581', prompt: false }); setIsSupportModalVisible(false); }}>
              <Feather name="phone" size={20} color="#333" /><Text style={styles.supportOptionText}>Direct Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSupportModalVisible(false)} style={styles.supportClose}><Text style={styles.supportCloseText}>Dismiss</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {celebrate && <ConfettiCannon count={100} origin={{ x: width / 2, y: 0 }} fadeOut onAnimationEnd={() => setCelebrate(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, color: theme.colors.ink500, fontWeight: '600' },
  proHeader: {
    backgroundColor: theme.colors.surface,
    paddingTop: 30,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoText: { fontSize: 22, fontWeight: '900', color: theme.colors.ink900, letterSpacing: 0.2 },
  headerSupport: {
    flexDirection: 'row',
    backgroundColor: theme.colors.ink100,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  vDivider: { width: 1, height: 14, backgroundColor: theme.colors.border, marginHorizontal: 10 },
  subText: { fontSize: 11, color: theme.colors.ink500, alignSelf: 'center', marginTop: 10, fontWeight: '600' },
  carouselContainer: { height: height / 3.4, backgroundColor: theme.colors.surface, marginBottom: 10 },
  carouselSlide: { width, height: height / 3.4, justifyContent: 'center', alignItems: 'center' },
  carouselImgWrapper: { position: 'relative', width: width - 30, height: height / 4, borderRadius: theme.radius.xl, overflow: 'hidden' },
  carouselImg: { width: '100%', height: '100%' },
  carouselCallBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: theme.colors.success, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  filterSection: { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    height: 46,
    marginBottom: theme.spacing.sm,
    ...theme.shadow.card,
  },
  searchInput: { flex: 1, marginLeft: theme.spacing.sm, fontSize: 14, color: theme.colors.ink900, padding: 0 },
  filterChipsRow: { alignItems: 'center', paddingRight: theme.spacing.md },
  categoryPill: {
    backgroundColor: theme.colors.ink100,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  categoryPillActive: { backgroundColor: theme.colors.brand600 },
  categoryPillText: { fontSize: 12, fontWeight: '600', color: theme.colors.ink700 },
  categoryPillTextActive: { color: theme.colors.surface },
  regionChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.ink100,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    height: 34,
    marginTop: theme.spacing.sm,
  },
  regionChipText: { fontSize: 12, fontWeight: '600', color: theme.colors.ink700, marginHorizontal: 6, maxWidth: 160 },
  regionOverlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'center', paddingHorizontal: 40 },
  regionMenu: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, paddingVertical: 6, ...theme.shadow.floating },
  regionOption: { paddingVertical: 12, paddingHorizontal: 18 },
  regionOptionText: { fontSize: 15, color: theme.colors.ink900 },
  emptyState: { alignItems: 'center', paddingHorizontal: 30, paddingVertical: 50 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.ink900, marginTop: 16 },
  emptySub: { textAlign: 'center', color: theme.colors.ink500, marginTop: 6 },
  masonryContainer: { flexDirection: 'row', padding: theme.spacing.md, justifyContent: 'space-between', paddingBottom: 100 },
  col: { width: COLUMN_WIDTH },
  itemCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, ...theme.shadow.card },
  conditionBadgeSmall: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  conditionTextSmall: { color: theme.colors.ink700, fontSize: 9, fontWeight: '700', textTransform: 'capitalize' },
  discountBadgeSmall: { position: 'absolute', bottom: 5, left: 5, backgroundColor: theme.colors.ink900, paddingHorizontal: 6, paddingVertical: 2, borderRadius: theme.radius.sm },
  discountTextSmall: { color: theme.colors.brand500, fontSize: 10, fontWeight: 'bold' },
  priceText: { fontSize: 12, color: theme.colors.brand700, fontWeight: 'bold', marginTop: 2 },
  locationText: { fontSize: 10, color: theme.colors.ink500, marginTop: 2 },
  loadingOverlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'center', alignItems: 'center' },
  loadingBox: { backgroundColor: theme.colors.surface, padding: 25, borderRadius: theme.radius.lg, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'flex-end' },
  callModalContainer: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: theme.spacing.xxl, alignItems: 'center', ...theme.shadow.sheet },
  modalDragIndicator: { width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.ink900 },
  modalSub: { fontSize: 14, color: theme.colors.ink500, marginBottom: 25 },
  contactOptions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  contactBtn: { alignItems: 'center', flex: 1 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  contactText: { fontSize: 14, fontWeight: '700', color: theme.colors.ink900 },
  closeBtn: { padding: 15 },
  phoneModalContainer: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.xl, margin: 20, alignItems: 'center', ...theme.shadow.floating },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: theme.colors.ink900 },
  phoneDesc: { textAlign: 'center', color: theme.colors.ink500, marginBottom: 15 },
  phoneInputContainer: { width: '100%', height: 60, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.border },
  phoneTextContainer: { borderRadius: theme.radius.sm, backgroundColor: theme.colors.surface },
  saveButton: { backgroundColor: theme.colors.brand600, width: '100%', padding: 15, borderRadius: theme.radius.sm, marginTop: 10, alignItems: 'center' },
  saveButtonText: { color: theme.colors.surface, fontWeight: 'bold' },
  errorScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.ink900, marginTop: 20 },
  errorSub: { textAlign: 'center', color: theme.colors.ink500, marginVertical: 10 },
  retryBtn: { backgroundColor: theme.colors.brand600, flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 30, borderRadius: theme.radius.pill, marginTop: 15, ...theme.shadow.floating },
  retryText: { color: theme.colors.surface, fontWeight: 'bold' },
  supportOverlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'center', alignItems: 'center' },
  supportBox: { width: '85%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: theme.spacing.xxl, alignItems: 'center' },
  supportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  supportTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: theme.colors.ink900 },
  supportSub: { marginBottom: 20, color: theme.colors.ink500 },
  supportOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.ink100, width: '100%', padding: 15, borderRadius: theme.radius.sm, marginBottom: 10 },
  supportOptionText: { marginLeft: 10, fontWeight: '600', color: theme.colors.ink900 },
  supportClose: { padding: 15 },
  supportCloseText: { color: theme.colors.brand600, marginTop: 10, fontWeight: 'bold' },
});