import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import Home from './src/pages/Home';
import Map from './src/pages/Map';
import Favorites from './src/pages/Favorites';
import Community from './src/pages/Community';
import Profile from './src/pages/Profile';
import { themes } from './src/utils/themes';
import useStore from './src/store/useStore';

const Tab = createBottomTabNavigator();

export default function App() {
  const { currentTheme } = useStore();
  const theme = themes[currentTheme];
  
  const scrollRefs = useRef({
    Home: null,
    Map: null,
    Favorites: null,
    Community: null,
    Profile: null,
  });
  
  const lastTapTime = useRef({});
  
  const handleTabPress = (routeName) => {
    const now = Date.now();
    const lastTap = lastTapTime.current[routeName] || 0;
    
    if (now - lastTap < 300) {
      // 雙擊檢測
      if (scrollRefs.current[routeName]) {
        scrollRefs.current[routeName].scrollTo({ y: 0, animated: true });
      }
    }
    
    lastTapTime.current[routeName] = now;
  };
  
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
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            paddingBottom: 20,
            paddingTop: 8,
            height: 80,
            position: 'absolute',
            bottom: 0,
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
          options={{ 
            tabBarLabel: '首頁',
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleTabPress('Home');
                  props.onPress();
                }}
              />
            )
          }}
        >
          {() => <Home scrollRef={(ref) => scrollRefs.current.Home = ref} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Map" 
          options={{ 
            tabBarLabel: '地圖',
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleTabPress('Map');
                  props.onPress();
                }}
              />
            )
          }}
        >
          {() => <Map scrollRef={(ref) => scrollRefs.current.Map = ref} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Favorites" 
          options={{ 
            tabBarLabel: '收藏',
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleTabPress('Favorites');
                  props.onPress();
                }}
              />
            )
          }}
        >
          {() => <Favorites scrollRef={(ref) => scrollRefs.current.Favorites = ref} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Community" 
          options={{ 
            tabBarLabel: '社群',
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleTabPress('Community');
                  props.onPress();
                }}
              />
            )
          }}
        >
          {() => <Community scrollRef={(ref) => scrollRefs.current.Community = ref} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Profile" 
          options={{ 
            tabBarLabel: '個人',
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleTabPress('Profile');
                  props.onPress();
                }}
              />
            )
          }}
        >
          {() => <Profile scrollRef={(ref) => scrollRefs.current.Profile = ref} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}