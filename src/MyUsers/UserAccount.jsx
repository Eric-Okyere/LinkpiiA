import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Text, 
  Image, 
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { 
  AntDesign, 
  MaterialCommunityIcons, 
  Feather,
  Ionicons,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  MaterialIcons
} from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loggedOut } from '../Redux/actions';
import axios from 'axios';
import baseURL from '../../assets/common/BaseUrl';

const { width } = Dimensions.get("window");

const UserAccount = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = useSelector((state) => state.user);

    const fetchUserData = async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}userbyid/${userId}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Logout", 
                onPress: () => {
                    dispatch(loggedOut(""));
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'login' }],
                    });
                } 
            }
        ]);
    };

    // Logic for Profile Initials
    const getFirstLetter = () => {
        if (userData?.name) {
            return userData.name.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <View style={styles.container}>
            {/* --- HEADER SECTION --- */}
            <View style={styles.header}>
                <Image 
                    style={styles.logo} 
                    source={require('../../assets/Farmer.png')} 
                    resizeMode="contain"
                />
                
                <TouchableOpacity 
                    style={styles.profileSummary} 
                    onPress={() => navigation.navigate('profile')}
                >
                    <View style={styles.profileRow}>
                        {/* Dynamic Profile Picture or Initial */}
                        <View style={styles.avatarWrapper}>
                            {userData?.picture ? (
                                <Image 
                                    source={{ uri: userData.picture }} 
                                    style={styles.avatarImage} 
                                />
                            ) : (
                                <View style={styles.initialsCircle}>
                                    <Text style={styles.initialsText}>{getFirstLetter()}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.userInfoContainer}>
                            <Text style={styles.welcomeText} numberOfLines={1}>
                                {loading ? '...' : (userData?.name || 'User')}
                            </Text>
                            <View style={styles.emailUnderline}>
                                <Text style={styles.emailText} numberOfLines={1}>
                                    {loading ? 'Loading...' : (userData?.email || 'N/A')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
                
                {/* DASHBOARD */}
                <TouchableOpacity 
                    onPress={() => navigation.navigate("Home")}
                    style={styles.menuItem}
                >
                    <AntDesign name="home" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Dashboard</Text>
                </TouchableOpacity>

                {/* --- BUSINESS POSTS --- */}
                <View style={styles.sectionDivider}>
                    <Text style={styles.sectionTitle}>Business Posts</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("electronics")} style={styles.menuItem}>
                    <MaterialCommunityIcons name="cellphone-link" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Sell Electronic Product</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("shoppost")} style={styles.menuItem}>
                    <MaterialCommunityIcons name="cellphone-link" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Sell in Bulk</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("library")} style={styles.menuItem}>
                    <MaterialCommunityIcons name="sprout" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Sell Agric Product</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("partspost")} style={styles.menuItem}>
                    <MaterialCommunityIcons name="cog-outline" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Sell Spareparts</Text>
                </TouchableOpacity>

             

                <TouchableOpacity onPress={() => navigation.navigate("servpost")} style={styles.menuItem}>
                    <FontAwesome6 name="user-gear" size={22} color="#f5a53d" />
                    <Text style={styles.menuText}>Provide Services</Text>
                </TouchableOpacity>

                {/* --- RENTALS --- */}
                <View style={styles.sectionDivider}>
                    <Text style={styles.sectionTitle}>Rentals</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("postbuilding")} style={styles.menuItem}>
                    <FontAwesome5 name="hotel" size={20} color="#f5a53d" />
                    <Text style={styles.menuText}>Buildings/Hotels</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("scann")} style={styles.menuItem}>
                    <Fontisto name="car" size={22} color="#f5a53d" />
                    <Text style={styles.menuText}>Cars for rent</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("equipost")} style={styles.menuItem}>
                    <MaterialIcons name="design-services" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Equipments for rent</Text>
                </TouchableOpacity>

                {/* --- DRIVERS & MECHANICS --- */}
                <View style={styles.sectionDivider}>
                    <Text style={styles.sectionTitle}>Drivers & Mechanics</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Postcarsc")} style={styles.menuItem}>
                    <MaterialCommunityIcons name="truck-cargo-container" size={26} color="#f5a53d" />
                    <Text style={styles.menuText}>Driver Registration</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => navigation.navigate("okada")} style={styles.menuItem}>
                    <FontAwesome6 name="motorcycle" size={22} color="#f5a53d" />
                    <Text style={styles.menuText}>Motor Delivery</Text>
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => navigation.navigate("mechanics")} style={styles.menuItem}>
                    <MaterialIcons name="car-repair" size={28} color="#f5a53d" />
                    <Text style={styles.menuText}>Mechanics</Text>
                </TouchableOpacity>

                {/* --- SUPPORT & LOGOUT --- */}
                <View style={styles.footerMenu}>
                    <TouchableOpacity onPress={() => navigation.navigate("Help")} style={styles.menuItem}>
                        <Feather name="phone-call" size={24} color="#f5a53d" />
                        <Text style={styles.menuText}>Call Center</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, { marginTop: 10, marginBottom: 50 }]}>
                        <MaterialCommunityIcons name="logout" size={24} color="#ff4d4d" />
                        <Text style={[styles.menuText, { color: "#ff4d4d" }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "black" },
    header: {
        paddingTop: 50,
        paddingBottom: 25,
        backgroundColor: "#1a1a1a",
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 10,
    },
    logo: { 
        height: 70, // Must be equal to width
    width: 70,  // Must be equal to height
    borderRadius: 50, // Half of width/height
    alignSelf: "center", 
    marginBottom: 20,
    borderWidth: 1,      // Optional: adds a border around the circle
    borderColor: '#ccc'
    },
    profileSummary: { paddingHorizontal: 25 },
    profileRow: { flexDirection: 'row', alignItems: 'center' },
    
    // Avatar Styles
    avatarWrapper: { marginRight: 15 },
    avatarImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#f5a53d" },
    initialsCircle: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: "#f5a53d", justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: "white"
    },
    initialsText: { color: "black", fontSize: 24, fontWeight: "bold" },

    userInfoContainer: { flex: 1 },
    welcomeText: { color: 'white', fontSize: 19, fontWeight: 'bold', marginBottom: 2 },
    emailText: { color: '#aaa', fontSize: 13 },
    emailUnderline: { borderBottomColor: "#f5a53d", borderBottomWidth: 2, paddingBottom: 5, alignSelf: 'flex-start' },
    
    menuScroll: { flex: 1, marginTop: 15, paddingHorizontal: 20 },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        padding: 15,
        borderRadius: 18,
        marginBottom: 12,
    },
    menuText: { color: "white", fontSize: 15, marginLeft: 15, fontWeight: "500" },
    sectionDivider: { alignItems: "center", marginVertical: 15, paddingVertical: 5 },
    sectionTitle: { 
        color: "#f5a53d", 
        fontWeight: "bold", 
        fontSize: 12, 
        letterSpacing: 2, 
        textTransform: 'uppercase' 
    },
    footerMenu: { marginTop: 20, paddingBottom: 60 }
});

export default UserAccount;