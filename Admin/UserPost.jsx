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
  StatusBar,
  ScrollView
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";
import { 
  AntDesign, 
  MaterialCommunityIcons, 
  MaterialIcons, 
  FontAwesome6, 
  FontAwesome, 
  Ionicons,
  Feather 
} from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import baseURL from '../assets/common/BaseUrl';
import ListProducts from './ListProducts';

const { width } = Dimensions.get("window");

const UserPost = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const navigation = useNavigation();
  const userId = useSelector((state) => state.user?.user?.userId || state.user);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios.get(`${baseURL}fashionpost/user/${userId}`)
        .then((res) => {
          setProductList(res.data);
          setProductFilter(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });

      return () => {
        setProductList([]);
        setProductFilter([]);
      };
    }, [userId])
  );

  const searchProducts = (text) => {
    setInput(text);
    setProductFilter(
      productList.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const deleteProducts = (id) => {
    axios.put(`${baseURL}fashionpost/${id}/deactivate`)
      .then(() => {
        setProductFilter(prev => prev.filter((item) => item._id !== id));
      })
      .catch((error) => console.log(error));
  };

  const NavItem = ({ icon, label, target, type = "MaterialCommunityIcons" }) => {
    const IconComponent = { 
      MaterialCommunityIcons, MaterialIcons, FontAwesome6, FontAwesome, Ionicons 
    }[type];
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate(target)} style={styles.navItem}>
        <View style={styles.navIconBox}>
          <IconComponent name={icon} size={22} color="#f5a53d" />
        </View>
        <Text style={styles.navLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.headerText, { width: width * 0.18 }]}>Item</Text>
      <Text style={[styles.headerText, { width: width * 0.25 }]}>Name</Text>
      <Text style={[styles.headerText, { width: width * 0.2 }]}>Price</Text>
      <Text style={[styles.headerText, { width: width * 0.15 }]}>Status</Text>
      <Feather name="bar-chart-2" size={14} color="#aaa" style={{ flex: 1, textAlign: 'right' }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Top Professional Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.dashboardTitle}>Merchant Control Center</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScroll}>
          <NavItem icon="truck-cargo-container" label="Services" target="servmana" />
          <NavItem icon="select-inverse" label="Agric" target="manage" />
          <NavItem icon="car-repair" label="Parts" target="spareparts" type="MaterialIcons" />
          <NavItem icon="shop" label="Shop" target="shop" type="FontAwesome6" />
          <NavItem icon="building" label="Estate" target="BuildingMana" type="FontAwesome" />
          <NavItem icon="car" label="Rentals" target="rentdash" type="Ionicons" />
          <NavItem icon="tools" label="Equip" target="equipmana" type="FontAwesome6" />
          <NavItem icon="fast-food" label="Food" target="manarest" type="Ionicons" />
        </ScrollView>
      </View>

      <View style={styles.body}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>General Inventory</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{productFilter.length}</Text></View>
        </View>

        <View style={styles.searchWrapper}>
          <Feather name="search" size={18} color="#999" />
          <TextInput
            onChangeText={searchProducts}
            value={input}
            placeholder="Search crops, produce..."
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#f5a53d" />
        ) : (
          <FlatList
            data={productFilter}
            ListHeaderComponent={ListHeader}
            renderItem={({ item, index }) => (
              <ListProducts {...item} navigation={props.navigation} delete={deleteProducts} index={index} />
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products found in your inventory.</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", marginBottom:60 },
  topHeader: {
    backgroundColor: "#2c3e50",
    paddingTop: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    bottom:30
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  dashboardTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  navScroll: { paddingLeft: 15, paddingBottom: 20 },
  navItem: { alignItems: 'center', marginRight: 20 },
  navIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  navLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  badge: { backgroundColor: '#f5a53d', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 10 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#333' },
  listHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 5
  },
  headerText: { fontSize: 11, fontWeight: 'bold', color: '#bbb', textTransform: 'uppercase' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 }
});