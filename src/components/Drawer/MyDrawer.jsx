import { createDrawerNavigator } from '@react-navigation/drawer';
import Feed from './Feed';
import Help from './Help';
import PostScreen from '../../MyDriver/PostScreen';
import SellProducts from "../../../Products/SellScreen"
import AddCam from "../../../Products/AddCam"
import PickerAndroid from "../../../Products/PickerAndriod"
import UserAccount from '../../MyUsers/UserAccount';
import UserPost from "../../../Admin/UserPost"
import Post from '../../Fashion/Post';
import ManageProducts from '../../../Products/ManageProducts';
import ListCars from '../../MyDriver/ListCars';
// import Postform from "../../MyDriver/PostForm"
// import GiveInfo from '../../../Products/GiveInfo';
// import Mechanics from '../../Mechanics/Mechanics';
// import ProdFrom from '../../../Admin/ProdForm';
// import ManageMechanics from '../../Mechanics/ManageMechanics';
// import PhoneCallMech from '../../Mechanics/PhoneCallMech';
// import PostOkada from '../../Okada/PostOkada';
// import ServicesPost from '../../Fashion/ServicesPost';
// import ManageServices from '../../Fashion/ManageServices';
// import ManageSpare from '../../SpareParts/ManageSpare';
// import ManageOkada from '../../Okada/ManageOkada';
// import ShopPost from '../../Fashion/ShopPost';
// import Shopmanagement from '../../Fashion/Shopmanagement';
// import SellScreen from '../../../Products/SellScreen';
// import AdminDetailPage from '../../../Products/AdminDetailPage';
// import AdminServicesSig from '../../Fashion/AdminServicesSig';
// import AdminFashionSig from '../../Fashion/AdminFashionSig';
// import AdminSigSpare from '../../SpareParts/AdminSig';
// import AdminShop from '../../Fashion/AdminShop';
// import BuildingPost from '../../Hire/BuildingPost';
// import Equipmentpost from '../../Hire/EquipmentPost';
// import Rentcarpost from '../../Hire/Rentcarpost';
// import BuildingMana from '../../Hire/BuildingMana';
// import BuildingSigView from '../../Hire/BuildingSigView';
// import RentcarMana from '../../Hire/RentCarMana';
// import RentCarAdminSig from '../../Hire/RentCarAdminSig';
// import EquipmentMana from '../../Hire/EquipmentMana';
// import EquipAdminSig from '../../Hire/EquipAdminSig';
// import Profile from '../../MyUsers/Profile';
// import Terms from './Terms';
// import Privacy from './Privacy';
// import Sparepost from '../../SpareParts/Sparepost';
// import PostRest from '../../Restaurant/PostRest';
// import ManageRest from '../../Restaurant/ManageRest';
// import AdminRest from '../../Restaurant/AdminRest';


const Drawer = createDrawerNavigator();

const MyDrawer=()=> {
  return (
    
    <Drawer.Navigator
   drawerContent={props=> <UserAccount {...props} />}
    initialRouteName='Home'
    screenOptions={{
      headerStatusBarHeight:1,
      headerStyle: {
        backgroundColor: "#f5a53d",
        // height: 10,
      },
     
    }} 
    >
        <Drawer.Screen
      options={{
        title:"Post? Press top left icon "
      }}
      name="Home" component={UserPost} />

        <Drawer.Screen
      options={{
        title:"Sell agric products"
      }}
      name="library" component={PickerAndroid} />


<Drawer.Screen
      options={{
        title:"Terms and Conditions"
      }}
      name="terms" component={Terms} />

        <Drawer.Screen
      options={{
        title:"Privacy"
      }}
      name="privacy" component={Privacy} />

       
        <Drawer.Screen
      options={{
        title:"Manage your post"
      }}
      name="servmana" component={ManageServices} />

        <Drawer.Screen
      options={{
        title:"Manage your building"
      }}
      name="BuildingMana" component={BuildingMana} />
    
        <Drawer.Screen
      options={{
        title:"Manage your equipments"
      }}
      name="equipmana" component={EquipmentMana} />


       <Drawer.Screen
      options={{
        title:"Post Food/Restaurant"
      }}
      name="restpost" component={PostRest} />

        <Drawer.Screen
      options={{
        title:"Manage your restaurant"
      }}
      name="manarest" component={ManageRest} />

        <Drawer.Screen
      options={{
        title:"Post a car for rent"
      }}
      name="restsig" component={AdminRest} />
    
        <Drawer.Screen
      options={{
        title:"Post a hotel/appartement"
      }}
      name="postbuilding" component={BuildingPost} />
        <Drawer.Screen
      options={{
        title:"I am a Motor Driver"
      }}
      name="okada" component={PostOkada} />

        <Drawer.Screen
      options={{
        title:"Post equipement for rent"
      }}
      name="equipost" component={Equipmentpost} />

        <Drawer.Screen
      options={{
        title:"Post a car for rent"
      }}
      name="scann" component={Rentcarpost} />

        <Drawer.Screen
      options={{
        title:"Detail of your product"
      }}
      name="agricsig" component={AdminDetailPage} />

        <Drawer.Screen
      options={{
        title:"Detail of your services"
      }}
      name="servsig" component={AdminServicesSig} />
       
        <Drawer.Screen
      options={{
        title:"Detail of your services"
      }}
      name="equipadminsig" component={EquipAdminSig} />
        <Drawer.Screen
      options={{
        title:"Detail of your services"
      }}
      name="fashionsig" component={AdminFashionSig} />

        <Drawer.Screen
      options={{
        title:"Detail of your product"
      }}
      name="Rentadmin" component={RentCarAdminSig} />

        <Drawer.Screen
      options={{
        title:"Detail of your sparepart"
      }}
      name="spareadmin" component={AdminSigSpare} />

        <Drawer.Screen
      options={{
        title:"Detail of your shop"
      }}
      name="shopdet" component={AdminShop} />

      
<Drawer.Screen
        options={{
          title: "Buy your product",
          headerStyle: {
            backgroundColor: "#f5a53d",
            height: 100,
          },
        }}
        name="sellscreen"
        component={SellScreen}
      />

        <Drawer.Screen
      options={{
        title:"I am a Motor Driver"
      }}
      name="manaokada" component={ManageOkada} />
    
        <Drawer.Screen
      options={{
        title:"This is my shop"
      }}
      name="shoppost" component={ShopPost} />

        <Drawer.Screen
      options={{
        title:"Sell Spareparts"
      }}
      name="sparepost" component={Sparepost} />

        <Drawer.Screen
      options={{
        title:"Provide a service"
      }}
      name="servpost" component={ServicesPost} />

        <Drawer.Screen
      options={{
        title:"Sell agric products"
      }}
      name="Camera" component={AddCam} />

        <Drawer.Screen
      options={{
        title:"Manage your post"
      }}
      name="spareparts" component={ManageSpare} />

        {/* <Drawer.Screen
      options={{
        title:"Terms and Conditions"
      }}
      name="terms" component={Terms} /> */}

        {/* <Drawer.Screen
      options={{
        title:"Privacy"
      }}
      name="privacy" component={Privacy} /> */}

        <Drawer.Screen
      options={{
        title:"Rent Car Dashboard"
      }}
      name="rentdash" component={RentcarMana} />

        <Drawer.Screen
      options={{
        title:"Building Detail"
      }}
      name="sigview" component={BuildingSigView} />
     
      <Drawer.Screen
        options={{
          // header: () => null,

       
        }}
      
       name="My Products" component={Feed} />
      <Drawer.Screen name="Help" component={Help} />
    
      <Drawer.Screen
      options={{
        title:"My Car post"
      }}
      name="listcars" component={ListCars} />
      <Drawer.Screen name="Postcarsc" component={PostScreen} />
     
      <Drawer.Screen
       options={{
        title:"Post a KIA"
      }}
      name="Postform" component={Postform} />
      <Drawer.Screen 
       options={{
        title:"About Palm MarketLink"
      }}
      name="give" component={GiveInfo} />
      <Drawer.Screen name="Userpost" component={UserPost} />
      <Drawer.Screen name="Sell" component={SellProducts} />
      <Drawer.Screen
      options={{
        title:"I am a mechanics"
      }}
      name="mechanics" component={Mechanics} />
      <Drawer.Screen
      options={
        {
          title:"Electronics and Fashion"
        }
      }
       name="electronics" component={Post} />
      <Drawer.Screen name="manage"
       options={{
        title:"Fashion/Electronic post"
      }}
      component={ManageProducts} />

      <Drawer.Screen name="profile"
       options={{
        title:"Profile Page"
      }}
      component={Profile} />


      <Drawer.Screen name="shop"
       options={{
        title:"This is my Shop"
      }}
      component={Shopmanagement} />

      <Drawer.Screen name="repaires"
       options={{
        title:"Mechanics Post"
      }}
      component={ManageMechanics} />
      
      <Drawer.Screen name="adminform"
       options={{
        // title:"Fashion/Electronic post"
      }}
      component={ProdFrom} />

      <Drawer.Screen name="callmech"
       options={{
        title:"Call a professional mechanics"
      }}
      component={PhoneCallMech} />
    </Drawer.Navigator>
    
  );
}
export default MyDrawer;