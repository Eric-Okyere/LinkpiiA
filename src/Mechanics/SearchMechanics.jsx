import React from 'react';
import { 
  Text, 
  Image, 
  Linking, 
  Platform, 
  TouchableOpacity, 
  ScrollView, 
  View, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const SearchMechanic = ({ productFiltered }) => {
  const navigation = useNavigation();

  const openDial = () => {
    // You can add your logging fetch call here like in the Detail page
    Linking.openURL(`tel:+233247747624`);
  };

  const openWhatsapp = () => {
    // You can add your logging fetch call here
    Linking.openURL(`https://wa.me/233209317581`);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {productFiltered && productFiltered.length > 0 ? (
          productFiltered.map((item) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={item._id}
              style={styles.resultCard}
              onPress={() => navigation.navigate("callmech", item)}
            >
              <Image 
                source={{ uri: item.picture }} 
                style={styles.resultImage} 
                resizeMode="cover" 
              />
              <View style={styles.resultInfo}>
                <Text numberOfLines={1} style={styles.mechName}>{item.name}</Text>
                
                <View style={styles.locRow}>
                  <Ionicons name="location-outline" size={14} color="#FFC107" />
                  <Text numberOfLines={1} style={styles.locText}>
                    {item.region}, {item.town}
                  </Text>
                </View>

                <View style={styles.locRow}>
                  <MaterialCommunityIcons name="map-marker-radius-outline" size={14} color="#999" />
                  <Text numberOfLines={1} style={styles.subLocText}>{item.location}</Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <Feather name="chevron-right" size={20} color="#CCC" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <Feather name="search" size={40} color="#FFC107" />
            </View>
            <Text style={styles.emptyTitle}>No Mechanics Found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find a match for your search. Check your spelling or try a different region.
            </Text>

            <View style={styles.helpCard}>
                <Text style={styles.helpTitle}>Need urgent help?</Text>
                <Text style={styles.helpText}>Contact our support team to link you directly to a verified professional.</Text>
                
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={openWhatsapp} style={[styles.helpBtn, { backgroundColor: '#25D366' }]}>
                        <FontAwesome5 name="whatsapp" size={18} color="#FFF" />
                        <Text style={styles.helpBtnText}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openDial} style={[styles.helpBtn, { backgroundColor: '#000' }]}>
                        <Feather name="phone" size={18} color="#FFF" />
                        <Text style={styles.helpBtnText}>Call Us</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 16, paddingBottom: 150 },
  
  // Result Card Styles
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  resultImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F8F9FA' },
  resultInfo: { flex: 1, marginLeft: 15 },
  mechName: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locText: { fontSize: 13, color: '#555', marginLeft: 4, fontWeight: '500' },
  subLocText: { fontSize: 12, color: '#999', marginLeft: 4 },
  arrowContainer: { paddingLeft: 10 },

  // Empty State Styles
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF9E6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  emptySubtitle: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  
  helpCard: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 20, 
    padding: 20, 
    width: '100%', 
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  helpTitle: { fontSize: 16, fontWeight: '800', color: '#000' },
  helpText: { fontSize: 13, color: '#666', marginTop: 5, lineHeight: 18 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  helpBtn: { 
    flex: 0.48, 
    flexDirection: 'row', 
    height: 45, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  helpBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 8, fontSize: 14 }
});

export default SearchMechanic;