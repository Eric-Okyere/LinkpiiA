import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdverts } from '../Redux/actions';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get('window');
const CAROUSEL_HEIGHT = Math.round(width * 0.55);
const AUTOPLAY_MS = 4000;

// Brand gold/black tokens (matching the website's design guide - brand-600
// #ab6c0f, ink-950 near-black). Inlined here rather than imported from
// src/Styles/theme.js because that file only exists on
// feature/android-design-refresh, a separate not-yet-merged branch.
const GOLD = '#ab6c0f';
const INK_950 = '#0f0f0f';

/**
 * The home screen's business-partner flyer carousel - the Android
 * equivalent of the website's BigCarousel (src/components/ui/BigCarousel.jsx
 * on LinkpiiAdminWeb). Autoplays through adverts fetched from the backend's
 * `GET /advert` endpoint (same one the website uses), with a "Featured
 * partner" caption and a "Call now" button over the active slide. Tapping
 * "Call now" opens a modal with that advert's phone/WhatsApp, matching the
 * website's call/WhatsApp flow on DetailPage.jsx (logs the contact via
 * POST /call or /whatsapp, then opens the native dialer/WhatsApp either
 * way - logging failure never blocks the actual call).
 *
 * Renders nothing while loading or if there are no adverts, so it never
 * leaves an empty gap on the home screen.
 */
const HomeCarousel = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.adverts);
  const listRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalItem, setModalItem] = useState(null);
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdverts());
  }, [dispatch]);

  useEffect(() => {
    if (!items || items.length < 2) return undefined;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % items.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [items]);

  const onMomentumScrollEnd = useCallback((e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    indexRef.current = index;
    setActiveIndex(index);
  }, []);

  const openCallModal = () => {
    const item = items?.[activeIndex];
    if (item) setModalItem(item);
  };

  const closeModal = () => setModalItem(null);

  const contactAdvert = async (method) => {
    if (!modalItem || isContacting) return;
    setIsContacting(true);
    const endpoint = method === 'whatsapp' ? 'whatsapp' : 'call';
    try {
      await fetch(`${baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverphone: modalItem.phone,
          recname: modalItem.name,
        }),
      });
    } catch (err) {
      console.error(`${endpoint} logging error:`, err);
    } finally {
      setIsContacting(false);
      if (method === 'whatsapp') {
        Linking.openURL(`https://wa.me/${modalItem.whatsapp || modalItem.phone}`);
      } else {
        Linking.openURL(`tel:${modalItem.phone}`);
      }
      closeModal();
    }
  };

  if (isLoading && (!items || items.length === 0)) {
    return (
      <View style={[styles.wrapper, styles.loadingWrapper]}>
        <ActivityIndicator color={GOLD} />
      </View>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={listRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.picture }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.captionRow}>
              <View style={styles.captionText}>
                <Text style={styles.eyebrow}>FEATURED PARTNER</Text>
                <Text style={styles.headline} numberOfLines={1}>
                  Want your flyer here? Call our office.
                </Text>
              </View>
              <TouchableOpacity style={styles.callButton} onPress={openCallModal} activeOpacity={0.85}>
                <FontAwesome name="phone" size={14} color="#fff" />
                <Text style={styles.callButtonText}>Call now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {items.length > 1 && (
        <View style={styles.dots}>
          {items.map((item, i) => (
            <View key={item._id} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}

      <Modal visible={!!modalItem} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Feather name="x" size={20} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalItem?.name || 'Contact'}</Text>
            {!!modalItem?.author && <Text style={styles.modalSubtitle}>{modalItem.author}</Text>}

            <TouchableOpacity
              style={[styles.modalAction, { backgroundColor: GOLD }]}
              onPress={() => contactAdvert('call')}
              disabled={isContacting}
            >
              <FontAwesome name="phone" size={16} color="#fff" />
              <Text style={styles.modalActionText}>Call {modalItem?.phone}</Text>
            </TouchableOpacity>

            {!!modalItem?.whatsapp && (
              <TouchableOpacity
                style={[styles.modalAction, { backgroundColor: '#25D366' }]}
                onPress={() => contactAdvert('whatsapp')}
                disabled={isContacting}
              >
                <FontAwesome name="whatsapp" size={16} color="#fff" />
                <Text style={styles.modalActionText}>WhatsApp</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width,
    height: CAROUSEL_HEIGHT,
    marginBottom: 12,
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  slide: {
    width,
    height: CAROUSEL_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  captionRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  captionText: {
    flex: 1,
    marginRight: 10,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headline: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOLD,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  dots: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: INK_950,
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  modalActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default HomeCarousel;
