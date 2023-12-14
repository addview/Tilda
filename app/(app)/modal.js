import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialIcons,
  FontAwesome,
  SimpleLineIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function Modal({ params }) {
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();
  //const [intervalDataInsulin, setIntervalDataInsulin] = useState(null);
  const [intervalDataNeedle, setIntervalDataNeedle] = useState(null);
  const [intervalDataSensor, setIntervalDataSensor] = useState(null);

  console.log(router.params);

  return (
    <SafeAreaView className=" bg-[#74cdcd]" style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-2">
          <View className="flex-row">
            <View className="flex-none">
              <Link href="/" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <Ionicons
                      name="arrow-back-circle-outline"
                      size={35}
                      color="white"
                    />
                  )}
                </Pressable>
              </Link>
            </View>
            <View className="grow pl-4">
              <Text className="text-2xl text-white font-bold">
                Mina inställningar
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: 10 }}
            lightColor="#f4f5f5"
            darkColor="#242426"
            className="bg-[#eda034] pt-2"
          >
            <Text className="p-2 text-black text-xl font-bold">
              Bytesintervall antal dagar
            </Text>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View className="p-2">
              <Text className="text-xl">Insulin</Text>
              <TextInput
                autoComplete="off"
                inputMode="numeric"
                onChangeText={(text) => setIntervalDataInsulin(text)}
                placeholder="--intervall antal dagar--"
                className="h-10 p-2  border-solid border-2 bg-[#ffffff] w-3/4"
              />
            </View>
            <View className="p-2">
              <Text className="text-xl">Nål</Text>
              <TextInput
                autoComplete="off"
                inputMode="numeric"
                onChangeText={(text) => setIntervalDataNeedle(text)}
                placeholder="--intervall antal dagar--"
                className="w-3/4 h-10 p-2   border-solid border-2 bg-[#ffffff]"
              />
            </View>
            <View className="p-2">
              <Text className="text-xl">Sensor</Text>
              <TextInput
                autoComplete="off"
                inputMode="numeric"
                onChangeText={(text) => setIntervalDataSensor(text)}
                placeholder="--intervall antal dagar--"
                className="w-3/4 h-10 p-2  border-solid border-2 bg-[#ffffff]"
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
