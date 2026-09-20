import React, { useState } from 'react';
import { 
  Text, 
  Image, 
  Linking, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  View, 
  Pressable, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get('window');

const SearchRentCars = (props) => {
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

  const Whatsapp = () => {
    Linking.openURL(`https://wa.me/233209317581`);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {productFiltered && productFiltered.length > 0 ? (
          productFiltered.map((item) => (
            <Pressable
              key={item._id}
              style={styles.card}
              onPress={async () => {
                try {
                  setPressLoading(true);
                  const response = await fetch(`${baseURL}rentcar/products/${item._id}`);
                  const productData = await response.json();
                  navigation.navigate("rentcardetail", productData);
                } catch (error) {
                  console.error('Error viewing product:', error);
                } finally {
                  setPressLoading(false);
                }
              }}
            >
              <View style={styles.cardInner}>
                <Image 
                  source={{ uri: item.picture }} 
                  style={styles.productImage} 
                  resizeMode="cover" 
                />
                <View style={styles.textContainer}>
                  <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                  <Text numberOfLines={1} style={styles.locationText}>{item.region}</Text>
                  <Text numberOfLines={1} style={styles.subLocationText}>{item.town}</Text>
                  <Text numberOfLines={1} style={styles.subLocationText}>{item.location}</Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.errorTitle}>No matches found.</Text>
            <Text style={styles.errorSub}>Contact us to help find what you need</Text>

            <View style={styles.contactSection}>
              <Text style={styles.promoText}>Send your flier for advertisement</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={Whatsapp} style={styles.iconBtn}>
                  <FontAwesome5 name="whatsapp-square" size={40} color="#07ed6b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openDial} style={styles.iconBtn}>
                  <Feather name="phone-call" size={32} color="#07ed6b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {pressLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 150,
  },
  card: {
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    marginBottom: 15,
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
  subLocationText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  errorSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  contactSection: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 20,
    width: '90%',
  },
  promoText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  iconBtn: {
    marginHorizontal: 20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default SearchRentCars;