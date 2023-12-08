import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  useColorScheme,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function Modal() {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView className="flex-1 flex-col   bg-[#74cdcd]">
      <View className="p-2">
        <View className="flex-row">
          <View>
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="close-circle-outline"
                    size={30}
                    color={"#fff"}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          </View>
          <View className="ml-4 items-center ">
            <Text className="text-2xl font-bold text-white">Inställningar</Text>
          </View>
        </View>
      </View>
      <View>
        {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}

        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </SafeAreaView>
  );
}
