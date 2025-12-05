import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="create-account" />
            <Stack.Screen name="confirmation-code" />
            <Stack.Screen name="location" />
            <Stack.Screen name="cuisines" />
            <Stack.Screen name="dietary" />
            <Stack.Screen name="done" />
        </Stack>
    );
}
