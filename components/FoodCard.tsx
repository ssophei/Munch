import { View, Text, Image } from 'react-native';

type FoodCardProps = {
  name: string;
  // TO DO: what other props would this component need to take in? 
  // think about what relevant information should be displayed 
};

export default function FoodCard({ name}: FoodCardProps) {
  return (
    // TO DO: use your new props to display additional information; don't worry about styling yet
    <View className="bg-white rounded-2xl shadow-md overflow-hidden">
      <View className="p-4">
        <Text>{name}</Text>
      </View>
    </View>
  );
}
