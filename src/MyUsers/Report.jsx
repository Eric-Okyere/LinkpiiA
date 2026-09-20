import { TouchableOpacity, Linking, Platform, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';

const Report = () => {
    const myProducts = useSelector((state) => state);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <View style={styles.container}>
            <View style={styles.iconHeader}>
                <MaterialIcons name="security-update-warning" size={60} color="red" />
            </View>

            <View style={styles.messageContainer}>
                <Text style={styles.warningText}>
                    There is something wrong with your account
                </Text>
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#f5a53d" />
                    <Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
                </View>
            ) : userData ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>
                        Name: <Text style={styles.highlight}>{userData.name}</Text>
                    </Text>
                        
                    <Text style={styles.label}>
                        Email: <Text style={styles.highlight}>{userData.email}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Phone Number: <Text style={styles.highlight}>{userData.phone}</Text>
                    </Text>
                   
                    <Text style={[styles.label, { marginTop: 20, textAlign: 'center' }]}>
                       Please call for your account to be rectified.
                    </Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity onPress={Whatsapp} style={styles.iconBtn}>
                            <FontAwesome5 name="whatsapp-square" size={50} color="#07ed6b" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openDial} style={styles.iconBtn}>
                            <Feather name="phone-call" size={45} color="#07ed6b" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <Text style={{color: 'white'}}>User data not found.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        paddingTop: 80,
    },
    iconHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    messageContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    warningText: {
        fontSize: 20,
        color: "white",
        textAlign: 'center',
        fontWeight: '600'
    },
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 18,
        color: "white",
        marginVertical: 8,
    },
    highlight: {
        color: "#ff4444",
        fontWeight: 'bold'
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40 // Modern way to add spacing between items
    },
    iconBtn: {
        padding: 10
    }
});

export default Report;