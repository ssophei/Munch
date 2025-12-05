import HeartButton from "@/components/HeartButton";
import { Image, Text, View } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

export interface RestaurantCardProps {
  name: string;
  rating: number;
  imageUrl: string;
  category: string;
  price: string;
  location: string;
  distance: number;
};

export default function RestaurantCard({name, rating, imageUrl, category, price, location, distance}: RestaurantCardProps) {
  const { height } = Dimensions.get('window');
  const CARD_HEIGHT = height * 0.55;
  
  return (
    <View className="rounded-2xl w-full shadow-md relative" style={{height: CARD_HEIGHT}}>
      {/* Image */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full rounded-2xl "
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          'transparent',
          'rgba(0,0,0,0.7)',
        ]}
        style={{ width: '100%', height: "60%", position: 'absolute', bottom: 0, left: 0, zIndex: 50, borderRadius: 15}}
      />

      <View className="absolute bottom-5 left-0 right-0 z-50 pb-3 pl-5 items-start">
        {/* Name and category */}
        <View className="mb-2 w-5/6">
          <Text className="text-4xl text-white mb-3" style={{ fontFamily: 'montserrat-bold'}}>{name}</Text>
          <Text className="text-gray-200" style={{ fontFamily: 'montserrat-semibold' }}>{category}</Text>
        </View>

        {/* Rating, Price, Distance */}
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-yellow-500 font-semibold text-lg" style={{ fontFamily: 'montserrat-bold' }}>{rating} ⭐</Text>
          <Text className="text-gray-200 font-semibold mr-10 text-lg" style={{ fontFamily: 'montserrat-bold' }}>{price}</Text>
        </View>
      </View>
    </View>
  );
}
