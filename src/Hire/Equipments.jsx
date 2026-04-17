import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Text,
  Platform,
  Linking,
  TextInput,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import {
  Entypo,
  Ionicons,
  Feather,
  EvilIcons
} from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";
import BuildingCategories from "./BuildingCategories";

const { height, width } = Dimensions.get("window");

const Equipments = (props) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]); // This is our "Display" list
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(6);
  const [showSearch, setShowSearch] = useState(false);
  const [pressLoading, setPressLoading] = useState(false);
  const [input, setInput] = useState({ name: "", region: "" });

  const navigation = useNavigation();
  const productsPerPage = 6;

  // 1. Initial Data Fetch
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const productsResponse = await fetch(`${baseURL}equipmentmain/approved`);
          const productsData = await productsResponse.json();
          setProducts(productsData);
          setProductCtg(productsData); // Initial view
          setLoading(false);

          const categoriesResponse = await fetch(`${baseURL}equipmentcat`);
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      fetchData();
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
      return () => backHandler.remove();
    }, [])
  );

  // 2. AUTO-SEARCH LOGIC
  // This effect runs every time 'input.name' or 'input.region' changes
  useEffect(() => {
    if (input.name === "" && input.region === "") {
      setProductCtg(products); // Reset to full list if search is empty
      return;
    }

    const nameText = input.name.toLowerCase();
    const regionText = input.region.toLowerCase();

    const filtered = products.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      const region = item.region?.toLowerCase() || "";
      const town = item.town?.toLowerCase() || "";
      
      const matchesName = name.includes(nameText) || description.includes(nameText);
      const matchesLoc = region.includes(regionText) || town.includes(regionText);

      return matchesName && matchesLoc;
    });

    setProductCtg(filtered);
    setDisplayedProducts(6); // Reset pagination on search
  }, [input.name, input.region, products]);

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(products);
    } else {
      setProductCtg(products.filter((item) => item.category?._id === ctg));
    }
  };

  const loadMoreProducts = () => {
    setDisplayedProducts(displayedProducts + productsPerPage);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f5a53d" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchToggleRow}>
          <Text style={styles.headerTitle}>Rent Equipments</Text>
          <TouchableOpacity 
            style={styles.searchIconBtn} 
            onPress={() => {
              setShowSearch(!showSearch);
              if (showSearch) setInput({ name: "", region: "" }); // Clear search on close
            }}
          >
            <EvilIcons name={showSearch ? "close" : "search"} size={22}  color="black" />
          </TouchableOpacity>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Ionicons name="construct-outline" size={16} color="#888" />
                <TextInput
                  placeholder="Type to search equipment..."
                  style={styles.textInput}
                  onChangeText={(text) => setInput({ ...input, name: text })}
                  value={input.name}
                  autoFocus={true}
                />
              </View>
              <View style={[styles.inputWrapper, { marginTop: 10 }]}>
                <Ionicons name="location-outline" size={16} color="#888" />
                <TextInput
                  placeholder="Location (optional)..."
                  style={styles.textInput}
                  onChangeText={(text) => setInput({ ...input, region: text })}
                  value={input.region}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {!showSearch && (
           <BuildingCategories
           categoryFilter={changeCtg}
           productCtg={productCtg}
           categories={categories}
         />
        )}

        {productCtg.length > 0 ? (
          <View style={styles.listWrapper}>
             {showSearch && (
               <Text style={styles.resultsText}>Found {productCtg.length} results</Text>
             )}
            {productCtg.slice(0, displayedProducts).map((item) => (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                style={styles.card}
                onPress={async () => {
                  try {
                    setPressLoading(true);
                    const res = await fetch(`${baseURL}equipmentmain/products/${item._id}`);
                    const data = await res.json();
                    navigation.navigate("equipmentdetail", data);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setPressLoading(false);
                  }
                }}
              >
                <Image source={{ uri: item.picture }} style={styles.cardImage} />
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                    {item.discount > 0 && <View style={styles.discountBadge}><Text style={styles.discountText}>-{item.discount}%</Text></View>}
                  </View>

                  <Text numberOfLines={1} style={styles.productDesc}>{item.description}</Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                      Gh₵{item.discount > 0 
                        ? (item.price - (item.price * item.discount / 100)).toLocaleString() 
                        : item.price?.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.footerRow}>
                    <View style={styles.locBadge}>
                      <Entypo name="location-pin" size={12} color="#f5a53d" />
                      <Text style={styles.locLabel}>{item.town || item.region}</Text>
                    </View>
                    <Text style={styles.conditionText}>{item.condition}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {displayedProducts < productCtg.length && (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMoreProducts}>
                <Text style={styles.loadMoreTxt}>Load More</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="search" size={50} color="#DDD" />
            <Text style={styles.emptyText}>No matches found for "{input.name}"</Text>
          </View>
        )}
      </ScrollView>

      {pressLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  searchToggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  searchIconBtn: { padding: 8, backgroundColor: "#F5F5F5", borderRadius: 12 },
  
  searchContainer: { backgroundColor: "#F9F9F9", borderRadius: 20, padding: 15, marginBottom: 15 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 12, height: 45, borderWidth: 1, borderColor: "#EEE" },
  textInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#333" },
  
  resultsText: { fontSize: 12, color: "#888", marginBottom: 10, fontWeight: "600" },
  listWrapper: { paddingHorizontal: 20, paddingTop: 10 },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 18, marginBottom: 16, padding: 12, elevation: 3, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  cardImage: { width: 90, height: 90, borderRadius: 14, backgroundColor: "#F0F0F0" },
  cardContent: { flex: 1, marginLeft: 15, justifyContent: "space-between" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  productName: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", flex: 1 },
  productDesc: { fontSize: 12, color: "#777", marginTop: 2 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  priceText: { fontSize: 15, fontWeight: "800", color: "#f5a53d" },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  locBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8F0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  locLabel: { fontSize: 10, fontWeight: "600", color: "#f5a53d", marginLeft: 4 },
  conditionText: { fontSize: 10, color: "#888", fontWeight: "700", textTransform: "uppercase" },
  discountBadge: { backgroundColor: "#000", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discountText: { color: "#f5a53d", fontSize: 10, fontWeight: "900" },

  loadMoreBtn: { backgroundColor: "#1A1A1A", height: 45, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
  loadMoreTxt: { color: "#fff", fontWeight: "700" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", marginTop: 10 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", zIndex: 1000 },
});

export default Equipments;