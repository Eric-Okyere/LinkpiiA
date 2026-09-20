import { TouchableOpacity, Linking, Platform, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Center, Text, HStack, Spacer, Image } from 'native-base';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import call from 'react-native-phone-call';
import baseURL from '../../assets/common/BaseUrl';
import splash from "../../assets/splash.png"
import { useNavigation } from '@react-navigation/native';

const VerificationPage = () => {
    const myProducts = useSelector((state) => state);
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${baseURL}userbyid/${myProducts.user}`);
            const data = response.data;
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
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
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <View bg={"black"} flex={1} py={"1.9"} >

            <Center top={4} mb={8} >
                <Image source={splash} style={{ width: 200, height: 200 }} alt='pic'/>
            </Center>

            <Center bottom={20} mx={4}>
                <Text style={{ fontWeight:"bold", fontSize: 18, color: "white", top: 80 }}>
                   Call Requirements 
                </Text>
            </Center>

            {userData ? (
                <>
                    <Center style={{bottom:20}} mb={6}>
                        <Text mb={4} style={{ fontWeight:"bold", fontSize: 18, color: "white", top: 40 }}>
                            Name: <Text color="#f5a53d">{userData.name} {userData?.lastname}</Text>
                        </Text>
                        
                        <Text mb={4} style={{ fontWeight:"bold", fontSize: 18, color: "white", top: 80 }}>
                            Email: <Text color="#f5a53d">{userData.email}</Text>
                        </Text>

                        <Text mb={4} style={{ fontWeight:"bold", fontSize: 18, color: "white", }}>
                            Phone Number: <Text color="#f5a53d">{userData.phone}</Text>
                        </Text>
                   
                        <Text mx={4} mb={4} style={{ fontWeight:"bold", fontSize: 18, color: "white", top:40}}>
                            <Text color="#f5a53d" >{userData.name}</Text> send your picture and your Ghana card or any national ID for verification.
                        </Text>
                    </Center>

                    <Center style={{ bottom: 50 }} flex={1} mx={6}>
                        <HStack my={'3'} space={'1/2'} top={'14'}>
                            <TouchableOpacity onPress={Whatsapp}>
                                <FontAwesome5 name="whatsapp-square" size={40} color="#07ed6b" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openDial}>
                                <Feather name="phone-call" style={{ top: 4 }} size={36} color="#07ed6b" />
                            </TouchableOpacity>
                        </HStack>
                    </Center>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
          
        </View>
    );
};

export default VerificationPage;
