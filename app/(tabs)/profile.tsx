import { Text, View } from "@/components/Themed";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import Toast from 'react-native-toast-message';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { api } from "@/api/client";
import { APP_CONFIG } from "@/constants/config";

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
  success: (props: any) => (
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

  error: (props: any) => (
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
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const preferences = await api.users.getPreferences(APP_CONFIG.defaultUserId);
      
      if (preferences && (preferences.cuisines || preferences.dietaryRestrictions)) {
        const combined = [
          ...(preferences.cuisines || []),
          ...(preferences.dietaryRestrictions || []),
        ];
        setSelected(combined);
        console.log('✅ Loaded preferences:', combined);
      } else {
        // Set defaults if no preferences found
        const defaults = ["Chinese", "Vietnamese", "Italian", "Drinks", "New American", "Vegetarian"];
        setSelected(defaults);
        console.log('📝 Using default preferences');
      }
    } catch (err) {
      console.error('❌ Failed to load preferences:', err);
      // Use defaults on error
      const defaults = ["Chinese", "Vietnamese", "Italian", "Drinks", "New American", "Vegetarian"];
      setSelected(defaults);
      Toast.show({
        type: 'error',
        text1: 'Failed to load preferences',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newSelected: string[]) => {
    try {
      setSaving(true);
      
      // Split into cuisines and dietary restrictions
      const cuisines = newSelected.filter(item => CUISINES.includes(item));
      const dietaryRestrictions = newSelected.filter(item => DIETARY_RESTRICTIONS.includes(item));

      await api.users.updatePreferences(APP_CONFIG.defaultUserId, {
        cuisines,
        dietaryRestrictions,
      });

      console.log('✅ Saved preferences:', { cuisines, dietaryRestrictions });
      
      Toast.show({
        type: 'success',
        text1: 'Preferences updated',
        position: 'bottom',
      });
    } catch (err) {
      console.error('❌ Failed to save preferences:', err);
      Toast.show({
        type: 'error',
        text1: 'Failed to save preferences',
        position: 'bottom',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleCuisine = (name: string) => {
    setSelected((prev) => {
      const newSelected = prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name];
      
      // Save to backend (debounced in a real app)
      savePreferences(newSelected);
      
      return newSelected;
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary items-center justify-center" edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#8C2F39" />
        <Text className="text-accent text-xl mt-4" style={{ fontFamily: 'montserrat-semibold' }}>
          Loading preferences...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <ScrollView
        style={{ flex: 1 }}
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
                  disabled={saving}
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
                  disabled={saving}
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

        {saving && (
          <View className="items-center mb-4">
            <ActivityIndicator size="small" color="#8C2F39" />
            <Text className="text-secondary mt-2" style={{ fontFamily: 'montserrat-regular' }}>
              Saving...
            </Text>
          </View>
        )}
      </ScrollView>
      <Toast config={toastConfig} />
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
