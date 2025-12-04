import HeartButton from "@/components/HeartButton";
import { Image, Text, View } from 'react-native';

export interface RestaurantCardProps {
  name: string;
  rating: number;
  imageUrl: string;
  category: string;
  price: string;
  location: string;
  distance: number;
  // TODO: what other props would this component need to take in? 
  // think about what relevant information should be displayed (ie. images, rating, price)
};

export default function RestaurantCard({name, rating, imageUrl, category, price, location, distance}: RestaurantCardProps) {

  return (
    <View className="bg-white rounded-2xl w-64 h-72 shadow-md relative">
      {/* Image */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-36 rounded-t-2xl "
        resizeMode="cover"
      />

      {/* Card content */}
      <View className="p-3 flex-1">
        {/* Name and category */}
        <View className="mb-2">
          <Text className="text-lg font-semibold">{name}</Text>
          <Text className="text-gray-500">{category}</Text>
        </View>

        {/* Rating, Price, Distance */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-yellow-500 font-semibold">{rating}⭐</Text>
        </View>
      </View>

      {/* Heart + price in bottom-left */}
      <Text className="absolute bottom-3 left-3 right-3 flex-row justidy-between items-center text-gray-700 font-semibold">{price}</Text>
      <View className="absolute right-3 bottom-3 flex-row items-center space-x-2">
        <HeartButton restaurant={{ name, imageUrl }} />
      </View>
    </View>
  );
}
