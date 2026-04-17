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
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import ListSpareParts from './ListSpareParts';

const { width } = Dimensions.get("window");

const ManageSpare = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const navigation = useNavigation();
  const myProducts = useSelector((state) => state);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios.get(`${baseURL}sparepartsmainpost/user/${myProducts.user}`)
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
    setProductFilter(
      productList.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const deleteProducts = (id) => {
    axios.put(`${baseURL}spare/${id}/deactivate`)
      .then(() => {
        setProductFilter(prev => prev.filter((item) => item._id !== id));
      })
      .catch((error) => console.log(error));
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Media</Text>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Details</Text>
      <Text style={[styles.headerText, { width: width * 0.2 }]}>Price</Text>
      <Text style={[styles.headerText, { width: width * 0.2 }]}>Status</Text>
      <Feather name="eye" size={16} color="#666" style={{ flex: 1, textAlign: 'center' }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e68a00" />
      
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventory Manager</Text>
        </View>

        <View style={styles.searchBar}>
          <AntDesign name="search" size={20} color="#999" style={{ marginLeft: 12 }} />
          <TextInput
            placeholder="Search by name..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            onChangeText={searchProducts}
            value={input}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f5a53d" />
        </View>
      ) : productFilter.length > 0 ? (
        <FlatList
          data={productFilter}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListSpareParts {...item} navigation={navigation} delete={deleteProducts} index={index} />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="package" size={80} color="#ddd" />
          <Text style={styles.emptyText}>No products found.</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate("PostSpare")}
          >
            <Text style={styles.addBtnText}>Start Selling</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ManageSpare;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#f5a53d",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    bottom: 26
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    height: 45,
    elevation: 3,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 15 },
  listHeader: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  headerText: { fontWeight: "bold", fontSize: 13, color: "#666" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 15, textAlign: 'center' },
  addBtn: { backgroundColor: '#f5a53d', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10, marginTop: 20 },
  addBtnText: { color: 'white', fontWeight: 'bold' }
});