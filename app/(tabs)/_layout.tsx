// TODO: looking at the app's nav bar, we can see that the icons shown don't match their respective pages.
// currently, we are using the FontAwesome icon pack, part of the @expo/vector-icons bundle. 
import React, { createContext, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import "../global.css";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// --- Create Matches Context ---
export const MatchesContext = createContext<{
  matches: any[];
  addMatch: (restaurant: any) => void;
}>({
  matches: [],
  addMatch: () => {},
});

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
  const [matches, setMatches] = useState<any[]>([]);
  
  const addMatch = (restaurant:any) => {
    setMatches(prev => [...prev, restaurant]);
  };

  return (
    <MatchesContext.Provider value={{ matches, addMatch }}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <TabBarIcon name="glass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="signal" color={color} />,
        }}
      />
    </Tabs>
    </MatchesContext.Provider>
  );
}
