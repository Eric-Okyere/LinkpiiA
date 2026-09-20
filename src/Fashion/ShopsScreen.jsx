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
  Image, KeyboardAvoidingView, Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import baseURL from "../../assets/common/BaseUrl";
import ConfettiCannon from "react-native-confetti-cannon";
import SearchShop from "./SearchShop";
import ShopCats from "./ShopCats";
import LikeButton from "../components/Drawer/LikeButton";

const { width } = Dimensions.get("window");

const ProductScreen = (props) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const myProducts = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState(20);
  const [showSearch, setShowSearch] = useState(false);
  const [input, setInput] = useState({ name: "", region: "" });
  const [pressLoading, setPressLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [likedProducts, setLikedProducts] = useState({});

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setShowSearch(false);
      setInput({ name: "", region: "" });

      const fetchData = async () => {
        try {
          const productsResponse = await fetch(`${baseURL}shops/approved`);
          const productsData = await productsResponse.json();
          setProducts(productsData);
          setProductsFiltered(productsData);
          setProductCtg(productsData);
          setInitialState(productsData);

          const categoriesResponse = await fetch(`${baseURL}shopscat`);
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data: ", error);
          setLoading(false);
        }
      };
      fetchData();
    }, [myProducts])
  );

  useEffect(() => {
    const nameText = input.name?.toLowerCase() || "";
    const regionText = input.region?.toLowerCase() || "";

    if (!nameText && !regionText) {
      setProductsFiltered(products);
      return;
    }

    const filtered = products.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      const region = item.region?.toLowerCase() || "";
      const town = item.town?.toLowerCase() || "";
      const location = item.location?.toLowerCase() || "";

      const matchesName = name.includes(nameText) || description.includes(nameText);
      const matchesRegion = region.includes(regionText) || town.includes(regionText) || location.includes(regionText);

      if (nameText && regionText) return matchesName && matchesRegion;
      return nameText ? matchesName : matchesRegion;
    });

    setProductsFiltered(filtered);
  }, [input, products]);

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((item) => item.category?._id === ctg));
    }
  };

  const renderProductItem = ({ item }) => (
    <Pressable
      onPress={async () => {
        try {
          setPressLoading(true);
          const response = await fetch(`${baseURL}shops/products/${item._id}`);
          const productData = await response.json();
          navigation.navigate("Single", productData);
        } catch (error) {
          console.error("Error viewing product:", error);
        } finally {
          setPressLoading(false);
        }
      }}
      style={{
        flex: 1,
        margin: 6,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        padding: 8,
        elevation: 4,
      }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: item.picture }}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />
        <View style={{ position: "absolute", top: 6, right: 6 }}>
          <LikeButton
            itemId={item._id}
            liked={!!likedProducts[item._id]}
            onToggle={(isLiked) => {
              setLikedProducts((prev) => ({
                ...prev,
                [item._id]: isLiked,
              }));
              if (isLiked) setCelebrate(true);
            }}
          />
        </View>
      </View>

      <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 13, marginTop: 6 }}>
        {item.name}
      </Text>

      <View style={{ marginTop: 2 }}>
        <Text numberOfLines={1} style={{ fontSize: 12, color: "#f5a53d" }}>{item.description}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
        <Text numberOfLines={1} style={{ fontSize: 9, color: "#555" }}>
          {item.region?.trim()}, {item.town?.trim()}, {item.location?.trim()}
        </Text>
      </View>
    </Pressable>
  );


  return (
    <View style={[styles.mainWrapper, { paddingTop: insets.top }]}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#f5a53d" />
        </View>
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            
            {/* STICKY HEADER AREA */}
            <View >
              <View style={styles.headerTopRow}>
                {showSearch &&
                  <TouchableOpacity 
                    onPress={() => {
                      setInput({ name: "", region: "" });
                      setShowSearch(false);
                    }}
                    style={styles.iconButton}
                  >
                    <Ionicons name="close-outline" size={28} color="black" />
                  </TouchableOpacity>
                }

                {!showSearch && (
                  <TouchableOpacity 
                    onPress={() => setShowSearch(true)}
                    style={styles.iconButton}
                  >
                    <EvilIcons name="search" size={34} color="black" />
                  </TouchableOpacity>
                )}
              </View>

              {/* DUAL SEARCH INPUTS */}
              {showSearch && (
                <View style={styles.searchBarWrapper}>
                  <TextInput
                    onChangeText={(text) => setInput((prev) => ({ ...prev, name: text }))}
                    value={input.name}
                    placeholder="Search name..."
                    placeholderTextColor="#888"
                    style={[styles.searchInput, styles.inputLeft]}
                  />
                  <TextInput
                    onChangeText={(text) => setInput((prev) => ({ ...prev, region: text }))}
                    value={input.region}
                    placeholder="Location..."
                    placeholderTextColor="#888"
                    style={[styles.searchInput, styles.inputRight]}
                  />
                </View>
              )}
            </View>

            {showSearch ? (
              <SearchShop productFiltered={productFiltered} />
            ) : (
              <View style={{ flex: 1 }}>
                <ShopCats
                  categoryFilter={changeCtg}
                  categories={categories}
                />
                <FlatList
                  data={productCtg.slice(0, displayedProducts)}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item._id}
                  numColumns={3}
                  onEndReached={() => setDisplayedProducts(prev => prev + 20)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() => 
                    displayedProducts < productCtg.length ? (
                      <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#f5a53d" />
                    ) : null
                  }
                  contentContainerStyle={[
                    styles.listContent, 
                    { paddingBottom: insets.bottom + 80 }
                  ]}
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      )}

      {/* OVERLAYS */}
      {pressLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {celebrate && (
        <ConfettiCannon
          count={100}
          origin={{ x: width / 2, y: 0 }}
          fadeOut
          onAnimationEnd={() => setCelebrate(false)}
        />
      )}
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    bottom: 60,
  },
  headerTopRow: {
    alignSelf: "flex-end",
    bottom: 30,
    right: 16,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#000",
    letterSpacing: -0.8,
  },
  iconButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    top:14
  },
  searchBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#000",
    top:4
  },
  inputLeft: {
    width: "48%",
    backgroundColor: "#F2F2F2",
  },
  inputRight: {
    width: "48%",
    backgroundColor: "#E8E8E8",
  },
  listContent: {
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});