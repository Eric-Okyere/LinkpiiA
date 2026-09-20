import React, { useState } from 'react';
import { 
  Text, Image, Linking, Platform, TouchableOpacity, 
  ActivityIndicator, ScrollView, View, StyleSheet, Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get('window');

const SearchSpareParts = (props) => {
  const { productFiltered } = props;
  const navigation = useNavigation();
  const [pressLoading, setPressLoading] = useState(false);

  const openDial = () => {
    const args = {
      number: '+233247747624',
      prompt: false,
      skipCanOpen: true
    };
    call(args).catch(console.error);
  };

  const openWhatsapp = () => {
    Linking.openURL(`https://wa.me/233209317581`);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {productFiltered.length > 0 ? (
          productFiltered.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={async () => {
                setPressLoading(true);
                try {
                  const res = await fetch(`${baseURL}sparepartsmainpost/products/${item._id}`);
                  const data = await res.json();
                  navigation.navigate("sparedetail", data);
                } catch (e) {
                  console.error("Error viewing product:", e);
                } finally {
                  setPressLoading(false);
                }
              }}
            >
              <Image 
                source={{ uri: item.picture }} 
                style={styles.cardImage} 
                resizeMode="cover" 
              />
              <View style={styles.cardInfo}>
                <Text numberOfLines={1} style={styles.productTitle}>{item.name}</Text>
                
                <View style={styles.locationContainer}>
                  <Ionicons name="location-sharp" size={12} color="#f5a53d" />
                  <Text numberOfLines={1} style={styles.locationText}>
                    {item.region}, {item.town}
                  </Text>
                </View>
                
                <Text numberOfLines={1} style={styles.subLocationText}>
                  {item.location}
                </Text>
                
                <Text style={styles.priceText}>
                  Gh₵{item.price?.toLocaleString()}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="search" size={40} color="#AAA" />
            </View>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySub}>We couldn't find what you are looking for.</Text>
            
            <View style={styles.helpBox}>
              <Text style={styles.helpText}>Need help finding a specific part?</Text>
              <View style={styles.contactRow}>
                <TouchableOpacity onPress={openWhatsapp} style={styles.contactBtn}>
                  <FontAwesome5 name="whatsapp" size={20} color="#FFF" />
                  <Text style={styles.contactBtnText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openDial} style={[styles.contactBtn, { backgroundColor: '#1A1A1A' }]}>
                  <Feather name="phone-call" size={18} color="#FFF" />
                  <Text style={styles.contactBtnText}>Call Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {pressLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f5a53d" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 150 },
  
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: '#EEE'
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
    fontWeight: '500'
  },
  subLocationText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 16
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f5a53d',
    marginTop: 5
  },

  // Empty State Styles
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A'
  },
  emptySub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8
  },
  helpBox: {
    marginTop: 40,
    width: '100%',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center'
  },
  helpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12
  },
  contactBtn: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110
  },
  contactBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }
});

export default SearchSpareParts;