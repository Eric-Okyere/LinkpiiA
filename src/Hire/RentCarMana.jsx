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
  StatusBar
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import Rentcarlist from './RentCarList';

const { width } = Dimensions.get("window");

const RentcarMana = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const navigation = useNavigation();
  const myProducts = useSelector((state) => state);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios.get(`${baseURL}rentcar/user/${myProducts.user}`)
        .then((res) => {
          setProductList(res.data);
          setProductFilter(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
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

  const deleteProducts = async (id) => {
    try {
      const response = await fetch(`${baseURL}rentcar/${id}/deactivate`, { method: 'PUT' });
      if (response.ok) {
        setProductFilter(prev => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Vehicle</Text>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Model Name</Text>
      <Text style={[styles.headerText, { width: width * 0.2 }]}>Daily Rate</Text>
      <Text style={[styles.headerText, { width: width * 0.15 }]}>Status</Text>
      <Feather name="trending-up" size={16} color="#888" style={{ flex: 1, textAlign: 'center' }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e68a00" />
      
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fleet Manager</Text>
        </View>

        <View style={styles.searchBar}>
          <AntDesign name="search" size={20} color="#999" style={{ marginLeft: 12 }} />
          <TextInput
            placeholder="Search your fleet..."
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
            <Rentcarlist {...item} navigation={navigation} delete={deleteProducts} index={index} />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="truck" size={70} color="#ddd" />
          <Text style={styles.emptyText}>You haven't listed any vehicles for rent.</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate("scann")}
          >
            <Text style={styles.addBtnText}>Add a Car</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default RentcarMana;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfcfc" },
  header: {
    backgroundColor: "#f5a53d",
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginLeft: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: '#333' },
  listHeader: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 5
  },
  headerText: { fontWeight: "bold", fontSize: 11, color: "#aaa", textTransform: 'uppercase' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 15, textAlign: 'center' },
  addBtn: { backgroundColor: '#f5a53d', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10, marginTop: 25 },
  addBtnText: { color: 'white', fontWeight: 'bold' }
});