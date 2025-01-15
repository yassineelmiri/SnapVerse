import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import AddAdvertisement from './app/screens/AddAdvertisement';
import { FIREBASE_AUTH } from './Firebase.config';

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="List "
        component={List}
        options={{ headerShown: true, title: 'Publications' }}
      />
  <InsideStack.Screen
    name="Details"
    component={Details}
    options={{ title: 'Détails' }}
/>
      <InsideStack.Screen
        name="AddAdvertisement"
        component={AddAdvertisement}
        options={{ title: 'Ajouter une publicité' }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      console.log('user', currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}
