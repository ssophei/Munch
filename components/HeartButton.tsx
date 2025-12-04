import { Heart } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable } from "react-native";

type HeartButtonProps = {
  restaurant: {
    // the rest of the attributes will be added when RestaurantCard is complete!
    name: string;
    imageUrl?: string;
  };
};

export default function HeartButton({ restaurant }: HeartButtonProps) {
// this will be useful for handlePress!
  const [liked, setLiked] = useState(false);

// TODO: implement handlePress. make sure that when the heart is liked and unliked,
//  a message containing the restaurant's name is logged in console.
   const handlePress = () => {
    setLiked(!liked);
    console.log(liked ? 'Unliked restaurant: ${restaurant.name}' : 'Liked restaurant: ${restaurant.name');
   };

  // TODO: change the styling so that the heart changes color when pressed!  
  return (
    <Pressable
        onPress={handlePress}>
      <Heart
        size={28}
        color={liked ? "red" : "black"}
        fill={liked ? "red" : "none"}
      />
    </Pressable>
  );
}
