import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,Image
} from "react-native";
import { EvilIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import BuildingCategories from "./BuildingCategories";
import SearchBuildings from "./SearchBuilding"; // Import the search component

const { width } = Dimensions.get("window");
const cardWidth = (width / 2) - 22; 

const BuildingScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]); 
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(6);
  const [showSearch, setShowSearch] = useState(false);
  const [focus, setFocus] = useState(false); // Track search focus
  const [pressLoading, setPressLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRegion, setSearchRegion] = useState("");

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${baseURL}buildings/approved`);
          const data = await res.json();
          setProducts(data);
          setProductCtg(data);
          setInitialState(data);
          setLoading(false);

          const catRes = await fetch(`${baseURL}buildingcats`);
          const catData = await catRes.json();
          setCategories(catData);
        } catch (err) {
          console.error("Fetch Error:", err);
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  // Real-time Search Logic
  useEffect(() => {
    const nameFilter = searchTerm.toLowerCase();
    const regionFilter = searchRegion.toLowerCase();

    if (nameFilter === "" && regionFilter === "") {
        setProductCtg(initialState);
        return;
    }

    const filtered = products.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      const region = (item.region || "").toLowerCase();
      const town = (item.town || "").toLowerCase();
      const location = (item.location || "").toLowerCase();

      const matchesName = name.includes(nameFilter) || description.includes(nameFilter);
      const matchesRegion = region.includes(regionFilter) || town.includes(regionFilter) || location.includes(regionFilter);

      return matchesName && matchesRegion;
    });

    setProductCtg(filtered);
  }, [searchTerm, searchRegion, products]);

  const changeCtg = (ctg) => {
    setFocus(false);
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((i) => i.category?._id === ctg));
    }
  };

  const onBlur = () => {
    setFocus(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Premium Selection</Text>
          <Text style={styles.headerTitle}>Room to Rent</Text>
        </View>
        <TouchableOpacity 
          onPress={() => {
              setShowSearch(!showSearch);
              if (showSearch) {
                  setFocus(false);
                  setSearchTerm("");
                  setSearchRegion("");
              }
          }}
          style={styles.searchToggle}
        >
          <Ionicons name={showSearch ? "close" : "search"} size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Inputs */}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <View style={styles.inputGroup}>
              <EvilIcons name="search" size={24} color="#666" />
              <TextInput
                placeholder="Search properties..."
                onFocus={() => setFocus(true)}
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <Entypo name="location" size={16} color="#666" />
              <TextInput
                placeholder="Region or Town..."
                onFocus={() => setFocus(true)}
                value={searchRegion}
                onChangeText={setSearchRegion}
                style={styles.input}
              />
            </View>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#f5a53d" />
        </View>
      ) : (
        <>
          {/* Conditional Rendering: Search Result vs Main View */}
          {focus ? (
            <SearchBuildings 
                productFiltered={productCtg} 
            />
          ) : (
            <FlatList
              ListHeaderComponent={
                <BuildingCategories
                  categories={categories}
                  categoryFilter={changeCtg}
                />
              }
              data={productCtg.slice(0, displayedProducts)}
              renderItem={({ item }) => (
                <PropertyCard item={item} navigation={navigation} setPressLoading={setPressLoading} />
              )}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={() => (
                displayedProducts < productCtg.length ? (
                  <TouchableOpacity style={styles.loadBtn} onPress={() => setDisplayedProducts(prev => prev + 6)}>
                    <Text style={styles.loadBtnText}>Load More</Text>
                  </TouchableOpacity>
                ) : null
              )}
            />
          )}
        </>
      )}

      {pressLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

// Extracted PropertyCard for cleaner code
const PropertyCard = ({ item, navigation, setPressLoading }) => {
    const discountedPrice = item.discount > 0 
      ? (item.price - (item.price * item.discount) / 100) 
      : item.price;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={async () => {
                setPressLoading(true);
                try {
                    const res = await fetch(`${baseURL}buildings/products/${item._id}`);
                    const data = await res.json();
                    navigation.navigate("Builddetail", data);
                } catch (err) {
                    console.log(err);
                } finally {
                    setPressLoading(false);
                }
            }}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.picture }} style={styles.image} />
                {item?.discount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.discount}% OFF</Text>
                    </View>
                )}
            </View>
            <View style={styles.cardContent}>
                <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.descriptionText}>{item.description}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>Gh₵{discountedPrice.toLocaleString()}</Text>
                    {item?.discount > 0 && <Text style={styles.oldPrice}>Gh₵{item.price.toLocaleString()}</Text>}
                </View>
                <View style={styles.locationGroup}>
                    <View style={styles.locRow}>
                        <Entypo name="location-pin" size={12} color="#f5a53d" />
                        <Text numberOfLines={1} style={styles.locationText}>{item.town}, {item.region}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", bottom:10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerSub: { fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  searchToggle: { backgroundColor: '#000', padding: 10, borderRadius: 12 },
  searchWrapper: { paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#fff' },
  searchBox: { backgroundColor: '#fff', borderRadius: 15, padding: 12, borderWidth: 1, borderColor: '#EEE' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F3F5', borderRadius: 10, paddingHorizontal: 12, marginBottom: 8, height: 44 },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  row: { justifyContent: 'space-between', paddingHorizontal: 15 },
  listContainer: { paddingBottom: 40, paddingTop: 10 },
  card: { width: cardWidth, backgroundColor: "#fff", borderRadius: 16, marginBottom: 18, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, overflow: 'hidden' },
  imageContainer: { width: '100%', height: 115 },
  image: { width: "100%", height: "100%" },
  badge: { position: "absolute", top: 8, right: 8, backgroundColor: "#E74C3C", paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "900" },
  cardContent: { padding: 12 },
  title: { fontWeight: "700", fontSize: 14, color: "#1A1A1A" },
  descriptionText: { fontSize: 11, color: "#777", marginTop: 2 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  price: { color: "#f5a53d", fontWeight: "800", fontSize: 15 },
  oldPrice: { textDecorationLine: "line-through", color: "#BBB", fontSize: 10, marginLeft: 6 },
  locationGroup: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 8 },
  locRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 10, color: "#444", marginLeft: 4, fontWeight: '600' },
  loadBtn: { alignItems: "center", backgroundColor: "#000", paddingVertical: 14, marginHorizontal: 50, borderRadius: 12, marginTop: 15, marginBottom: 70 },
  loadBtnText: { color: "#f5a53d", fontWeight: "700", fontSize: 13 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", zIndex: 1000 }
});

export default BuildingScreen;