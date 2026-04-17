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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import ListRest from './ListRest';

const { width } = Dimensions.get("window");

const ManageRest = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const navigation = useNavigation();
  const myProducts = useSelector((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios.get(`${baseURL}food/user/${myProducts}`)
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
    }, [myProducts])
  );

  const searchProducts = (text) => {
    setInput(text);
    setProductFilter(
      productList.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const deleteProducts = (id) => {
    axios.put(`${baseURL}send/${id}/deactivate`)
      .then(() => {
        setProductFilter(prev => prev.filter((item) => item._id !== id));
      })
      .catch((error) => console.log(error));
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Menu Item</Text>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Dish Name</Text>
      <Text style={[styles.headerText, { width: width * 0.2 }]}>Price</Text>
      <Text style={[styles.headerText, { width: width * 0.15 }]}>Status</Text>
      <Feather name="eye" size={16} color="#aaa" style={{ flex: 1, textAlign: 'center' }} />
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
          <Text style={styles.headerTitle}>Restaurant Dashboard</Text>
        </View>

        <View style={styles.searchBar}>
          <AntDesign name="search" size={20} color="#999" style={{ marginLeft: 12 }} />
          <TextInput
            placeholder="Search your menu..."
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
            <ListRest {...item} navigation={navigation} delete={deleteProducts} index={index} />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food-outline" size={70} color="#ddd" />
          <Text style={styles.emptyText}>Your menu is currently empty.</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate("restpost")}
          >
            <Text style={styles.addBtnText}>Create Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ManageRest;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfcfc" },
  header: {
    backgroundColor: "#f5a53d",
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    bottom: 26
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    height: 50,
    elevation: 4,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: '#333' },
  listHeader: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: { fontWeight: "bold", fontSize: 11, color: "#aaa", textTransform: 'uppercase' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 15, textAlign: 'center' },
  addBtn: { backgroundColor: '#f5a53d', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10, marginTop: 25 },
  addBtnText: { color: 'white', fontWeight: 'bold' }
});