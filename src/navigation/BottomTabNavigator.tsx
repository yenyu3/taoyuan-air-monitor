import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/DashboardScreen';
import { MapScreen } from '../screens/MapScreen';
import { ExplorerScreen } from '../screens/ExplorerScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { AlertsScreen } from '../screens/AlertsScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Map':
              iconName = 'map';
              break;
            case 'Explorer':
              iconName = 'search';
              break;
            case 'Events':
              iconName = 'calendar';
              break;
            case 'Alerts':
              iconName = 'bell';
              break;
            default:
              iconName = 'circle';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A8D73',
        tabBarInactiveTintColor: '#B5C99A',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 35,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={20}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={styles.tabBarBackground} />
          </BlurView>
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: '總覽' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ tabBarLabel: '地圖' }}
      />
      <Tab.Screen 
        name="Explorer" 
        component={ExplorerScreen}
        options={{ tabBarLabel: '檢索' }}
      />
      <Tab.Screen 
        name="Events" 
        component={EventsScreen}
        options={{ tabBarLabel: '事件' }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen}
        options={{ tabBarLabel: '警報' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(244, 242, 233, 0.9)',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(106, 141, 115, 0.2)',
  },
});