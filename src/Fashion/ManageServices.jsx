import React, { useCallback, useState } from 'react';
import { 
  ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, 
  TouchableOpacity, View, TextInput, StatusBar, SafeAreaView 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import ListServices from './ListServices';

const { width } = Dimensions.get("window");

const ManageServices = () => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  
  const navigation = useNavigation();
  const myProducts = useSelector((state) => state);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios.get(`${baseURL}services/user/${myProducts.user}`)
        .then((res) => {
          setProductList(res.data);
          setProductFilter(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      return () => {
        setProductList([]);
        setProductFilter([]);
      };
    }, [myProducts.user])
  );

  const searchProducts = (text) => {
    setInput(text);
    if (text === "") {
      setProductFilter(productList);
    } else {
      setProductFilter(
        productList.filter((i) => 
          i.name?.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const deleteProducts = (id) => {
    axios.put(`${baseURL}services/${id}/deactivate`)
      .then(() => {
        const products = productFilter.filter((item) => item._id !== id);
        setProductFilter(products);
      })
      .catch((error) => console.log(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Services</Text>
          <View style={{ width: 28 }} /> 
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          
          <EvilIcons name="search" size={24} style={styles.searchIcon} color="#666"/>
          <TextInput
            placeholder="Search your listings..."
            style={styles.searchInput}
            value={input}
            onChangeText={(text) => searchProducts(text)}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={productFilter}
          renderItem={({ item, index }) => (
            <ListServices 
              {...item} 
              navigation={navigation} 
              delete={deleteProducts} 
              index={index} 
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cloud-offline-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>No services found.</Text>
              <Text style={styles.emptySubText}>Try posting a new fashion or electronic product!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerContainer: {
    backgroundColor: "#f5a53d",
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'black',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    elevation: 3,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  listContent: { padding: 15, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 20 },
  emptySubText: { textAlign: 'center', color: '#666', marginTop: 10, lineHeight: 22 }
});

export default ManageServices;