import { View, Text, Image } from 'react-native';

export interface RestaurantCardProps {
  name: string;
  // TODO: what other props would this component need to take in? 
  // think about what relevant information should be displayed (ie. images, rating, price)
};

export default function RestaurantCard({ name }: RestaurantCardProps) {
  return (
    // TODO: use your new props to display additional information 
    // BONUS TODO: use tailwind classes (look through documentation) to adjust styling
    <View className="flex-1 bg-white rounded-2xl items-center shadow-md overflow-hidden">
      <View className="p-4 text-blue-500">
        <Text>{name}</Text>
      </View>
    </View>
  );
}
