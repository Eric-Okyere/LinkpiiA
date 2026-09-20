import React, { useState } from 'react';
import { 
  Text, 
  Image, 
  Linking, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator, 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get('window');

const SearchEquipments = (props) => {
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
              activeOpacity={0.8}
              style={styles.card}
              onPress={async () => {
                try {
                  setPressLoading(true);
                  const response = await fetch(`${baseURL}equipmentmain/products/${item._id}`);
                  const productData = await response.json();
                  navigation.navigate("equipmentdetail", productData);
                } catch (error) {
                  console.error("Error viewing product:", error);
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
              <View style={styles.cardDetails}>
                <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#f5a53d" />
                  <Text numberOfLines={1} style={styles.locationText}>
                    {item.town}, {item.region}
                  </Text>
                </View>
                
                <View style={styles.tagRow}>
                  <Text style={styles.exactLocation} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="search" size={40} color="#f5a53d" />
            </View>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find what you're looking for. Need help finding specific equipment?
            </Text>

            <View style={styles.supportCard}>
              <Text style={styles.supportTitle}>Contact our Support</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsapp}>
                  <FontAwesome5 name="whatsapp" size={20} color="#fff" />
                  <Text style={styles.actionText}>WhatsApp</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.callBtn} onPress={openDial}>
                  <Feather name="phone-call" size={18} color="#fff" />
                  <Text style={styles.actionText}>Call Us</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  
  // Card Styling
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  tagRow: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  exactLocation: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },

  // Empty State Styling
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#777',
    lineHeight: 20,
    marginBottom: 30,
  },
  supportCard: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  supportTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a53d',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },

  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default SearchEquipments;