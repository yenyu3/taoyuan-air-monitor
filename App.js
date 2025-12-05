import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import Home from './src/pages/Home';
import Map from './src/pages/Map';
import Favorites from './src/pages/Favorites';
import Community from './src/pages/Community';
import Profile from './src/pages/Profile';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Map') {
              iconName = 'map';
            } else if (route.name === 'Favorites') {
              iconName = 'heart';
            } else if (route.name === 'Community') {
              iconName = 'message-circle';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3A4E6B',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{ tabBarLabel: '首頁' }}
        />
        <Tab.Screen 
          name="Map" 
          component={Map} 
          options={{ tabBarLabel: '地圖' }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={Favorites} 
          options={{ tabBarLabel: '收藏' }}
        />
        <Tab.Screen 
          name="Community" 
          component={Community} 
          options={{ tabBarLabel: '社群' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile} 
          options={{ tabBarLabel: '個人' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}