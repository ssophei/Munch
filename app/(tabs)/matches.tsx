import { Text, View, ScrollView } from "react-native";
import { useContext } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import { MatchesContext } from "@/app/(tabs)/_layout";

export default function MatchesScreen() {
  const { matches } = useContext(MatchesContext);

  return (
    <View style={{ flex: 1, backgroundColor: '#FED0BB', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 50, marginBottom: 20 }}>
        Your Matches
      </Text>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}>
        {matches.map((restaurant, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <RestaurantCard {...restaurant} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
