import React from 'react';
import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text, 
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GiveInfo = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Logo Section */}
                <Image 
                    style={styles.logo} 
                    source={require("../assets/logo.png")} 
                    alt='logo' 
                    resizeMode="contain"
                />
            
                <View style={styles.contentWrapper}>
                    <View style={styles.centerText}>
                        <Text style={styles.title}>Welcome to Linkpii.</Text>
                        <Text style={styles.subtitle}>Linkpii intends to:</Text>
                    </View>

                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>
                            1. Connect businesses to buyers and drivers.
                        </Text>
                        <Text style={styles.listItem}>
                            2. Help you advertise your products or upcoming events.
                        </Text>
                        <Text style={styles.listItem}>
                            3. Hire a car, equipment, services, apartments, event centers, etc.
                        </Text>
                        <Text style={styles.listItem}>
                            4. Call a mechanic to fix your car.
                        </Text>
                    </View>
                </View>

                {/* Optional Explore Button - Uncomment if needed */}
                {/* <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate("fash")}
                >
                    <Text style={styles.buttonText}>Explore</Text>
                </TouchableOpacity> 
                */}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingBottom: 40,
    },
    logo: {
        alignSelf: "center",
        width: 180,
        height: 180,
        marginBottom: 20,
    },
    contentWrapper: {
        paddingHorizontal: 20,
    },
    centerText: {
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        color: "white",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: 'white',
        fontSize: 18,
        marginTop: 5,
    },
    listContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    listItem: {
        color: 'white',
        fontSize: 17,
        lineHeight: 28,
        marginBottom: 12,
    },
    button: {
        alignSelf: "center",
        marginTop: 30,
        backgroundColor: "#f5a53d",
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
    }
});

export default GiveInfo;