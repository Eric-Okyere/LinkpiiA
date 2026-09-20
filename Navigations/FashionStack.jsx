import { createStackNavigator } from '@react-navigation/stack';
import TabViewExamp from '../src/Fashion/FashionTabView';
import DetailPage from '../src/Fashion/DetailPage';
import { Platform } from 'react-native';
import ShopSinglePage from '../src/Fashion/ShopSinglePage';
import ServicesSinglePage from '../src/Fashion/ServicesSinglePage';
import SingleProduct from '../Products/SingleProduct';


const Stack = createStackNavigator();

function FashionStack() {
  return (
    <Stack.Navigator
    screenOptions={
      {
         header: () => null,
      }
    }
    initialRouteName='fashion'>
      <Stack.Screen
       options={{
        header: () => null,
        
      }}
      name="fashion" component={TabViewExamp} />

    <Stack.Screen
            options={{
                headerStatusBarHeight:20,
              title: "Contact the seller",
               header: () => null,
              headerStyle: {
                // backgroundColor: "#f5a53d",
                // height: 200,
              },
            }}
            name="Detailpage" // Giving it a name helps with navigation.navigate("Page")
            component={DetailPage} 
          />
        <Stack.Screen
            options={{
                headerStatusBarHeight:20,
              title: "Contact the seller",
               header: () => null,
              headerStyle: {
                // backgroundColor: "#f5a53d",
                // height: 200,
              },
            }}
            name="Single" // Giving it a name helps with navigation.navigate("Page")
            component={ShopSinglePage} 
          />
  

        <Stack.Screen
            options={{
                headerStatusBarHeight:20,
              title: "Contact the seller",
              headerStyle: {
                // backgroundColor: "#f5a53d",
                // height: 200,
              },
            }}
            name="Singleserv" // Giving it a name helps with navigation.navigate("Page")
            component={ServicesSinglePage} 
          />

        <Stack.Screen
            options={{
                headerStatusBarHeight:20,
              title: "Contact the seller",
              headerStyle: {
                // backgroundColor: "#f5a53d",
                // height: 200,
              },
            }}
            name="Detail" // Giving it a name helps with navigation.navigate("Page")
            component={SingleProduct} 
          />
  
 
      
        </Stack.Navigator>
  );
}
export default FashionStack;