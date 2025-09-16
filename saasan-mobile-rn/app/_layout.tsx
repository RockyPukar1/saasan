import "~/global.css";

import { DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { AuthProvider, useAuthContext } from "~/contexts/AuthContext";
import { LanguageProvider } from "~/contexts/LanguageContext";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();

  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider value={LIGHT_THEME}>
          <StatusBar style="dark" />
          <Stack>
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="politician"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="report"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar("light");
  }, []);
}

function noop() {}
