import React, { useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StatusBar
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../assets/common/BaseUrl';
import ListProducts from './ListProducts';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

const Product = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);

  const navigation = useNavigation();
  const myProducts = useSelector((state) => state);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => setToken(res))
        .catch((error) => console.log(error));

      axios.get(`${baseURL}send`)
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
        setLoading(true);
      };
    }, [])
  );

  const searchProducts = (text) => {
    setInput(text);
    setProductFilter(
      productList.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const deleteProducts = (id) => {
    axios.delete(`${baseURL}send/${id}`)
      .then(() => {
        const products = productFilter.filter((item) => item.id !== id);
        setProductFilter(products);
      })
      .catch((error) => console.log(error));
  };

  const ListHeader = () => {
    return (
      <View style={styles.listHeader}>
        <Text style={[styles.headerText, { width: width / 6 }]}>Image</Text>
        <Text style={[styles.headerText, { width: width / 5 }]}>Name</Text>
        <Text style={[styles.headerText, { width: width / 6 }]}>Price</Text>
        <Text style={[styles.headerText, { width: width / 5 }]}>Location</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>Category</Text>
      </View>
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f5a53d" />
      

      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Products</Text>
          <View style={{ width: 28 }} /> 
        </View>
        </View>


      {/* Professional Search Header */}
      <View style={styles.upperHeader}>
        <View style={styles.searchContainer}>
        

          <View style={styles.searchBar}>
            <AntDesign name="search" size={20} color="#666" style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Search products..."
              placeholderTextColor="#999"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onChangeText={(text) => searchProducts(text)}
              value={input}
            />
            {input.length > 0 && (
              <TouchableOpacity onPress={() => searchProducts("")}>
                <AntDesign name="closecircle" size={18} color="#ccc" style={{ marginRight: 10 }} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#07a328" />
          <Text style={{ marginTop: 10, color: '#666' }}>Updating Inventory...</Text>
        </View>
      ) : (
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
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  upperHeader: {
    backgroundColor: "",
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between'
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '82%',
    height: 45,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#333'
  },
  listHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#444",
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   headerContainer: {
    backgroundColor: "#f5a53d",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    bottom:26
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
});