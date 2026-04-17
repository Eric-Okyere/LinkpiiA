import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Product from '../Admin/Product'

import { createStackNavigator } from '@react-navigation/stack'
import ProdForm from '../Admin/ProdForm'
import { AntDesign, Entypo } from "@expo/vector-icons";
import Bus from '../src/MyDriver/Bus'
import UserPost from '../Admin/UserPost'
import PostScreenIOS from '../src/MyDriver/PostScreenIOS'
import ServicesSinglePage from '../src/Fashion/ServicesSinglePage'


const Stack = createStackNavigator();


const AdminNavigator = () => {
  return (
   <Stack.Navigator

   initialRouteName="adminProducts" >
   <Stack.Screen  options={{ 
          header: () => null,
        
        }}
           name='adminProducts' component={Product} />

    {/* <Stack.Screen
  // options={
  //   screenOp
  // }
    name='adminCategories' component={Categories} />  */}
    <Stack.Screen
    options={{
      // headerStatusBarHeight:35,
      // title: "Edit Products"
      // headerLeft: () => (
      
      //   <Entypo
      //     name="aircraft"
      //     style={{ marginLeft: 10, top:7 }}
      //     size={24}
      //     color="black"
      //   />
      // )
      header: () => null,
    }}
    name='adminform' component={ProdForm} />


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
      headerShown:false,
      headerStatusBarHeight:35,
      title: "Bus"
      // headerLeft: () => (
      
      //   <Entypo
      //     name="aircraft"
      //     style={{ marginLeft: 10, top:7 }}
      //     size={24}
      //     color="black"
      //   />
      // )
    }}
    name='bus' component={Bus} /> */}
    <Stack.Screen
    
    options={{
      headerShown:false,
      headerStatusBarHeight:35,
      title: "User Post"
      // headerLeft: () => (
      
      //   <Entypo
      //     name="aircraft"
      //     style={{ marginLeft: 10, top:7 }}
      //     size={24}
      //     color="black"
      //   />
      // )
    }}
    name='userPosts' component={UserPost} />
   </Stack.Navigator>
  )
}

export default AdminNavigator

const styles = StyleSheet.create({})