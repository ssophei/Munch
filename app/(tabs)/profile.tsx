import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import Toast from 'react-native-toast-message';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
 
const CUISINES = [
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Indian",
  "Mexican",
  "New American",
  "Italian",
  "French",
  "Vietnamese",
  "Drinks",
  "Fusion",
  "Ethiopian",
  "Himalayan",
];

const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Kosher",
  "Halal",
  "No Pork"
];

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ 
        backgroundColor: '#8C2F39',
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: "montserrat-semibold",
      }}
    />
  ),
  
  // You can define other types like 'error' as well
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        color: 'red',
        fontSize: 17,
      }}
    />
  ),
};

export default function profileScreen() {
  const defaultSelectedItems = ["Chinese", "Vietnamese", "Italian", "Drinks", "New American", "Vegetarian"];
  const [selected, setSelected] = useState<string[]>(defaultSelectedItems);

  const toggleCuisine = (name: string) => {
    let message = '';
    
    setSelected((prev) => {
        if (prev.includes(name)) {
            message = `Preferences updated.`;
            return prev.filter((c) => c !== name);
        } else {
            message = `Preferences updated.`;
            return [...prev, name];
        }
    });

    // Show the Toast after state update (React Batches state updates, so this should run after the action)
    Toast.show({
        type: 'success', // or 'info'
        text1: message,
        position: 'bottom', // or 'top'
    });
};

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <ScrollView 
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      >
      <View className="w-full items-center mb-5">
          <Text className="text-4xl font-semibold text-accent my-5" style={{ fontFamily: 'montserrat-bold' }}>
          Cuisine Preferences
          </Text>
          <View style={styles.grid}>
            {CUISINES.map((cuisine) => {
              const isSelected = selected.includes(cuisine);
              return (
                <TouchableOpacity
                style={[
                  styles.cuisineButton,
                  isSelected && styles.cuisineButtonSelected,
                ]}
                key={cuisine}
                onPress={() => toggleCuisine(cuisine)}
                >
                  <Text
                    style={[
                      styles.cuisineText,
                      isSelected && styles.cuisineTextSelected,
                    ]}
                  >
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="w-full items-center mb-20">
          <Text className="text-4xl font-semibold text-accent my-5" style={{ fontFamily: 'montserrat-bold' }}>
          Dietary Restrictions
          </Text>
          <View style={styles.grid}>
            {DIETARY_RESTRICTIONS.map((restriction) => {
              const isSelected = selected.includes(restriction);
              return (
                <TouchableOpacity
                style={[
                  styles.cuisineButton,
                  isSelected && styles.cuisineButtonSelected,
                ]}
                key={restriction}
                onPress={() => toggleCuisine(restriction)}
                >
                  <Text
                    style={[
                      styles.cuisineText,
                      isSelected && styles.cuisineTextSelected,
                    ]}
                  >
                    {restriction}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <Toast config={toastConfig}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    grid: {
    marginTop: 10,
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    justifyContent: "space-between",
  },
  cuisineButton: {
    width: 150,
    paddingVertical: 14,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FAC5C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuisineButtonSelected: {
    backgroundColor: '#E68E91',
  },
  cuisineText: {
    fontSize: 15,
    color: "#3b1322",
    fontFamily: "montserrat-semibold",
  },
  cuisineTextSelected: {
    fontFamily: "montserrat-bold",
  },
});