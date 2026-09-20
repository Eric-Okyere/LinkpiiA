import React, { useCallback, useState } from 'react';
import { 
  ActivityIndicator, 
  Dimensions, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  TextInput,
  SafeAreaView,
  Platform
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign, Ionicons, EvilIcons } from "@expo/vector-icons";
import ListProducts from './ListProducts';
import { useSelector } from 'react-redux';
import baseURL from '../assets/common/BaseUrl';

const { width } = Dimensions.get("window");

const ManageProducts = (props) => {
  const navigation = useNavigation();
  
  // States
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Safely extract user ID from Redux
  const userId = useSelector((state) => state.user?.user?.userId || state.user?.userId);

  useFocusEffect(
    useCallback(() => {
      // Get token for authorized requests if needed
      AsyncStorage.getItem("keepLoggedIn")
        .then((res) => setToken(res))
        .catch((err) => console.log(err));

      if (userId) {
        axios.get(`${baseURL}send/user/${userId}`)
          .then((res) => {
            setProductList(res.data);
            setProductFilter(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error fetching products:", err);
            setLoading(false);
          });
      }

      return () => {
        setProductList([]);
        setProductFilter([]);
        setLoading(true);
      };
    }, [userId])
  );

  const searchProducts = (text) => {
    setSearchText(text);
    if (text === "") {
      setProductFilter(productList);
    } else {
      setProductFilter(
        productList.filter((i) => 
          i.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const deleteProducts = (id) => {
    axios.put(`${baseURL}send/${id}/deactivate`)
      .then(() => {
        const products = productFilter.filter((item) => (item.id || item._id) !== id);
        setProductFilter(products);
      })
      .catch((error) => console.log("Delete error:", error));
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Image</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Image</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Name</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Price</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Approved</Text></View>
      <View style={styles.headerItem}>
        <EvilIcons name="eye" size={28} color="black" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header & Search Bar */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <View style={styles.searchSection}>
          <AntDesign name="search1" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by name"
            style={styles.searchInput}
            value={searchText}
            onChangeText={searchProducts}
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {productFilter.length > 0 ? (
            <FlatList
              data={productFilter}
              ListHeaderComponent={ListHeader}
              renderItem={({ item, index }) => (
                <ListProducts 
                  {...item} 
                  navigation={props.navigation} 
                  delete={deleteProducts} 
                  index={index} 
                />
              )}
              keyExtractor={(item) => item.id || item._id}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You have not posted any agric products yet. Please feel free to sell your agric products.
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5a53d",
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
    backgroundColor: "#f5a53d",
  },
  backButton: {
    marginRight: 10,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  listHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: "#f5a53d",
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerItem: {
    width: width / 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: 'black'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: "center", 
    fontSize: 22,
    color: 'black',
    lineHeight: 30
  }
});

export default ManageProducts;