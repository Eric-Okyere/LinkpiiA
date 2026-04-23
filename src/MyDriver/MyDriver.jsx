import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  TextInput,
  Text,
  Image,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Feather, MaterialIcons, Ionicons, EvilIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import SearchCar from "./SearchCar";

const MyDriver = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductFiltered] = useState([]); 
  const [focus, setFocus] = useState(false);
  const [showInputs, setShowInputs] = useState(false); // Controls visibility of the search bars
  
  const [regionInput, setRegionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  const navigation = useNavigation();
  const productsPerPage = 20;

  useEffect(() => {
    const backAction = () => {
      if (showInputs) {
        toggleSearch();
        return true;
      }
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [showInputs]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${baseURL}send/car/approved`);
          const data = await response.json();
          setProducts(data);
          setProductFiltered(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching drivers:", error);
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const handleSearch = (rText, lText) => {
    const filtered = products.filter((item) => {
      const regionTownStr = `${item.region} ${item.town}`.toLowerCase();
      const locationStr = (item.location || "").toLowerCase();
      
      return (
        regionTownStr.includes(rText.toLowerCase()) && 
        locationStr.includes(lText.toLowerCase())
      );
    });
    setProductFiltered(filtered);
  };

  const toggleSearch = () => {
    if (showInputs) {
      // If closing, clear everything
      setRegionInput("");
      setLocationInput("");
      setProductFiltered(products);
      setFocus(false);
    }
    setShowInputs(!showInputs);
  };

  const handleCallDriver = async (item) => {
    setLoadingDetailId(item._id);
    try {
      const response = await fetch(`${baseURL}cars/products/${item._id}`);
      const productData = await response.json();
      setLoadingDetailId(null);
      navigation.navigate("phonecall", productData);
    } catch (error) {
      setLoadingDetailId(null);
      Alert.alert("Connection Error", "Check your connection.");
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#f5a53d" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Drivers</Text>
          <TouchableOpacity onPress={toggleSearch} style={styles.toggleBtn}>
           
            <EvilIcons name={showInputs ? "close" : "search"}  size={24} color="black" />
          </TouchableOpacity>
        </View>

        {showInputs && (
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Entypo name="location-pin" size={18} color="#f5a53d" style={styles.searchIcon} />
              <TextInput
                placeholder="Region or Town"
                style={styles.searchInput}
                value={regionInput}
                autoFocus={true}
                onFocus={() => setFocus(true)}
                onChangeText={(t) => {
                  setRegionInput(t);
                  handleSearch(t, locationInput);
                }}
              />
              {regionInput.length > 0 && (
                <TouchableOpacity onPress={() => { setRegionInput(""); handleSearch("", locationInput); }}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>

            <View style={[styles.searchContainer, { marginTop: 10 }]}>
              <MaterialIcons name="my-location" size={18} color="#999" style={styles.searchIcon} />
              <TextInput
                placeholder="Specific Location"
                style={styles.searchInput}
                value={locationInput}
                onFocus={() => setFocus(true)}
                onChangeText={(t) => {
                  setLocationInput(t);
                  handleSearch(regionInput, t);
                }}
              />
              {locationInput.length > 0 && (
                <TouchableOpacity onPress={() => { setLocationInput(""); handleSearch(regionInput, ""); }}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>

      {focus ? (
        <SearchCar productFiltered={productFiltered} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          <View style={styles.topBanner}>
            <Text style={styles.bannerSub}>Call a driver to move your goods safely.</Text>
          </View>

          {productFiltered.length > 0 ? (
            productFiltered.slice(0, displayedProducts).map((item) => (
              <View key={item._id} style={styles.driverCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.driverInfo}>
                    <Image source={{ uri: item.carpic }} style={styles.driverAvatar} />
                    <View>
                      <Text style={styles.driverName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.carPlate}>{item.carnum || "Logistics Driver"}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.callButton} 
                    onPress={() => handleCallDriver(item)}
                    disabled={loadingDetailId === item._id}
                  >
                    {loadingDetailId === item._id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Feather name="phone-call" size={18} color="white" />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.locationContainer}>
                    <View style={styles.locationRow}>
                      <Entypo name="location-pin" size={16} color="#f5a53d" />
                      <Text style={styles.locationText} numberOfLines={1}>{item.region}, {item.town}</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <MaterialIcons name="my-location" size={14} color="#999" />
                      <Text style={styles.subLocationText} numberOfLines={1}>{item.location}</Text>
                    </View>
                  </View>
                  <Image source={{ uri: item.driverpic }} style={styles.vehicleImage} />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No drivers found.</Text>
            </View>
          )}

          {displayedProducts < productFiltered.length && (
            <TouchableOpacity 
              style={styles.loadMoreBtn} 
              onPress={() => setDisplayedProducts(prev => prev + productsPerPage)}
            >
              <Text style={styles.loadMoreText}>View More Drivers</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb",  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: 'white', 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    zIndex: 10,
    bottom:30
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black'
  },
  toggleBtn: {
    padding: 5
  },
  searchSection: {
    marginTop: 10
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f1f3f6', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 48 
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#000', fontWeight: '500' },
  scrollBody: { padding: 20, paddingBottom: 40, bottom:20 },
  topBanner: { marginBottom: 20 },
  bannerSub: { fontSize: 14, color: "#666", alignSelf: 'center', fontWeight: '500' },
  driverCard: { backgroundColor: "white", borderRadius: 20, padding: 15, marginBottom: 18, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  driverInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  driverAvatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#eee', marginRight: 12 },
  driverName: { fontSize: 16, fontWeight: "700", color: "#111" },
  carPlate: { fontSize: 12, color: "#f5a53d", fontWeight: "600", marginTop: 2 },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#22c55e", justifyContent: 'center', alignItems: 'center' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#f1f1f1', paddingTop: 12 },
  locationContainer: { flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  locationText: { fontSize: 14, fontWeight: "600", color: "#444", marginLeft: 6 },
  subLocationText: { fontSize: 12, color: "#888", marginLeft: 8 },
  vehicleImage: { width: 100, height: 60, borderRadius: 10, backgroundColor: '#f9fafb' },
  loadMoreBtn: { backgroundColor: '#111', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  loadMoreText: { color: "#f5a53d", fontWeight: "bold", fontSize: 15 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: "#999", fontSize: 16 }
});

export default MyDriver;