/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';

import Menu from './screens/Menu';
import SignUp from './screens/SignUp';
import FineXGM from './screens/FineXGM';
import Wallet from './screens/Wallet';
import TermsAndPolicies from './screens/TermsAndPolicies';
import Send from './screens/Send';
import ScannedQR from './screens/ScannedQR';
import BuyRecAmount from './screens/BuyRecAmount';
import ConfirmBuy from './screens/ConfirmBuy';
import Bought from './screens/Bought';
import BuyRecWallets from './screens/BuyRecWallets';
import Receive from './screens/Receive';
import Address from './screens/Address';
import Sent from './screens/Sent';
import LoginOTPVerification from './screens/LoginOTPVerification';
import Security from './screens/Security';
import NewPassword from './screens/NewPassword';
import RecoverySuccess from './screens/RecoverySuccess';
import PhoneNoRequired from './screens/PhoneNoRequired';
import PhoneNoRequiredOTPVerification from './screens/PhoneNoRequiredOTPVerification';
import SignUpForm from './screens/SignUpForm';
import SignUpSuccess from './screens/SignUpSuccess';
import SignUpOTPVerification from './screens/SignUpOTPVerification';
import ForgetPassword from './screens/ForgetPassword';
import ForgetOTPVerification from './screens/ForgetOTPVerification';
import Login from './screens/Login';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import Tabs from './navigation/tabs';
import PushNotification from "react-native-push-notification";


const PushNotificationConfigure = () => {


  const notificationListener = React.useRef();


  useEffect(() => {

    // notificationListener.current = PushNotification.onNotification(response=>{console.log(response)})

    PushNotification.configure({

      onRegister: function (token) {
        console.log('TOKEN:', token);
      },


      onNotification: function (notification) {
        console.log('recieved')
        if (notification.foreground) {
          PushNotification.localNotification({
            title: notification.title,
            message: notification.message
          });
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    })


  }, [])
  return null;
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: 'transparent',
  },
};

const Stack = createStackNavigator();
// https://fineinvestapi.unimaxmining.com/public/api/
// https://fineinvest.io/rec_app_api/api/
const App = () => {


  setTimeout(() => {
    SplashScreen.hide();
  }, 2000);










  return (
    <NavigationContainer theme={theme}>
      <PushNotificationConfigure />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={'Login'}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="FineXGM" component={FineXGM} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="Send" component={Send} />
        <Stack.Screen name="ScannedQR" component={ScannedQR} />
        <Stack.Screen name="TermsAndPolicies" component={TermsAndPolicies} />
        <Stack.Screen name="Receive" component={Receive} />
        <Stack.Screen name="BuyRecAmount" component={BuyRecAmount} />
        <Stack.Screen name="BuyRecWallets" component={BuyRecWallets} />
        <Stack.Screen name="ConfirmBuy" component={ConfirmBuy} />
        <Stack.Screen name="Bought" component={Bought} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="Sent" component={Sent} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignUpForm" component={SignUpForm} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen name="RecoverySuccess" component={RecoverySuccess} />
        <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />
        <Stack.Screen name="PhoneNoRequired" component={PhoneNoRequired} />
        <Stack.Screen
          name="LoginOTPVerification"
          component={LoginOTPVerification}
        />
        <Stack.Screen
          name="PhoneNoRequiredOTPVerification"
          component={PhoneNoRequiredOTPVerification}
        />
        <Stack.Screen
          name="SignUpOTPVerification"
          component={SignUpOTPVerification}
        />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen
          name="ForgetOTPVerification"
          component={ForgetOTPVerification}
        />

        {/* Tabs */}
        <Stack.Screen name="Home" component={Tabs} />

        {/* <Stack.Screen name="Scan" component={Scan} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
