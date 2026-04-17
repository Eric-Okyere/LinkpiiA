import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    BackHandler, 
    View, 
    Image, 
    Dimensions,
    SafeAreaView
} from 'react-native';
import Welcomepic from "../../assets/pict.png";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import baseURL from '../../assets/common/BaseUrl';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const fetchUserData = async (userId, setUserData, navigation) => {
    try {
        const response = await axios.get(`${baseURL}userbyid/${userId}`);
        const data = response.data;
        setUserData(data);

        if (data.report) {
            navigation.navigate('report');
            return;  
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

const WelcomePage = () => {
    const navigation = useNavigation();
    const login = useSelector((state) => state.login);
    const myProducts = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
        if (myProducts) {
            fetchUserData(myProducts, setUserData, navigation);
        }
    }, [myProducts, navigation]);

    useEffect(() => {
        const checkLogin = () => {
            if (login) {
                navigation.navigate('button');
            } else {
                navigation.navigate('login');
            }
        };
        checkLogin();
    }, [userData, login, navigation]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        );

        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <View style={styles.centerAlign}>
                    <Text style={styles.headingText}>Welcome to Linkpii</Text>
                    
                    <Text style={styles.infoText}>
                        1. Agriculture is our main focus
                    </Text>
                    <Text style={styles.infoText}>
                        2. Linkpii connects Businesses to Buyers and Drivers
                    </Text>
                    <Text style={styles.infoText}>
                        3. It helps you advertise your products or upcoming event
                    </Text>
                    <Text style={styles.infoText}>
                        4. Rent a car, equipment, services appartment, event center, hotel e.t.c
                    </Text>
                    <Text style={styles.infoText}>
                        5. Call a mechanic to fix your car
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.mainButton}
                    onPress={() => navigation.navigate(login === false ? "login" : "button")}
                >
                    <Text style={styles.buttonText}>
                        {login === false ? "Login" : "Explore"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5a53d",
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingBottom: 80, // Adjusts for visual balance
    },
    centerAlign: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        marginBottom: 20,
    },
    infoText: {
        color: "black",
        fontSize: 18,
        marginTop: 10,
        textAlign: "center",
        fontWeight: "bold",
    },
    mainButton: {
        marginTop: 100, 
        alignSelf: "center", 
        backgroundColor: "black", 
        paddingVertical: 15, 
        paddingHorizontal: 40, 
        borderRadius: 20,
        elevation: 5, // Adds a slight shadow on Android
        shadowColor: '#000', // Adds shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: "white", 
        fontWeight: "bold", 
        fontSize: 20 
    }
});

export default WelcomePage;