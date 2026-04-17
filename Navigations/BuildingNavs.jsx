import { createStackNavigator } from "@react-navigation/stack";
import BuildingDetail from "../src/Hire/BuildingDetail";

import RentHome from "../src/Hire/RentHome";
import EquipmentDetail from "../src/Hire/EquipmentDetail";


const Stack = createStackNavigator();
export default function BuildingNavs() {
  return (
   

<Stack.Navigator
     initialRouteName="Back"
     >
      
      <Stack.Screen
        options={{
          header: () => null
        }}
        name="Back"
        component={RentHome}
      />

        <Stack.Screen
         options={{
          title: "Scroll down, call the owner",
          // header: () => null,
          headerStatusBarHeight:10,
        }}
        name="Builddetail" component={BuildingDetail} />


        <Stack.Screen
         options={{
          title: "Scroll down, call the owner",
          // header: () => null,
          headerStatusBarHeight:10,
        }}
        name="equipmentdetail" component={EquipmentDetail} />


      
    </Stack.Navigator>
  );
}


