import { View, Text, Image } from 'react-native';
import HeartButton from "@/components/HeartButton";

type RestaurantCardProps = {
  name: string;
  // TODO: what other props would this component need to take in? 
  // think about what relevant information should be displayed (ie. images, rating, price)
};

export default function RestaurantCard({ name}: RestaurantCardProps) {

  return (
    // TODO: use your new props to display additional information 
    // BONUS TODO: use tailwind classes (look through documentation) to adjust styling
    <View className= "bg-white rounded-2xl flex-row items-center justify-center h-64 w-64">
        <Text>{name}</Text>
        <HeartButton 
          restaurant={{ name }}
        />
    </View>
  );
}
