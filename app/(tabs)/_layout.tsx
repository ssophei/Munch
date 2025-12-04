// TODO: looking at the app's nav bar, we can see that the icons shown don't match their respective pages.
// currently, we are using the FontAwesome icon pack, part of the @expo/vector-icons bundle. 
import React from 'react';
// TODO: change this import statement! but read the other tasks below first. 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import "../global.css";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// TODO: explore the built-in icon families and icons at https://icons.expo.fyi/
// TODO: replace FontAwesome with the icon family you'd like to use. 
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// TODO: change the icons below!
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FED0BB',
          elevation: 5,
          shadowOpacity: 0.1
        }
      }}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <TabBarIcon name="glass" color={color} />,
          tabBarLabelStyle: {
            fontFamily: 'montserrat-semibold',
          }
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarLabelStyle: {
            fontFamily: 'montserrat-semibold',
          }
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="signal" color={color} />,
          tabBarLabelStyle: {
            fontFamily: 'montserrat-semibold',
          }
        }}
      />
    </Tabs>
  );
}
