import React from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;

type SwipeHOCProps = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

/**
 * A Higher-Order Component (HOC) that adds swipe gesture support
 * to any wrapped component. Swiping right calls onSwipeRight,
 * swiping left calls onSwipeLeft, and otherwise springs back.
 */
export function withSwipe<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function SwipeableComponent({
    onSwipeLeft,
    onSwipeRight,
    ...props
  }: SwipeHOCProps & P) {
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);

    // Define pan gesture
    const pan = Gesture.Pan()
      .onChange((event) => {
        translateX.value = event.translationX;
        rotate.value = event.translationX / 20;
      })
      .onEnd(() => {
        "worklet";

        const isSwipedRight = translateX.value > SWIPE_THRESHOLD;
        const isSwipedLeft = translateX.value < -SWIPE_THRESHOLD;

        if (isSwipedRight) {
          translateX.value = withSpring(width, { damping: 15 }, () => {
            // ✅ Safe JS callback without runOnJS
            if (onSwipeRight) {
              queueMicrotask(() => onSwipeRight());
            }
          });
        } else if (isSwipedLeft) {
          translateX.value = withSpring(-width, { damping: 15 }, () => {
            if (onSwipeLeft) {
              queueMicrotask(() => onSwipeLeft());
            }
          });
        } else {
          translateX.value = withSpring(0);
          rotate.value = withSpring(0);
        }
      });

    // Animate card position + rotation
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
    }));

    return (
      <GestureDetector gesture={pan}>
        <Animated.View
          className="absolute w-full items-center"
          style={animatedStyle}
        >
          <WrappedComponent {...(props as P)} />
        </Animated.View>
      </GestureDetector>
    );
  };
}
