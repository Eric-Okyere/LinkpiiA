import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome, FontAwesome6, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Advertnav from './Advertnav';
import FeedScreen from '../FeedScreen';
import FashionStack from './FashionStack';
import DrawerContent from '../src/components/Drawer/DrawerContent';
import CarNav from './CarNav';
import RentHome from '../src/Hire/RentHome';
import BuildingNavs from './BuildingNavs';


const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

/* ================= CUSTOM TAB BAR ================= */

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          // CENTER BUTTON (POST)
          if (route.name === "Post") {
            return (
              <TouchableOpacity
                key={index}
                style={styles.centerButton}
                onPress={onPress}
                activeOpacity={0.8}
              >
                <View style={styles.centerIn}>
                <AntDesign name="plus" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }

          let IconComponent;
          let iconName;

          if (route.name === "Advert") {
            IconComponent = FontAwesome6;
            iconName = "hire-a-helper";
          } else if (route.name === "Buy") {
            IconComponent = AntDesign;
            iconName = "shop";
          } else if (route.name === "Cars") {
            IconComponent = MaterialCommunityIcons;
            iconName = "truck-flatbed";
          } else if (route.name === "Rent") {
            IconComponent = MaterialIcons;
            iconName = "bedroom-parent";
          }

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                route.name === "Buy" && { marginLeft: -15 } // 👈 Shift Buy left
              ]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <IconComponent
                name={iconName}
                size={22}
                color={isFocused ? "#f5a53d" : "black"}
              />
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  color: isFocused ? "#f5a53d" : "black",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ================= MAIN NAVIGATOR ================= */

function ButtNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Advert"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Advert"
        component={Advertnav}
        options={{ title: "Hot" }}
      />

      <Tab.Screen
        name="Buy"
        component={FashionStack}
        options={{ title: "Buy" }}
      />

      <Tab.Screen
        name="Post"
        component={DrawerContent}
        options={{ title: "Post" }}
      />

      <Tab.Screen
        name="Cars"
        component={CarNav}
        options={{ title: "Truck" }}
      />

      <Tab.Screen
        name="Rent"
        component={BuildingNavs}
        options={{ title: "Rent" }}
      />
    </Tab.Navigator>
  );
}

export default ButtNavigation;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  container: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 75,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 10,
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerButton: {
    position: 'absolute',
    top: -20,
    left: width / 2,
    transform: [{ translateX: -32.5 }],
    backgroundColor: 'white',
    width: 55,
    height: 55,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  centerIn:{
    alignItems: 'center', 
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center', 
    backgroundColor:"#f5a53d",
     elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  }
});
