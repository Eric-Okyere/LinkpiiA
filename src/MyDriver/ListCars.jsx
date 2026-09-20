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
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import CarList from './CarList';

const { width } = Dimensions.get("window");

const ListCars = (props) => {
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
      // Get JWT token from storage
      AsyncStorage.getItem("jwt")
        .then((res) => setToken(res))
        .catch((error) => console.log(error));

      if (userId) {
        axios.get(`${baseURL}cars/users/${userId}`)
          .then((res) => {
            setProductList(res.data);
            setProductFilter(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Error fetching cars:", error);
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
          i.region?.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const deleteProducts = (id) => {
    axios.delete(`${baseURL}cars/${id}`)
      .then(() => {
        const products = productFilter.filter((item) => (item.id || item._id) !== id);
        setProductFilter(products);
      })
      .catch((error) => console.log("Delete error:", error));
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Driver</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Car</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Name</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Region</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Town</Text></View>
      <View style={styles.headerItem}><Text style={styles.headerLabel}>Car No</Text></View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header & Search Bar Section */}
      <View style={styles.topHeader}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by region"
              style={styles.searchInput}
              value={searchText}
              onChangeText={searchProducts}
              placeholderTextColor="#888"
            />
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {productFilter.length > 0 ? (
            <FlatList
              data={productFilter}
              ListHeaderComponent={ListHeader}
              renderItem={({ item, index }) => (
                <CarList 
                  {...item} 
                  navigation={props.navigation} 
                  delete={deleteProducts} 
                  index={index} 
                />
              )}
              keyExtractor={(item) => item._id || item.id}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                You have not posted any car. Post a car for people to hire.
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
  topHeader: {
    backgroundColor: "#f5a53d",
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
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
    justifyContent: 'center',
  },
  headerLabel: {
    fontWeight: "bold",
    fontSize: 11,
    color: 'black',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: "center",
    fontSize: 22,
    color: 'black',
    lineHeight: 30,
  },
});

export default ListCars;