import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Linking, 
    Platform, 
    BackHandler, 
    StyleSheet, 
    Image, 
    ActivityIndicator 
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import call from 'react-native-phone-call';
import { useNavigation } from '@react-navigation/native';

// Internal Imports
import baseURL from '../../assets/common/BaseUrl';
import splash from "../../assets/splash.png";

const VerificationPage = () => {
    const myProducts = useSelector((state) => state);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${baseURL}userbyid/${myProducts.user}`);
            const data = response.data;
            setUserData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (myProducts.user) {
            fetchUserData();
        }
    }, [myProducts.user]);

    const openDial = () => {
        const args = {
            number: '+233247747624',
            prompt: false,
            skipCanOpen: true
        };
        call(args).catch(console.error);
    };

    const Whatsapp = () => {
        const url = `https://wa.me/233209317581`;
        Linking.openURL(url).catch(console.error);
    };

    useEffect(() => {
        // Prevent going back
        const backAction = () => true;
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.header}>
                <Image source={splash} style={styles.logo} />
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.successTitle}>
                   Registration Successful. 
                </Text>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#f5a53d" />
                </View>
            ) : userData ? (
                <View style={styles.content}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Name: <Text style={styles.highlight}>{userData.name} {userData?.lastname}</Text>
                        </Text>
                        
                        <Text style={styles.infoText}>
                            Email: <Text style={styles.highlight}>{userData.email}</Text>
                        </Text>

                        <Text style={styles.infoText}>
                            Phone Number: <Text style={styles.highlight}>{userData.phone}</Text>
                        </Text>
                   
                        <Text style={[styles.infoText, { marginTop: 40, textAlign: 'center' }]}>
                            <Text style={styles.highlight}>{userData.name}</Text>, please send your picture and your Ghana card or any national ID for verification.
                        </Text>
                    </View>

                    {/* Action Row (Replaces HStack) */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity onPress={Whatsapp}>
                            <FontAwesome5 name="whatsapp-square" size={50} color="#07ed6b" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openDial}>
                            <Feather name="phone-call" size={42} color="#07ed6b" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <Text style={{ color: 'white' }}>User details not found.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 200, 
        height: 200,
        resizeMode: 'contain'
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 20
    },
    successTitle: {
        fontWeight: "bold", 
        fontSize: 20, 
        color: "white", 
        textAlign: 'center'
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        marginTop: 40,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoText: {
        fontWeight: "bold", 
        fontSize: 18, 
        color: "white",
        marginVertical: 10,
    },
    highlight: {
        color: "#f5a53d",
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        gap: 50, // Modern way to add space between buttons
    }
});

export default VerificationPage;