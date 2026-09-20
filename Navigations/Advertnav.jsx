
import { createStackNavigator } from "@react-navigation/stack";
import HotDetail from "../Advert/HotDetail";
import Adverts from "../Advert/Adverts";


// initialRouteName='PaymentSuccessful'

const Stack = createStackNavigator();
export default function Advertnav() {
  return (
    <Stack.Navigator
     initialRouteName="Home"
     >
      
     
     
      <Stack.Screen
        options={{
            header: () => null,
            // headerStatusBarHeight:30,
          title: "Buy your product",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
        }}
        name="Home"
        component={Adverts}
      />

      <Stack.Screen
        options={{
            headerStatusBarHeight:10,
          title: "Contact the seller",
          headerStyle: {
            // backgroundColor: "#f5a53d",
            height: 100,
          },
          header: () => null,
        }}
        name="Page"
        component={HotDetail}
      />
      
    
    </Stack.Navigator>
  );
}


