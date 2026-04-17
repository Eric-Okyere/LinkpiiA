import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PickerAndroid from "../../../Products/PickerAndriod";
import UserAccount from '../../MyUsers/UserAccount';
import UserPost from "../../../Admin/UserPost";
import Post from '../../Fashion/Post';
import Sparepost from '../../SpareParts/Sparepost';
import ServicesPost from '../../Fashion/ServicesPost';
import PostRest from '../../Restaurant/PostRest';
import BuildingPost from '../../Hire/BuildingPost';
import Rentcarpost from '../../Hire/Rentcarpost';
import Equipmentpost from '../../Hire/EquipmentPost';
import PostFrom from '../../MyDriver/PostForm';
import MechanicForm from '../../Mechanics/Mechanics';
import Help from './Help';
import Profile from '../../MyUsers/Profile';
import AdminFashionSig from '../../Fashion/AdminFashionSig';
import AdminServicesSig from '../../Fashion/AdminServicesSig';
import ManageServices from '../../Fashion/ManageServices';
import Product from '../../../Admin/Product';
import ManageSpare from '../../SpareParts/ManageSpare';
import ShopManagement from '../../Fashion/Shopmanagement';
import BuildingMana from '../../Hire/BuildingMana';
import RentcarMana from '../../Hire/RentCarMana';
import EquipmentMana from '../../Hire/EquipmentMana';
import ManageRest from '../../Restaurant/ManageRest';
import AdminDetail from '../../../Products/AdminDetailPage';
import AdminSigSpare from '../../SpareParts/AdminSig';
import AdminShop from '../../Fashion/AdminShop';
import BuildingSigView from '../../Hire/BuildingSigView';
import RentCarAdminSig from '../../Hire/RentCarAdminSig';
import EquipAdminSig from '../../Hire/EquipAdminSig';
import AdminRest from '../../Restaurant/AdminRest';

const Drawer = createDrawerNavigator();

const DrawerContent = () => {
  return (
    <Drawer.Navigator
      // This passes the correct navigation context to your UserAccount component
      drawerContent={(props) => <UserAccount {...props} />}
      initialRouteName='Home'
      screenOptions={{
        headerStatusBarHeight: 20,
        headerStyle: {
          backgroundColor: "#f5a53d",
        
        },
      }} 
    >
      <Drawer.Screen
        options={{ title: "Dashboard" }}
        name="Home" 
        component={UserPost} 
      />

      <Drawer.Screen
        options={{ title: "Post your Electronic Product",
         drawerLabel: "Post Electronic Product", // Text shown in the side menu
         
         }}
        
        name="electronics" 
        component={Post} 
      />

      <Drawer.Screen
        options={{ title: "Sell Agric Products" }}
        name="library" 
        component={PickerAndroid} 
      />

      <Drawer.Screen
        options={{ title: "Sell Spare Parts" }}
        name="partspost" 
        component={Sparepost} 
      />

      <Drawer.Screen
        options={{ title: "Post your service here" }}
        name="servpost" 
        component={ServicesPost} 
      />

      <Drawer.Screen
        options={{ title: "Post Restaurant, Food joint......" }}
        name="restpost" 
        component={PostRest} 
      />

      <Drawer.Screen
        options={{ title: "Post Building, Hotel, Guest House....." }}
        name="postbuilding" 
        component={BuildingPost} 
      />


      <Drawer.Screen
        options={{ title: "Vehicles for rent eg. Tractors, Bulldozers..." }}
        name="scann" 
        component={Rentcarpost} 
      />


      <Drawer.Screen
        options={{ title: "Post for rent eg. Sound Systems, Generators..." }}
        name="equipost" 
        component={Equipmentpost} 
      />

      <Drawer.Screen
        options={{ title: "Register as Linkpii Driver" }}
        name="Postcarsc" 
        component={PostFrom} 
      />

      <Drawer.Screen
        options={{ title: "Register as a Mechanic" }}
        name="mechanics" 
        component={MechanicForm} 
      />

      <Drawer.Screen
        options={{ title: "Help & Support" }}
        name="Help" 
        component={Help} 
      />

      <Drawer.Screen
        options={{ title: "My Profile" }}
        name="profile" 
        component={Profile} 
      />

      <Drawer.Screen
        options={{ title: "My Post" }}
        name="fashionsig" 
        component={AdminFashionSig} 
      />

      <Drawer.Screen
        options={{ title: "Manage Services" }}
        name="servmana" 
        component={ManageServices} 
      />

      <Drawer.Screen
        options={{ title: "Service Details" }}
        name="servsig" 
        component={AdminServicesSig} 
      />

      <Drawer.Screen
        options={{ title: "Manage Products" }}
        name="manage" 
        component={Product} 
      />

      <Drawer.Screen
        options={{ title: "Manage Products" }}
        name="agricadmin" 
        component={AdminDetail} 
      />

      <Drawer.Screen
        options={{ title: "Manage Spare Parts" }}
        name="spareparts" 
        component={ManageSpare} 
      />


      <Drawer.Screen
        options={{ title: "Manage Products" }}
        name="shop" 
        component={ShopManagement} 
      />

      <Drawer.Screen
        options={{ title: "Manage Building" }}
        name="BuildingMana" 
        component={BuildingMana} 
      />

      <Drawer.Screen
        options={{ title: "Manage Vehicles for Rent" }}
        name="rentdash" 
        component={RentcarMana} 
      />

      <Drawer.Screen
        options={{ title: "Manage Equipments for Rent" }}
        name="equipmana" 
        component={EquipmentMana} 
      />

      <Drawer.Screen
        options={{ title: "Manage Equipments for Rent" }}
        name="manarest" 
        component={ManageRest} 
      />

      <Drawer.Screen
        options={{ title: "Manage Parts" }}
        name="spareadmin" 
        component={AdminSigSpare} 
      />

      <Drawer.Screen
        options={{ title: "Manage Shop" }}
        name="shopdet" 
        component={AdminShop} 
      />
      
      <Drawer.Screen
        options={{ title: "Manage Building" }}
        name="sigview" 
        component={BuildingSigView} 
      />


      <Drawer.Screen
        options={{ title: "Manage Parts" }}
        name="Rentadmin" 
        component={RentCarAdminSig} 
      />

      <Drawer.Screen
        options={{ title: "Manage Parts" }}
        name="equipadminsig" 
        component={EquipAdminSig} 
      />

      <Drawer.Screen
        options={{ title: "Manage Restaurant" }}
        name="restsig" 
        component={AdminRest} 
      />

    </Drawer.Navigator>

  );
}

export default DrawerContent;