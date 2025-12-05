import { Text, View, Image, ScrollView} from "react-native";
import RestaurantCard from "@/components/RestaurantCard"; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from "react";
import { MatchesContext } from "@/app/(tabs)/_layout";

const munchLogo = require('../../assets/images/munch-logo.png');

export default function MatchesScreen() {
  const { matches } = useContext(MatchesContext);

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-start flex-col h-full">
        <Image source = { munchLogo } style={{ width: 150, height: 150 }}/>
        <Text className="text-5xl font-semibold text-accent mb-5" style={{ fontFamily: 'montserrat-bold' }}>
          Your Matches
        </Text>
        <ScrollView className="w-5/6" contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {matches.map((restaurant, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <RestaurantCard {...restaurant} />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};
