import React, { useState } from "react";
import { Pressable } from "react-native";
import { Heart } from "lucide-react-native";

type HeartButtonProps = {
  restaurant: {
    // the rest of the attributes will be added when RestaurantCard is complete!
    name: string;
  };
};

export default function HeartButton({ restaurant }: HeartButtonProps) {
// this will be useful for handlePress!
  const [liked, setLiked] = useState(false);

// TODO: implement handlePress
//   const handlePress = () => {
//   };

  // TODO: change the styling so that the heart changes color when pressed!  
  return (
    <Pressable
        // onPress={handlePress}
        className="absolute top-3 left-3"
    >
      <Heart
        size={28}
      />
    </Pressable>
  );
}
