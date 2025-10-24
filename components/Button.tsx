import { Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  // TO DO: implement the onPress prop:
  // onPress (function)
};

export default function Button({ label }: ButtonProps) {
  return (
    // TODO: use the onPress function to handle button behavior and styling when clicked
    // TODO: use tailwind classes (check documentation) to style the button according to the figma file 
    <Pressable className="px-4 py-2 bg-blue-500 rounded-lg">
      <Text className="text-white text-lg font-semibold">{label}</Text>
    </Pressable>
  );
}