import React, { useState } from 'react';
import { 
  Text, 
  Image, 
  Linking, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  View, 
  Pressable, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get("window");

const SearchBuildings = (props) => {
  const { productFiltered } = props;
  const navigation = useNavigation();
  const [pressLoading, setPressLoading] = useState(false);

  const openDial = () => {
    const args = { number: '+233247747624', prompt: false, skipCanOpen: true };
    call(args).catch(console.error);
  };

  const openWhatsapp = () => {
    Linking.openURL(`https://wa.me/233209317581`);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {productFiltered.length > 0 ? (
          productFiltered.map((item) => (
            <View key={item._id} style={styles.cardWrapper}>
              <Pressable
                style={styles.card}
                onPress={async () => {
                  setPressLoading(true);
                  try {
                    const response = await fetch(`${baseURL}buildings/products/${item._id}`);
                    const productData = await response.json();
                    navigation.navigate("Builddetail", productData);
                  } catch (error) {
                    console.error("Error:", error);
                  } finally {
                    setPressLoading(false);
                  }
                }}
              >
                <Image source={{ uri: item.picture }} style={styles.image} resizeMode='cover' />
                <View style={styles.infoContainer}>
                  <Text numberOfLines={1} style={styles.nameText}>{item.name}</Text>
                  
                  <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color="#f5a53d" />
                    <Text numberOfLines={1} style={styles.locationText}>{item.town}, {item.region}</Text>
                  </View>

                  {/* AMENITIES SECTION */}
                  {item.amenities && (
                    <View style={styles.amenitiesRow}>
                      <Text numberOfLines={1} style={styles.amenityText}>
                         {Array.isArray(item.amenities) ? item.amenities.join(' • ') : item.amenities}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.priceText}>Gh₵{item.price?.toLocaleString()}</Text>
                </View>

                <View style={styles.actionColumn}>
                   <TouchableOpacity style={styles.iconButton} 
                   onPress={async () => {
                  setPressLoading(true);
                  try {
                    const response = await fetch(`${baseURL}buildings/products/${item._id}`);
                    const productData = await response.json();
                    navigation.navigate("Builddetail", productData);
                  } catch (error) {
                    console.error("Error:", error);
                  } finally {
                    setPressLoading(false);
                  }
                }}
                   >
                      <FontAwesome5 name="whatsapp" size={18} color="#25D366" />
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.iconButton, {marginTop: 10}]} 
                   onPress={async () => {
                  setPressLoading(true);
                  try {
                    const response = await fetch(`${baseURL}buildings/products/${item._id}`);
                    const productData = await response.json();
                    navigation.navigate("Builddetail", productData);
                  } catch (error) {
                    console.error("Error:", error);
                  } finally {
                    setPressLoading(false);
                  }
                }}
                   >
                      <Feather name="phone" size={18} color="#f5a53d" />
                   </TouchableOpacity>
                </View>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.noResultContainer}>
            <View style={styles.iconHeader}>
                <MaterialIcons name="domain-verification" size={60} color="#f5a53d" />
            </View>
            
            <Text style={styles.noResultTitle}>Property Not Found</Text>
            <Text style={styles.noResultSub}>We couldn't find exactly what you're looking for, but our office can help you find a perfect match manually.</Text>

            <View style={styles.officeCard}>
                <Text style={styles.officeHeader}>Contact Our Office</Text>
                
                <TouchableOpacity style={styles.contactRow} onPress={openDial}>
                    <View style={styles.contactIconCircle}>
                        <Feather name="phone-call" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.contactLabel}>Call Official Line</Text>
                        <Text style={styles.contactValue}>+233 247 747 624</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactRow} onPress={openWhatsapp}>
                    <View style={[styles.contactIconCircle, {backgroundColor: '#25D366'}]}>
                        <FontAwesome5 name="whatsapp" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.contactLabel}>WhatsApp Support</Text>
                        <Text style={styles.contactValue}>Chat with an Agent</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.adSection}>
                <Text style={styles.adTitle}>Want to list your property?</Text>
                <Text style={styles.adSub}>Send your flier to us for professional advertisement.</Text>
                <TouchableOpacity style={styles.adBtn} onPress={openWhatsapp}>
                    <Text style={styles.adBtnText}>Submit Flier</Text>
                </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingBottom: 100 },
  cardWrapper: { paddingHorizontal: 16, marginTop: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', padding: 12, alignItems: 'center', elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  image: { width: 90, height: 90, borderRadius: 12 },
  infoContainer: { flex: 1, marginLeft: 15 },
  nameText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 12, color: '#666', marginLeft: 4 },
  
  // Amenities style
  amenitiesRow: {
    backgroundColor: '#F1F3F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginVertical: 6,
  },
  amenityText: {
    fontSize: 10,
    color: '#555',
    fontWeight: '500',
  },

  priceText: { fontSize: 14, fontWeight: '800', color: '#f5a53d' },
  actionColumn: { paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: '#F0F0F0', alignItems: 'center' },
  iconButton: { padding: 8, backgroundColor: '#F8F9FA', borderRadius: 10 },

  noResultContainer: { alignItems: 'center', paddingHorizontal: 25, paddingTop: 40 },
  iconHeader: { marginBottom: 15 },
  noResultTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  noResultSub: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  
  officeCard: { 
    width: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginTop: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  officeHeader: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 20, textAlign: 'center' },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  contactIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contactLabel: { fontSize: 11, color: '#888', fontWeight: '600' },
  contactValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '700' },

  adSection: { marginTop: 40, alignItems: 'center', backgroundColor: '#FFF3E0', padding: 20, borderRadius: 15, width: '100%' },
  adTitle: { fontSize: 15, fontWeight: '800', color: '#E65100' },
  adSub: { fontSize: 12, color: '#666', textAlign: 'center', marginVertical: 8 },
  adBtn: { backgroundColor: '#E65100', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  adBtnText: { color: '#fff', fontWeight: '700', fontSize: 11 },

  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 }
});

export default SearchBuildings;