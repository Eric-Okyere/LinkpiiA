import { createStackNavigator } from "@react-navigation/stack";
// import Bus from "../src/MyDriver/Bus";
// import MyDriver from "../src/MyDriver/MyDriver";
// import Container from "../src/MyDriver/Container";
// import PhoneCall from "../src/MyDriver/PhoneCall";
// import MyDrawer from "../src/components/Drawer/MyDrawer";
// import PostScreenIOS from "../src/MyDriver/PostScreenIOS";
// import TabViewExample from "../src/Mechanics/CarHome";
// import PhoneCallMech from "../src/Mechanics/PhoneCallMech";
// import SpareDetailPage from "../src/SpareParts/DetailPage";
// import okadaCall from "../src/Okada/OkadaCall";
// import RentCarDetail from "../src/Hire/RentCarDetail";
// import GiveInfo from "../Products/GiveInfo";
// import VerificationPage from "../src/MyDriver/VerificationPage";
import CarHome from "../src/Mechanics/CarHome";
import PhoneCall from "../src/MyDriver/PhoneCall";
import RentCarDetail from "../src/Hire/RentCarDetail";
import MechanicDetailScreen from "../src/Mechanics/MechanicDetailScreen";
import DetailPage from "../src/SpareParts/DetailPage";



const Stack = createStackNavigator();
export default function CarNav() {
  return (
   

<Stack.Navigator
     initialRouteName="mycont"
     >
      
      <Stack.Screen
        options={{
          header: () => null,

          // headerRight: () => (
          //   <Image
          //     style={{ width: 44, left: -10, height: 30 }}
          //     rounded={10}
          //     //  resizeMode='contain'
          //     source={require("../assets/Gye.png")}
          //     alt=""
          //   />
          // ),
          // headerLeft: () => (
          //   <Entypo
          //     name="aircraft"
          //     style={{ marginLeft: 10 }}
          //     size={24}
          //     color="black"
          //   />
          // ),
          // headerStyle: {
          //   backgroundColor: "#f5a53d",
          // },
          // headerTintColor: "white",
          // headerTitleAlign: "center",
        }}
        name="mycont"
        component={CarHome}
      />




<Stack.Screen
         options={{
          title: "Scroll down, call the owner",
          // header: () => null,
          headerStatusBarHeight:20,
        }}
        name="rentcardetail" component={RentCarDetail} />


<Stack.Screen
         options={{
          title: "Scroll down, call the owner",
          // header: () => null,
        headerStatusBarHeight:20,
        }}
        name="sparedetail" component={DetailPage} />




  {/* <Stack.Screen
        options={{
        //   title: "Buy your products here",
        //   headerStyle: {
        //     backgroundColor: "#f5a53d",
        //     height: 100,
        //   },
        header:()=>null
        }}
        name="mycar" component={Bus}
      /> */}

<Stack.Screen
        options={{
          // header: () => null,
          title: "Call the driver",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="phonecall"
        component={PhoneCall}
      />

<Stack.Screen
        options={{
          // header: () => null,
          title: "Call the driver",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="callmech"
        component={MechanicDetailScreen}
      />

{/* <Stack.Screen
        options={{
          // header: () => null,
          title: "Call the driver",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="verificationpage"
        component={VerificationPage}
      /> */}



{/* <Stack.Screen
        options={{
          // header: () => null,
          title: "Call the driver",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="okadaphone"
        component={okadaCall}
      /> */}

{/* <Stack.Screen
    
    options={{
      headerStatusBarHeight:10,
      // header: () => null,
      title: "About Us",
      backgroundColor: "#f5a53d"
    }}
    name="give" component={GiveInfo}
  /> */}

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

        name="sparedetail"
        component={SpareDetailPage}
      /> */}

{/* <Stack.Screen
        options={{
          // header: () => null,
          title: "Call the mechanics",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="callmech"
        component={PhoneCallMech}
      /> */}

    {/* <Stack.Screen
    
        screenOptions={{
          headerStatusBarHeight:10,
          // header: () => null,
          headerStyle: {
                backgroundColor: "#f5a53d",
                height: 100,
              }
        }}
        
        // screenOptions={{
        //   headerStatusBarHeight:10,
        //   headerStyle: {
        //     backgroundColor: "#f5a53d",
        //     height: 100,
        //   },
        name="mydriver" component={MyDriver}
      /> */}

      
    {/* <Stack.Screen
        options={{
          headerStatusBarHeight:10,
          header: () => null,
          title: "Call a driver",
          backgroundColor: "black"
        }}
        name="cont" component={Container}
      /> */}

    {/* <Stack.Screen
        options={{
          headerStatusBarHeight:10,
          // header: () => null,
          title: "Call a driver",
          backgroundColor: "black"
        }}
        name="Builddetail" component={RentCarDetail}
      /> */}

    {/* <Stack.Screen
        options={{
          headerStatusBarHeight:10,
          // header: () => null,
          title: "Call a driver",
          backgroundColor: "black"
        }}
        name="Addcar" component={PostScreenIOS}
      /> */}
     
      

      {/* <Stack.Screen
        options={{
          headerStatusBarHeight:10,
          // header: () => null,
        }}
        name="phonecall" component={PhoneCall}
      /> */}
      {/* <Stack.Screen
        options={{
          headerStatusBarHeight:10,
          // header: () => null,
        }}
        name="Postcarsc" component={PostScreen}
      /> */}


      

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
  

      {/* <Stack.Screen
        options={{
          headerStatusBarHeight:10,
          header: () => null,
        }}
        name="drawer" component={MyDrawer}
      /> */}

      
      
    </Stack.Navigator>
  );
}


