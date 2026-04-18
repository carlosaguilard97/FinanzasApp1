import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { queryClient } from "../lib/queryClient";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modals/nuevo-movimiento" options={{ presentation: "modal", title: "Nuevo movimiento" }} />
            <Stack.Screen name="modals/nueva-cuenta" options={{ presentation: "modal", title: "Nueva cuenta" }} />
            <Stack.Screen name="modals/nueva-categoria" options={{ presentation: "modal", title: "Nueva categoría" }} />
            <Stack.Screen name="modals/nueva-suscripcion" options={{ presentation: "modal", title: "Nueva suscripción" }} />
            <Stack.Screen name="modals/nueva-meta" options={{ presentation: "modal", title: "Nueva meta" }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
