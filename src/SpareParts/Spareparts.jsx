import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar
} from "react-native";
import { AntDesign, Entypo, EvilIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";

// Components
import BuildingCategories from "../Hire/BuildingCategories";
import SearchSpareParts from "./SearchSpareParts";

const { width } = Dimensions.get("window");
const cardWidth = (width - 50) / 2;

const Spareparts = (props) => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const [showSearch, setShowSearch] = useState(false);
  const [pressLoading, setPressLoading] = useState(false);
  const [input, setInput] = useState({ name: "", region: "" });

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [prodRes, catRes] = await Promise.all([
            fetch(`${baseURL}sparepartsmainpost/approved`),
            fetch(`${baseURL}sparecatnew`)
          ]);
          const productsData = await prodRes.json();
          const categoriesData = await catRes.json();

          setProducts(productsData);
          setProductsFiltered(productsData);
          setProductCtg(productsData);
          setInitialState(productsData);
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  // --- Real-time Search Logic ---
  useEffect(() => {
    if (input.name === "" && input.region === "") {
      setProductsFiltered(products);
      setFocus(false);
      return;
    }

    const nameText = input.name.toLowerCase();
    const regionText = input.region.toLowerCase();

    const filtered = products.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      const reg = item.region?.toLowerCase() || "";
      const town = item.town?.toLowerCase() || "";
      
      const matchesName = name.includes(nameText) || desc.includes(nameText);
      const matchesLoc = reg.includes(regionText) || town.includes(regionText);
      
      return matchesName && matchesLoc;
    });

    setProductsFiltered(filtered);
    setFocus(true); // Automatically switch to search view when typing
  }, [input, products]);

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((i) => i.category?._id === ctg));
    }
  };

  const clearSearch = () => {
    setInput({ name: "", region: "" });
    setFocus(false);
    setShowSearch(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f5a53d" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerSubText}>Quality & affordable spare parts</Text>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <EvilIcons name={showSearch ? "close" : "search"} size={24} color="black" />
          </TouchableOpacity>
        </View>

        {showSearch && (
          <View style={styles.searchBox}>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <AntDesign name="search" size={14} color="#AAA" style={styles.searchIcon} />
                <TextInput
                  onChangeText={(text) => setInput({ ...input, name: text })}
                  value={input.name}
                  placeholder="Part name..."
                  style={styles.searchInputMain}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputWrapper, { marginLeft: 8 }]}>
                <Entypo name="location-pin" size={14} color="#AAA" style={styles.searchIcon} />
                <TextInput
                  onChangeText={(text) => setInput({ ...input, region: text })}
                  value={input.region}
                  placeholder="Location..."
                  style={styles.searchInputMain}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            { (input.name || input.region) ? (
               <TouchableOpacity onPress={clearSearch} style={styles.clearLink}>
                  <Text style={styles.clearLinkTxt}>Clear filters</Text>
               </TouchableOpacity>
            ) : null }
          </View>
        )}
      </View>

      {focus ? (
        <SearchSpareParts productFiltered={productFiltered} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <BuildingCategories
            categoryFilter={changeCtg}
            productCtg={productCtg}
            categories={categories}
          />

          {productCtg.length > 0 ? (
            <View style={{ paddingBottom: 120 }}>
              <View style={styles.gridContainer}>
                {productCtg.slice(0, displayedProducts).map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.productCard}
                    onPress={async () => {
                      setPressLoading(true);
                      try {
                        const res = await fetch(`${baseURL}sparepartsmainpost/products/${item._id}`);
                        const data = await res.json();
                        navigation.navigate("sparedetail", data);
                      } catch (e) { console.error(e); }
                      finally { setPressLoading(false); }
                    }}
                  >
                    <Image source={{ uri: item.picture }} style={styles.cardImage} />
                    {item.discount > 0 && (
                      <View style={styles.discountBadge}><Text style={styles.discountText}>-{item.discount}%</Text></View>
                    )}
                    <View style={styles.cardContent}>
                      <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.mainPrice}>Gh₵{item.discount > 0 ? (item.price - (item.price * item.discount / 100)).toLocaleString() : item.price?.toLocaleString()}</Text>
                      </View>
                      <View style={styles.locationRow}>
                        <Entypo name="location-pin" size={10} color="#f5a53d" />
                        <Text numberOfLines={1} style={styles.locLabel}>{item.location}, {item.town}, {item.region}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              {displayedProducts < productCtg.length && (
                <TouchableOpacity onPress={() => setDisplayedProducts(p => p + 20)} style={styles.loadMoreBtn}>
                  <Text style={styles.loadMoreText}>View More Products</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.emptyContainer}><Text>No spare parts available.</Text></View>
          )}
        </ScrollView>
      )}

      {pressLoading && (
        <View style={styles.loadingOverlay}><ActivityIndicator size="large" color="#fff" /></View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerSubText: { fontSize: 13, color: '#666', fontWeight: '600' },
  
  searchBox: { marginTop: 15, backgroundColor: '#f8f9fa', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  inputRow: { flexDirection: 'row' },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 8, borderWidth: 1, borderColor: '#E8E8E8' },
  searchIcon: { marginRight: 5 },
  searchInputMain: { flex: 1, height: 40, fontSize: 13, color: '#333' },
  clearLink: { marginTop: 10, alignSelf: 'flex-end' },
  clearLinkTxt: { color: '#f5a53d', fontSize: 12, fontWeight: '700' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  productCard: { width: cardWidth, backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#f0f0f0' },
  cardImage: { width: '100%', height: 130, backgroundColor: '#f9f9f9' },
  discountBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#f5a53d', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  discountText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cardContent: { padding: 10 },
  productName: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  mainPrice: { fontSize: 13, fontWeight: '800', color: '#f5a53d' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locLabel: { fontSize: 10, color: '#777', marginLeft: 2 },
  loadMoreBtn: { backgroundColor: '#1A1A1A', padding: 14, borderRadius: 12, alignItems: 'center', margin: 20 },
  loadMoreText: { color: '#f5a53d', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }
});

export default Spareparts;