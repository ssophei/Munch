// TODO: looking at the app's nav bar, we can see that the icons shown don't match their respective pages.
// currently, we are using the FontAwesome icon pack, part of the @expo/vector-icons bundle. 
import React, { createContext, useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';
import "../global.css";

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { View } from 'react-native';

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
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
}) {
  return <FontAwesome6 size={18} style={{ marginBottom: 3 }} {...props} />;
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
          tabBarInactiveTintColor: '#AB797A',
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
            tabBarIcon: ({ color }) => 
              <View style={{ paddingTop:6}}> 
                <TabBarIcon name="magnifying-glass" color={color} />
              </View>,
            tabBarLabelStyle: {
              fontFamily: 'montserrat-semibold',
            }
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
            tabBarIcon: ({ color }) => 
              <View style={{ paddingTop:6}}> 
                <TabBarIcon name="fire" color={color} />
              </View>,
            tabBarLabelStyle: {
              fontFamily: 'montserrat-semibold',
            }
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => 
              <View style={{ paddingTop:6}}> 
                <TabBarIcon name="gear" color={color} />
              </View>,
            tabBarLabelStyle: {
              fontFamily: 'montserrat-semibold',
            }
          }}
        />
      </Tabs>
    </MatchesContext.Provider>
  );
}
