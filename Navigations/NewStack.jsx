import { Text, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import SingleProduct from "../Products/SingleProduct";
import {  Entypo } from "@expo/vector-icons";
import ProductsScreen from "../Products/ProductsScreen";
import SignupScreen from "../src/MyUsers/Signup";
import Sell from "../Products/Sell";
import Signin from "../src/MyUsers/Signin";
import ForgotPassword from "../src/MyUsers/ForgotPaasword";
import PickerAndroid from "../Products/PickerAndriod";
import ProdForm from "../Admin/ProdForm";
import PostForm from "../src/MyDriver/PostForm"
import MyDriver from "../src/MyDriver/MyDriver"
import SellScreen from "../Products/SellScreen"
import UserPost from "../Admin/UserPost"
import CarNav from "./CarNav"
import PostScreenIOS from "../src/MyDriver/PostScreenIOS";
import WelcomePage from "../src/MyUsers/WelcomePage";
import About from "../Products/About";
import GiveInfo from "../Products/GiveInfo";
import DetailPage from "../src/Fashion/DetailPage";
import FashionProductsScreen from "../src/Fashion/ProductsScreen";
import ServicesSinglePage from "../src/Fashion/ServicesSinglePage";


// initialRouteName='PaymentSuccessful'

const Stack = createStackNavigator();
export default function NewStack() {
  return (
    <Stack.Navigator
     initialRouteName="main"
     >
      
      <Stack.Screen
        options={{
          header: () => null,

          // headerRight: () => (
          //   <Image
          //     style={{ width: 44, left: -10, height: 35 }}
          //     rounded={10}
          //     //  resizeMode='contain'
          //     source={require("../assets/Gye.png")}
          //     alt=""
          //   />
          // ),
          headerLeft: () => (
            <Entypo
              name="aircraft"
              style={{ marginLeft: 10 }}
              size={24}
              color="black"
            />
          ),
          headerStyle: {
            backgroundColor: "#f5a53d",
          },
          headerTintColor: "white",
          headerTitleAlign: "center",
        }}
        name="main"
        component={ProductsScreen}
      />

{/* <Stack.Screen
        options={{
          // header: () => null,
          title: "Scroll down, call the owner",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="singleservice"
        component={ServicesSinglePage}
      /> */}





      <Stack.Screen
        options={{
          title: "Scroll down, call the owner",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:20,
        }}

        name="Detail"
        component={SingleProduct}
      />
      {/* <Stack.Screen
        options={{
          header: () => null,
          title: "Scroll down, call the owner",
          headerStyle: {
            backgroundColor: "#f5a53d",
            height: 100,
          },
          headerStatusBarHeight:35,
        }}

        name="Detailpage"
        component={DetailPage}
      /> */}
     
      <Stack.Screen
        options={{
          title: "Buy your product",
          headerStyle: {
            backgroundColor: "#f5a53d",
            height: 100,
          },
        }}
        name="welcome"
        component={WelcomePage}
      />



<Stack.Screen
        options={{
          header: () => null,
        }}
        name="car"
        component={CarNav}
      />
     
 
     <Stack.Screen
        options={{
          headerStatusBarHeight:35,
          // header: () => null,
          title: "Call a driver",
          backgroundColor: "black"
        }}
        name="Addcar" component={PostScreenIOS}
      />
     <Stack.Screen
        options={{
          headerStatusBarHeight:35,
          // header: () => null,
          title: "About Us",
          backgroundColor: "#f5a53d"
        }}
        name="give" component={GiveInfo}
      />
     <Stack.Screen
        options={{
          headerStatusBarHeight:35,
          header: () => null,
          title: "About Us",
          backgroundColor: "#f5a53d"
        }}
        name="fashionmain" component={FashionProductsScreen}
      />


      {/* <Stack.Screen
        options={{
          title: "Manage your products",
          headerStyle: {
            backgroundColor: "#f5a53d",
            height: 120,
          },
          
        }}
        name="Userpost"
        component={UserPost}
      /> */}
      <Stack.Screen
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

      <Stack.Screen
        options={{
          title: "Buy your product",
          headerStyle: {
            backgroundColor: "#f5a53d",
            height: 100,
          },
        }}
        name="mydriver"
        component={MyDriver}
      />

     

      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="login" component={Signin}
      />

     

      <Stack.Screen
        options={{
          headerStatusBarHeight:35,
          // header: () => null,
        }}
        name="about" component={About}
      />

{/* <Stack.Screen
        options={{
          header: () => null,
        }}
        name="button"
        component={ButtonNav}
      /> */}

      <Stack.Screen
        options={{
          headerStatusBarHeight:35,
          // header: () => null,
        }}
        name="Postform" component={PostForm}
      />

      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="libios"
        component={Sell}
      />
       {/* <Stack.Screen
        // options={{
        //   header: () => null,
        //   headerStatusBarHeight:35,
        //   headerStyle: {
        //     backgroundColor: "#34eb64",
        //     height: 100,
        //   },
        // }}
       name='listcars' component={ListCars} /> */}
   
       <Stack.Screen
       options={{
        header: () => null,
       }}
        name='adminform' component={ProdForm} />

       

      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="library"
        component={PickerAndroid}
      />


        
      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="signup"
        component={SignupScreen}
      />

      
      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="reset"
        component={ForgotPassword}
      />
    </Stack.Navigator>
  );
}


