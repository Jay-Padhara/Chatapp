import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './Screens/Splash';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Userlist from './Screens/Userlist';
import Gchat from './Screens/Gchat';
// import Chat from "./Screens/Chat";

export default function App() {
  const stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{headerShown: false}}>
        <stack.Screen name="Splash" component={Splash} />
        <stack.Screen name="Login" component={Login} />
        <stack.Screen name="Signup" component={Signup} />
        <stack.Screen name="Userlist" component={Userlist} />
        <stack.Screen name="Gchat" component={Gchat} />
        {/* <stack.Screen name="Chat" component={Chat} /> */}
      </stack.Navigator>
    </NavigationContainer>
  );
}
