import React, { useState } from 'react';
import { 
  Text, 
  Image, 
  Linking, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions, 
  ScrollView, 
  View, 
  Pressable, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get('window');

const SearchServices = (props) => {
  const { productFiltered } = props;
  const navigation = useNavigation();
  const [pressLoading, setPressLoading] = useState(false);

  const openDial = () => {
    const args = {
      number: '+233209317581',
      prompt: false,
      skipCanOpen: true
    };
    call(args).catch(console.error);
  };

  const Whatsapp = () => {
    const url = `https://wa.me/233209317581`;
    Linking.openURL(url).catch(() => alert("Make sure WhatsApp is installed"));
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        style={styles.scrollView}
      >
        {productFiltered.length > 0 ? (
          productFiltered.map((item) => (
            <Pressable
              key={item._id}
              style={({ pressed }) => [
                styles.card,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={async () => {
                try {
                  setPressLoading(true);
                  const response = await fetch(`${baseURL}services/products/${item._id}`);
                  const productData = await response.json();
                  navigation.navigate("Singleserv", productData);
                } catch (error) {
                  console.error("Error viewing product:", error);
                } finally {
                  setPressLoading(false);
                }
              }}
            >
              <View style={styles.cardInner}>
                <View style={styles.row}>
                  <Image source={{ uri: item.picture }} style={styles.thumb} resizeMode='contain' />
                  <Image source={{ uri: item.picturesec }} style={styles.thumb} resizeMode='contain' />
                  
                  <View style={styles.infoContainer}>
                    <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                    <View style={styles.priceLocationContainer}>
                      <View style={styles.priceWrapper}>
                       
                        
                          <Text numberOfLines={1} style={styles.newPrice}>{item.description}</Text>
                       
                      </View>
                      <Text numberOfLines={1} style={styles.locationText}>
                        {item.region?.trim()}, {item.town?.trim()}, {item.location?.trim()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You made a wrong input.</Text>
            <Text style={styles.emptySubText}>Contact us to link you to what you want</Text>

            <View style={styles.contactCenter}>
              
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={Whatsapp} style={styles.iconButton}>
                  <FontAwesome5 name="whatsapp-square" size={35} color="#07ed6b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openDial} style={styles.iconButton}>
                  <Feather name="phone-call" size={30} color="#07ed6b" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {pressLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    bottom: 50,
  },
  scrollContent: {
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#f3f4f6', // gray.100
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    // Elevation for Android
    elevation: 6,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  cardInner: {
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  thumb: {
    width: 80,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#eee'
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    width: width / 3,
  },
  priceLocationContainer: {
    marginTop: 1,
  },
  priceWrapper: {
    marginBottom: 2,
  },
  callForPrice: {
    fontSize: 12,
    color: '#f5a53d',
    fontWeight: 'bold'
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 12,
    marginRight: 6
  },
  newPrice: {
    fontSize: 12,
    color: '#f5a53d',
    fontWeight: 'bold'
  },
  locationText: {
    fontSize: 8,
    fontWeight: '400',
    color: '#555',
    width: width / 3
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#333'
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  contactCenter: {
    alignItems: 'center',
    marginBottom: 60,
  },
  adText: {
    fontSize: 16, // Reduced slightly for better fit
    color: "#333", // Changed from white to dark since background is default View
    textAlign: 'center'
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center'
  },
  iconButton: {
    marginHorizontal: 20,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default SearchServices;