import React, { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  View,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  FontAwesome5, 
  MaterialIcons, 
  Feather, 
  Ionicons 
} from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/BaseUrl";

import SearchMechanics from "./SearchMechanics";
import Categories from "./Categories";

const { width } = Dimensions.get("window");
const GRID_CARD_WIDTH = (width - 48) / 2; 

const MechanicsScreen = () => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productCtg, setProductCtg] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [input, setInput] = useState({ name: "", region: "" });
  const [displayedProducts, setDisplayedProducts] = useState(20);

  const navigation = useNavigation();

  // LIVE SEARCH LOGIC: Triggers whenever input.name or input.region changes
  useEffect(() => {
    if (input.name.trim() === "" && input.region.trim() === "") {
      setFocus(false);
      setProductsFiltered(products);
    } else {
      const nameText = input.name.toLowerCase();
      const regionText = input.region.toLowerCase();

      const filtered = products.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(nameText) || 
                          item.description?.toLowerCase().includes(nameText);
        const locMatch = item.region?.toLowerCase().includes(regionText) || 
                         item.town?.toLowerCase().includes(regionText) ||
                         item.location?.toLowerCase().includes(regionText);
        return nameMatch && locMatch;
      });
      setProductsFiltered(filtered);
      setFocus(true);
    }
  }, [input.name, input.region, products]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [prodRes, catRes] = await Promise.all([
            fetch(`${baseURL}newmechmain/approved`),
            fetch(`${baseURL}newmech`)
          ]);
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          
          setProducts(prodData);
          setProductsFiltered(prodData);
          setProductCtg(prodData);
          setInitialState(prodData);
          setCategories(catData);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();

      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (focus) {
          setInput({ name: "", region: "" }); // Resetting input clears focus via useEffect
          setFocus(false);
          return true;
        }
        return false;
      });
      return () => backHandler.remove();
    }, [focus])
  );

  const changeCtg = (ctg) => {
    if (ctg === "all") {
      setProductCtg(initialState);
    } else {
      setProductCtg(products.filter((item) => item.category?._id === ctg));
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#FFC107" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandText}>MECHANIC ON DEMAND</Text>
            <Text style={styles.headerTitle}>Find a Pro</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
                setShowSearch(!showSearch);
                if(showSearch) setInput({ name: "", region: "" });
            }} 
            style={styles.searchToggle}
          >
            <Feather name={showSearch ? "x" : "search"} size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {showSearch && (
          <View style={styles.searchBox}>
            <View style={styles.inputRow}>
              <Feather name="user" size={16} color="#FFC107" />
              <TextInput
                style={styles.input}
                placeholder="Name or service..."
                placeholderTextColor="#999"
                value={input.name}
                onChangeText={(t) => setInput({ ...input, name: t })}
              />
            </View>
            <View style={[styles.inputRow, { marginTop: 10 }]}>
              <Feather name="map-pin" size={16} color="#FFC107" />
              <TextInput
                style={styles.input}
                placeholder="Region, town or area..."
                placeholderTextColor="#999"
                value={input.region}
                onChangeText={(t) => setInput({ ...input, region: t })}
              />
            </View>
           
          </View>
        )}
      </View>

      {focus ? (
        <SearchMechanics productFiltered={productFiltered} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Categories
            categoryFilter={changeCtg}
            productCtg={productCtg}
            categories={categories}
          />

          <View style={styles.listWrapper}>
            {productCtg.length > 0 ? (
              productCtg.slice(0, displayedProducts).map((item) => (
                <TouchableOpacity 
                    key={item._id} 
                    activeOpacity={0.9}
                    style={styles.mechanicCard}
                    onPress={async () => {
                        setLoadingDetail(true);
                        try {
                          const res = await fetch(`${baseURL}newmechmain/products/${item._id}`);
                          const data = await res.json();
                          navigation.navigate("callmech", data);
                        } catch (e) { console.error(e); }
                        finally { setLoadingDetail(false); }
                    }}
                >
                  <View style={styles.cardBody}>
                    <Image source={{ uri: item.picture }} style={styles.workshopImg} resizeMode="cover" />
                    <View style={styles.profilePicWrapper}>
                        {item.picturesec ? (
                             <Image source={{ uri: item.picturesec }} style={styles.profilePic} />
                        ) : (
                            <View style={[styles.profilePic, styles.profilePlaceholder]}>
                                <FontAwesome5 name="user-alt" size={12} color="#CCC" />
                            </View>
                        )}
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.mechName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.specialtyText} numberOfLines={1}>{item.category?.name || "Verified Pro"}</Text>
                    
                    <View style={styles.locContainer}>
                        <View style={styles.locRow}>
                            <Ionicons name="location" size={10} color="#FFC107" />
                            <Text style={styles.locMainText} numberOfLines={1}>
                                {item.town}, {item.region}
                            </Text>
                        </View>
                        <View style={styles.locRowSub}>
                            <MaterialIcons name="my-location" size={10} color="#999" />
                            <Text style={styles.locSubText} numberOfLines={1}>
                                {item.location || "Nearby"}
                            </Text>
                        </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="info" size={40} color="#CCC" />
                <Text style={styles.emptyText}>No professionals available.</Text>
              </View>
            )}
          </View>

          {displayedProducts < productCtg.length && (
            <TouchableOpacity 
              style={styles.loadMore} 
              onPress={() => setDisplayedProducts(prev => prev + 20)}
            >
              <Text style={styles.loadMoreText}>View More Professionals</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {loadingDetail && (
          <View style={styles.fullOverlay}>
              <ActivityIndicator size="large" color="#FFC107" />
          </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA",  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { 
    backgroundColor: "#000", 
    paddingHorizontal: 20, 
    paddingBottom: 25, 
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandText: { color: "#FFC107", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  headerTitle: { color: "#FFF", fontSize: 26, fontWeight: "800" },
  searchToggle: { backgroundColor: "#FFC107", padding: 10, borderRadius: 12 },
  searchBox: { marginTop: 20 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#1A1A1A", paddingHorizontal: 15, borderRadius: 12, height: 45 },
  input: { flex: 1, color: "#FFF", marginLeft: 10, fontSize: 14 },
  searchActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  liveSearchText: { color: '#FFC107', fontSize: 11, fontWeight: '600', fontStyle: 'italic' },

  listWrapper: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 6 },
  mechanicCard: { 
    backgroundColor: "#FFF", 
    width: GRID_CARD_WIDTH, 
    borderRadius: 15, 
    marginBottom: 16, 
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  cardBody: { width: "100%", height: 110 },
  workshopImg: { width: "100%", height: "100%" },
  profilePicWrapper: { position: 'absolute', bottom: -12, right: 8, padding: 2, backgroundColor: '#FFF', borderRadius: 30, elevation: 4 },
  profilePic: { width: 50, height: 50, borderRadius: 60 },
  profilePlaceholder: { backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  cardFooter: { padding: 10, paddingTop: 14 },
  mechName: { fontSize: 13, fontWeight: "800", color: "#333" },
  specialtyText: { fontSize: 11, color: "#FFC107", fontWeight: "700", marginBottom: 6 },
  locContainer: { marginTop: 2, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 6 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  locRowSub: { flexDirection: 'row', alignItems: 'center', paddingLeft: 2 },
  locMainText: { color: '#444', fontSize: 10, fontWeight: '700', marginLeft: 4, flex: 1 },
  locSubText: { color: '#999', fontSize: 9, fontWeight: '500', marginLeft: 4, flex: 1 },
  loadMore: { backgroundColor: "#000", marginHorizontal: 16, padding: 15, borderRadius: 15, alignItems: "center", marginBottom: 30 },
  loadMoreText: { color: "#FFC107", fontWeight: "900", fontSize: 14 },
  emptyState: { flex: 1, width: '100%', alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", marginTop: 10, fontWeight: "600" },
  fullOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }
});

export default MechanicsScreen;