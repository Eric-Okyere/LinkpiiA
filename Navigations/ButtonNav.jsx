import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome, FontAwesome6, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Advertnav from './Advertnav';
import FeedScreen from '../FeedScreen';
import FashionStack from './FashionStack';
import DrawerContent from '../src/components/Drawer/DrawerContent';
import CarNav from './CarNav';
import RentHome from '../src/Hire/RentHome';
import BuildingNavs from './BuildingNavs';
import theme from '../src/Styles/designSystem';


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

          // CENTER SLOT: an equal-width, invisible spacer that keeps the other 4
          // tabs evenly distributed. The actual floating "+" button is rendered
          // once below, as a sibling of this row, so it can never paint over - or
          // get painted over by - a neighboring tab's icon or label.
          if (route.name === "Post") {
            return <View key={index} style={styles.tabItem} pointerEvents="none" />;
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
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBubble, isFocused && styles.iconBubbleActive]}>
                <IconComponent
                  name={iconName}
                  size={20}
                  color={isFocused ? theme.colors.brand600 : theme.colors.ink500}
                />
              </View>
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating center "Post" button - rendered once, outside the flex row,
          positioned by percentage so it stays centered regardless of screen
          width and never overlaps a neighboring tab's label (see the center-slot
          spacer above). */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("Post")}
        activeOpacity={0.8}
      >
        <View style={styles.centerIn}>
          <AntDesign name="plus" size={20} color={theme.colors.surface} />
        </View>
      </TouchableOpacity>
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
    backgroundColor: theme.colors.surface,
    height: 78,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    ...theme.shadow.floating,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBubbleActive: {
    backgroundColor: theme.colors.brand100,
  },

  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
    color: theme.colors.ink500,
  },

  tabLabelActive: {
    color: theme.colors.brand600,
    fontWeight: '700',
  },

  centerButton: {
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -27.5, // half of width: 55, centers regardless of screen width
    backgroundColor: theme.colors.surface,
    width: 55,
    height: 55,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
    ...theme.shadow.floating,
  },
  centerIn:{
    alignItems: 'center', 
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    justifyContent: 'center', 
    backgroundColor: theme.colors.brand600,
  }
});
