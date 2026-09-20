import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, EvilIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import baseURL from "../../assets/common/BaseUrl";
import ShopCats from "./ShopCats";
import LikeButton from "../components/Drawer/LikeButton";
import ConfettiCannon from "react-native-confetti-cannon";
import SearchServices from "./SearchService";

const { height, width } = Dimensions.get("window");

const Services = () => {
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
  const [celebrate, setCelebrate] = useState(false);
  const [likedProducts, setLikedProducts] = useState({});

  const navigation = useNavigation();
  const userId = useSelector((state) => state.user);
  const productsPerPage = 20;

  // --- Data Fetching ---
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setFocus(false);
      setShowSearch(false);
      setInput({ name: "", region: "" });

      const fetchData = async () => {
        try {
          const [productsRes, catsRes] = await Promise.all([
            fetch(`${baseURL}services/approved`),
            fetch(`${baseURL}servcat`)
          ]);
          
          const productsData = await productsRes.json();
          const categoriesData = await catsRes.json();

          setProducts(productsData);
          setProductsFiltered(productsData);
          setProductCtg(productsData);
          setInitialState(productsData);
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching services:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  // --- Search Logic ---
  useEffect(() => {
    const nameQuery = input.name?.toLowerCase() || "";
    const regionQuery = input.region?.toLowerCase() || "";

    if (!nameQuery && !regionQuery) {
      setProductsFiltered(products);
      return;
    }

    const filtered = products.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      const reg = item.region?.toLowerCase() || "";
      const town = item.town?.toLowerCase() || "";

      const matchesName = name.includes(nameQuery) || desc.includes(nameQuery);
      const matchesLoc = reg.includes(regionQuery) || town.includes(regionQuery);

      if (nameQuery && regionQuery) return matchesName && matchesLoc;
      return nameQuery ? matchesName : matchesLoc;
    });

    setProductsFiltered(filtered);
  }, [input, products]);

  const toggleSearch = () => {
    if (showSearch) {
      setFocus(false);
      setShowSearch(false);
      setInput({ name: "", region: "" });
    } else {
      setShowSearch(true);
      setFocus(true);
    }
  };

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((i) => i.category?._id === ctg));
    }
  };

  // --- Renderers ---
  const renderProductItem = ({ item }) => (
    <Pressable
      onPress={async () => {
        try {
          setPressLoading(true);
          const res = await fetch(`${baseURL}services/products/${item._id}`);
          const data = await res.json();
          navigation.navigate("Singleserv", data);
        } catch (e) {
          console.error(e);
        } finally {
          setPressLoading(false);
        }
      }}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.picture }} style={styles.cardImage} />
        <View style={styles.likeOverlay}>
          <LikeButton
            itemId={item._id}
            liked={!!likedProducts[item._id]}
            onToggle={(isLiked) => {
              setLikedProducts(p => ({ ...p, [item._id]: isLiked }));
              if (isLiked) setCelebrate(true);
            }}
          />
        </View>
      </View>
      <Text numberOfLines={1} style={styles.cardTitle}>{item.name}</Text>
      <Text numberOfLines={1} style={styles.cardPrice}>{item.description}</Text>
      <Text numberOfLines={1} style={styles.cardLoc}>{item.region}, {item.town}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#f5a53d" /></View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={toggleSearch} style={styles.searchIconBtn}>
                {showSearch ? (
                  <Ionicons name="close-outline" size={24} color="black" />
                ) : (
                  <EvilIcons name="search" size={36} color="black" />
                )}
              </TouchableOpacity>
            </View>

            {showSearch && (
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Service name..."
                  value={input.name}
                  onChangeText={(t) => setInput(p => ({ ...p, name: t }))}
                  onFocus={() => setFocus(true)}
                  style={[styles.input, styles.inputLeft]}
                />
                <TextInput
                  placeholder="Location..."
                  value={input.region}
                  onChangeText={(t) => setInput(p => ({ ...p, region: t }))}
                  onFocus={() => setFocus(true)}
                  style={[styles.input, styles.inputRight]}
                />
              </View>
            )}
          </View>

          {focus ? (
            <SearchServices productFiltered={productFiltered} />
          ) : (
            <View style={{ flex: 1, bottom: 70 }}>
              <ShopCats categoryFilter={changeCtg} productCtg={productCtg} categories={categories} />
              {productCtg.length > 0 ? (
                <FlatList
                  data={productCtg.slice(0, displayedProducts)}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item._id}
                  numColumns={3}
                  onEndReached={() => setDisplayedProducts(p => p + productsPerPage)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() => (displayedProducts < productCtg.length ? <ActivityIndicator color="#f5a53d" style={{ margin: 20 }} /> : null)}
                  contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 80 }}
                />
              ) : (
                <View style={styles.center}><Text>No services found.</Text></View>
              )}
            </View>
          )}

          {pressLoading && (
            <View style={styles.overlay}><ActivityIndicator size="large" color="#fff" /></View>
          )}

          {celebrate && (
            <ConfettiCannon count={100} origin={{ x: width / 2, y: 0 }} fadeOut onAnimationEnd={() => setCelebrate(false)} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {  backgroundColor: "#fff", bottom:32 },
  headerTop: { alignItems:"flex-end", bottom:38, right:10 },
  logoText: { fontSize: 22, fontWeight: "bold", color: "#000" },
  searchIconBtn: { padding: 5 },
  searchContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal:4, bottom: 20 },
  input: { height: 45, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: "#000" },
  inputLeft: { width: "48%", backgroundColor: "#f2f2f2" },
  inputRight: { width: "48%", backgroundColor: "#e8e8e8" },
  card: { flex: 1, margin: 5, backgroundColor: "#f9f9f9", borderRadius: 12, padding: 8, elevation: 3 },
  imageContainer: { position: "relative" },
  cardImage: { width: "100%", aspectRatio: 1, borderRadius: 10 },
  likeOverlay: { position: "absolute", top: 5, right: 5 },
  cardTitle: { fontWeight: "bold", fontSize: 13, marginTop: 5, color: "#333" },
  cardPrice: { fontSize: 11, color: "#f5a53d", fontWeight: "600" },
  cardLoc: { fontSize: 9, color: "#888", marginTop: 2 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 1000 },
});

export default Services;