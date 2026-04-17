import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SearchCar = (props) => {
  const { productFiltered } = props;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {productFiltered.length > 0 ? (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {productFiltered.map((item) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("phonecall", item)}
              style={styles.resultCard}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.driverpic }} 
                  style={styles.carImage} 
                />
                <View style={styles.driverOverlay}>
                   <Image 
                    source={{ uri: item.carpic }} 
                    style={styles.driverThumb} 
                  />
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.driverName} numberOfLines={1}>
                  {item.name}
                </Text>
                
                <View style={styles.locationRow}>
                  <Entypo name="location-pin" size={14} color="#f5a53d" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.region}, {item.town}
                  </Text>
                </View>

                <View style={styles.subLocationRow}>
                  <MaterialIcons name="my-location" size={12} color="#999" />
                  <Text style={styles.subLocationText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>

              <View style={styles.actionIcon}>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={50} color="#ddd" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching for a different town or exact location.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Extra space for the footer/tabs
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: 70,
    height: 70,
  },
  carImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  driverOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
  },
  driverThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
    marginLeft: 4,
  },
  subLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subLocationText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  actionIcon: {
    marginLeft: 10,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default SearchCar;