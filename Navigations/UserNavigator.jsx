
import { createStackNavigator } from "@react-navigation/stack";
import ButtonNav from "./ButtonNav"
import SignupScreen from "../src/MyUsers/Signup";
import Signin from "../src/MyUsers/Signin";
import ForgotPassword from "../src/MyUsers/ForgotPaasword";
// import CarNav from "./CarNav"
import WelcomePage from "../src/MyUsers/WelcomePage";
import Report from "../src/MyUsers/Report";
import VerificationPage from "../src/MyUsers/VerificationPage";



const Stack = createStackNavigator();
const UserNavigator=()=> {



  return (
    <Stack.Navigator initialRouteName="login">

      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="welcome" component={WelcomePage}
      />

    <Stack.Screen
       options={{
        header: () => null,
      }}
      name="report" component={Report} />

    <Stack.Screen
       options={{
        header: () => null,
      }}
      name="verificationpage" component={VerificationPage} />

      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="login" component={Signin}
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
        name="forgotten"
        component={ForgotPassword}
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

        name="Detailpage"
        component={DetailPage}
      /> */}





{/* <Stack.Screen
        options={{
          title: "Scroll down, call the owner",
          headerStyle: {
            backgroundColor: "#f5a53d",
            // height: 100,
          },
          headerStatusBarHeight:10,
        }}

        name="Detail"
        component={SingleProduct}
      /> */}


      <Stack.Screen
        options={{
          header: () => null,
        }}
        name="button"
        component={ButtonNav}
      />
      
      {/* <Stack.Screen
        options={{
          header: () => null,
        }}
        name="car"
        component={CarNav}
      /> */}
      {/* <Stack.Screen
        options={{
          header: () => null,
        }}
        name="newstack"
        component={NewStack}
      /> */}
     
 
   
      
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

export default UserNavigator;