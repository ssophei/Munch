import { X } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";

type HeartButtonProps = {
  restaurant: any;
  onLike: () => void;
};

export default function HeartButton({ restaurant, onLike }: HeartButtonProps) {
  const [liked, setLiked] = useState(false);

  const handlePress = () => {
    setLiked(prevLiked => {
      const newLiked = !prevLiked;
      
      if (newLiked) {
        onLike(); 
      }

      console.log(
        newLiked 
          ? `Liked restaurant: ${restaurant.name}` 
          : `Unliked restaurant: ${restaurant.name}`
      );
      return newLiked;
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} className="bg-accent w-24 h-24 rounded-full flex justify-center items-center">
      <X size={60} color="white"></X>
    </TouchableOpacity>
  );
}
