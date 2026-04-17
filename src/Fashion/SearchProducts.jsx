import React, { useState } from 'react';
import { 
  Text, 
  Image, 
  Linking, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  View, 
  StyleSheet, 
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';


const { width } = Dimensions.get("window");

const SearchProducts = ({ productFiltered }) => {
  const navigation = useNavigation();
  const [pressLoading, setPressLoading] = useState(false);
  

  const openDial = () => {
    const args = { number: '+233247747624', prompt: false, skipCanOpen: true };
    call(args).catch(console.error);
  };

  const openWhatsapp = () => Linking.openURL(`https://wa.me/233209317581`);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {productFiltered && productFiltered.length > 0 ? (
          productFiltered.map((item) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.7}
              style={styles.compactCard}
              onPress={async () => {
                try {
                  setPressLoading(true);
                  const response = await fetch(`${baseURL}fashionpost/products/${item._id}`);
                  const productData = await response.json();
                  navigation.navigate("Detailpage", productData);
                } catch (error) {
                  console.error(error);
                } finally {
                  setPressLoading(false);
                }
              }}
            >
              {/* Smaller, square thumbnail */}
              <Image source={{ uri: item.picture }} style={styles.thumbSmall} />
              
              <View style={styles.textContainer}>
                <View style={styles.topLine}>
                  <Text numberOfLines={1} style={styles.nameSmall}>{item.name}</Text>
                  <Text style={styles.priceSmall}>
                    Gh₵{item.discount 
                      ? (item.price - (item.price * item.discount / 100)).toFixed(0) 
                      : item.price || '??'}
                  </Text>
                </View>

                <View style={styles.bottomLine}>
                  <View style={styles.locGroup}>
                    <Ionicons name="location-sharp" size={10} color="#f5a53d" />
                    <Text numberOfLines={1} style={styles.locSmall}>{item.region?.trim()}, {item.town?.trim()}, {item.location?.trim()}</Text>
                  </View>
                  {item.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>-{item.discount}%</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
             <Text style={styles.emptyTitle}>No Results</Text>
             <TouchableOpacity onPress={openWhatsapp} style={styles.helpBtn}>
                <Text style={styles.helpText}>Contact Linkpii for more info</Text>
             </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {pressLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#f5a53d" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 12, paddingVertical: 10 },
  compactCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  thumbSmall: {
    width: 55,
    height: 55,
    borderRadius: 6,
    backgroundColor: '#f9f9f9'
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locSmall: {
    fontSize: 11,
    color: '#777',
    marginLeft: 2,
    width:width/2
  },
  discountBadge: {
    backgroundColor: '#f5a53d20', // Light orange tint
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    color: '#f5a53d',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: { padding: 40, alignItems: 'center' },
  helpBtn: { marginTop: 10, padding: 10, backgroundColor: '#25D366', borderRadius: 8 },
  helpText: { color: '#fff', fontWeight: 'bold' }
});

export default SearchProducts;