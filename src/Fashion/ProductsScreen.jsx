import React, { useCallback, useState, useEffect, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import baseURL from "../../assets/common/BaseUrl";
import Categories from "./Categories";
import ConfettiCannon from "react-native-confetti-cannon";
import Card from "./Card";
import SearchProducts from "./SearchProducts";

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
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [pressLoading, setPressLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setShowSearch(false);
      setInput({ name: "", region: "" });
      setSelectedRegion("all");

      const fetchData = async () => {
        try {
          const productsResponse = await fetch(`${baseURL}fashionpost/approved`);
          const productsData = await productsResponse.json();
          setProducts(productsData);
          setProductsFiltered(productsData);
          setProductCtg(productsData);
          setInitialState(productsData);

          const categoriesResponse = await fetch(`${baseURL}fashion`);
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

  // Distinct regions present in the loaded listings, for the region
  // dropdown - mirrors the website's Home.jsx (same computation, same
  // "All regions" default).
  const regions = useMemo(
    () => Array.from(new Set(products.map((p) => p.region).filter(Boolean))).sort(),
    [products]
  );

  const visibleProducts = useMemo(
    () =>
      selectedRegion === "all"
        ? productCtg
        : productCtg.filter((item) => item.region === selectedRegion),
    [productCtg, selectedRegion]
  );

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((item) => item.category?._id === ctg));
    }
  };

  // Memoized so FlatList's `data` prop keeps a stable reference across
  // re-renders (e.g. search/category/region filter changes that don't
  // affect pagination) - a fresh .slice() array every render was the
  // main cause of the 'VirtualizedList: large list is slow to update'
  // warning, since FlatList had to treat every render as a full data change.
  const paginatedProducts = useMemo(
    () => visibleProducts.slice(0, displayedProducts),
    [visibleProducts, displayedProducts]
  );

  // useCallback so renderItem keeps a stable reference too - paired with
  // Card now wrapped in React.memo, this lets FlatList actually skip
  // re-rendering cards whose own item/props haven't changed.
  const renderProductItem = useCallback(
    ({ item }) => (
      <Card
        item={item}
        navigation={navigation}
        setPressLoading={setPressLoading}
        setCelebrate={setCelebrate}
      />
    ),
    [navigation, setPressLoading, setCelebrate]
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
              <SearchProducts productFiltered={productFiltered} />
            ) : (
              <View style={{ flex: 1 }}>
                <View style={styles.filterRow}>
                  <View style={styles.categoriesWrap}>
                    <Categories
                      categoryFilter={changeCtg}
                      categories={categories}
                    />
                  </View>
                  {regions.length > 0 && (
                    <TouchableOpacity
                      style={styles.regionChip}
                      onPress={() => setRegionModalVisible(true)}
                    >
                      <Text style={styles.regionChipText} numberOfLines={1}>
                        {selectedRegion === "all" ? "All regions" : selectedRegion}
                      </Text>
                      <Ionicons name="chevron-down" size={14} color="#333" />
                    </TouchableOpacity>
                  )}
                </View>
                <FlatList
                  data={paginatedProducts}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item._id}
                  numColumns={3}
                  onEndReached={() => setDisplayedProducts(prev => prev + 20)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() => 
                    displayedProducts < visibleProducts.length ? (
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

            <Modal transparent visible={regionModalVisible} animationType="fade">
              <TouchableOpacity
                style={styles.regionOverlay}
                activeOpacity={1}
                onPress={() => setRegionModalVisible(false)}
              >
                <View style={styles.regionMenu}>
                  <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
                    <TouchableOpacity
                      style={styles.regionOption}
                      onPress={() => {
                        setSelectedRegion("all");
                        setRegionModalVisible(false);
                      }}
                    >
                      <Text style={styles.regionOptionText}>All regions</Text>
                    </TouchableOpacity>
                    {regions.map((region) => (
                      <TouchableOpacity
                        key={region}
                        style={styles.regionOption}
                        onPress={() => {
                          setSelectedRegion(region);
                          setRegionModalVisible(false);
                        }}
                      >
                        <Text style={styles.regionOptionText}>{region}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
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
  },
  headerTopRow: {
    alignSelf: "flex-end",
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
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  categoriesWrap: {
    flex: 1,
  },
  regionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 32,
    marginLeft: 8,
    maxWidth: 140,
  },
  regionChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },
  regionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  regionMenu: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 6,
  },
  regionOption: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  regionOptionText: {
    fontSize: 15,
    color: "#222",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});