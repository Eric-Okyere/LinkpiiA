import React, { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  Image,
  StatusBar,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import SearchRentCars from "./SearchRentCars";
import Categories from "./RentCarCats";

const { width } = Dimensions.get("window");
// 2-on-a-row calculation
const cardWidth = (width - 40) / 2; 

const HeavyTruck = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductFiltered] = useState([]); 
  const [focus, setFocus] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pressLoading, setPressLoading] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [prodRes, catRes] = await Promise.all([
            fetch(`${baseURL}rentcar/approved`),
            fetch(`${baseURL}rentcarcats`)
          ]);
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          setProducts(prodData);
          setProductFiltered(prodData);
          setProductCtg(prodData);
          setInitialState(prodData);
          setCategories(catData);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      fetchData();

      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (showInputs) { toggleSearch(); return true; }
        return false;
      });
      return () => backHandler.remove();
    }, [showInputs])
  );

  const handleSearch = (nText, lText) => {
    const filtered = products.filter((item) => {
      const nameStr = (item.name || "").toLowerCase();
      const locStr = `${item.region} ${item.town} ${item.location}`.toLowerCase();
      return nameStr.includes(nText.toLowerCase()) && locStr.includes(lText.toLowerCase());
    });
    setProductFiltered(filtered);
    setFocus(nText.length > 0 || lText.length > 0);
  };

  const toggleSearch = () => {
    if (showInputs) {
      setNameInput("");
      setLocationInput("");
      setProductFiltered(products);
      setFocus(false);
    }
    setShowInputs(!showInputs);
  };

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((item) => item.category?._id === ctg));
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#FFC107" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* BRANDED HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.brandName}>HEAVY LOGISTICS</Text>
            <Text style={styles.headerTitle}>Rent Truck</Text>
          </View>
          <TouchableOpacity onPress={toggleSearch} style={styles.searchIconButton}>
            <Feather name={showInputs ? "x" : "search"} size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {showInputs && (
          <View style={styles.searchSection}>
            <View style={styles.inputWrapper}>
              <Feather name="search" size={14} color="#FFC107" style={styles.inputIcon} />
              <TextInput
                placeholder="Find equipment..."
                placeholderTextColor="#666"
                style={styles.textInput}
                value={nameInput}
                autoFocus={true}
                onChangeText={(t) => { setNameInput(t); handleSearch(t, locationInput); }}
              />
            </View>
            <View style={[styles.inputWrapper, { marginTop: 8 }]}>
              <Feather name="map-pin" size={14} color="#FFC107" style={styles.inputIcon} />
              <TextInput
                placeholder="Location..."
                placeholderTextColor="#666"
                style={styles.textInput}
                value={locationInput}
                onChangeText={(t) => { setLocationInput(t); handleSearch(nameInput, t); }}
              />
            </View>
          </View>
        )}
      </View>

      {focus ? (
        <SearchRentCars productFiltered={productFiltered} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Categoris stay as is but will be themed by your sub-component */}
          <Categories categoryFilter={changeCtg} categories={categories} />
          
         

          <View style={styles.grid}>
            {productCtg.map((item) => (
              <Pressable
                key={item._id}
                onPress={async () => {
                  setPressLoading(true);
                  try {
                    const res = await fetch(`${baseURL}rentcar/products/${item._id}`);
                    const data = await res.json();
                    navigation.navigate("rentcardetail", data);
                  } catch (e) { console.error(e); }
                  setPressLoading(false);
                }}
                style={styles.card}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.picture }} style={styles.image} resizeMode="cover" />
                  <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>₵{item.price}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.nameText} numberOfLines={1}>{item.description}</Text>
                  
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={10} color="#FFC107" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {item.location ? `${item.location}, ` : ""}{item.town}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.verifyRow}>
                      <Ionicons name="shield-checkmark" size={12} color="#FFC107" />
                      <Text style={styles.verifyText}>Verified</Text>
                    </View>
                    <Feather name="arrow-up-right" size={14} color="#000" />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {pressLoading && (
        <View style={styles.fullOverlay}>
          <ActivityIndicator size="large" color="#FFC107" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    paddingHorizontal: 16, 
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#000', // Set Header to Black
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandName: { fontSize: 10, color: '#FFC107', fontWeight: '900', letterSpacing: 2 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', marginTop: -2 },
  searchIconButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#FFC107', // Search button in #FFC107
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  searchSection: { marginTop: 15 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1A1A', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    height: 46,
    borderWidth: 1,
    borderColor: '#333'
  },
  inputIcon: { marginRight: 8 },
  textInput: { flex: 1, fontSize: 14, color: '#FFF' },
  
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    marginTop: 25, 
    marginBottom: 15 
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#000', marginRight: 8 },
  countBadge: { backgroundColor: '#FFC107', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  countText: { color: '#000', fontSize: 10, fontWeight: '900' },

  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  card: { 
    backgroundColor: "#FFF", 
    borderRadius: 18, 
    width: cardWidth,
    marginBottom: 15, 
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: { width: '100%', height: 110 },
  image: { width: '100%', height: '100%' },
  priceTag: { 
    position: 'absolute', 
    bottom: 8, 
    right: 8, 
    backgroundColor: '#000', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  priceTagText: { color: '#FFC107', fontSize: 12, fontWeight: '900' },
  
  cardContent: { padding: 10 },
  nameText: { fontSize: 14, fontWeight: '800', color: '#000', marginBottom: 2 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationText: { fontSize: 10, color: '#666', marginLeft: 3, flex: 1, fontWeight: '500' },
  
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8
  },
  verifyRow: { flexDirection: 'row', alignItems: 'center' },
  verifyText: { fontSize: 9, color: '#000', fontWeight: '900', marginLeft: 3, textTransform: 'uppercase' },
  
  fullOverlay: { 
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999
  }
});

export default HeavyTruck;