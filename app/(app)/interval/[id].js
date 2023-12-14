import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  useNavigation,
  useRouter,
  useLocalSearchParams,
  router,
  Link,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
} from "firebase/firestore";

const db = FIREBASE_DB;

export default function interval() {
  const params = useLocalSearchParams();
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();

  const [intervalDataNeedle, setIntervalDataNeedle] = useState(0);
  const [intervalDataSensor, setIntervalDataSensor] = useState(0);
  const [intervalDataInsulin, setIntervalDataInsulin] = useState(0);
  const [targetEmail, setTargetEmail] = useState(0);

  const listLatestChange = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", targetEmail),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    const documentRef = querySnapshot.docs[0].ref;

    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", targetEmail);
      return null;
    }
    await updateDoc(documentRef, {
      insulin: intervalDataInsulin,
      needle: intervalDataNeedle,
      sensor: intervalDataSensor,
    })
      .then(() => {
        console.log("Dokumentet uppdaterat!");
      })
      .catch((error) => {
        console.error("Fel vid uppdatering:", error);
      });
  };

  useEffect(() => {
    setIntervalDataNeedle(parseInt(params.needle));

    setIntervalDataSensor(parseInt(params.sensor));

    setIntervalDataInsulin(parseInt(params.insulin));

    setTargetEmail(params.email);
    console.log(params.email);
  }, []);

  useEffect(() => {
    if (intervalDataNeedle) {
      setIntervalDataNeedle(intervalDataNeedle);
    }
    if (intervalDataSensor) {
      setIntervalDataSensor(intervalDataSensor);
    }
    if (intervalDataInsulin) {
      setIntervalDataInsulin(intervalDataInsulin);
    }
  }, [intervalDataNeedle, intervalDataSensor, intervalDataInsulin]);

  return (
    <SafeAreaView className=" bg-[#74cdcd]" style={{ flex: 1 }}>
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
              Bytesintervall antal dagar
            </Text>
          </View>
        </View>

        <View className="items-start p-2 ">
          <View className="w-full bg-[#eda034] justify-center items-center p-1">
            <View className="flex flex-row items-center justify-center">
              <Entypo name="water" size={20} color="black" />
              <Text className="text-xl p-1 text-black">Insulin</Text>
            </View>
          </View>

          <View className="flex flex-row space-x-4 p-2 bg-[#143642] w-full items-center justify-center">
            <View className="">
              <TouchableOpacity
                onPress={() => {
                  setIntervalDataInsulin(intervalDataInsulin + 1);
                }}
              >
                <AntDesign name="pluscircleo" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View className="">
              <Text className="text-2xl text-white">{intervalDataInsulin}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  if (intervalDataInsulin > 1) {
                    setIntervalDataInsulin(intervalDataInsulin - 1);
                  }
                }}
              >
                <AntDesign name="minuscircleo" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full bg-[#eda034] justify-center items-center mt-2">
            <View className="flex flex-row items-center justify-center">
              <MaterialCommunityIcons name="needle" size={20} color="black" />
              <Text className="text-xl p-1 text-black">Nål</Text>
            </View>
          </View>

          <View className="flex flex-row space-x-4 p-2 bg-[#143642] w-full items-center justify-center">
            <View className="">
              <TouchableOpacity
                onPress={() => {
                  setIntervalDataNeedle(intervalDataNeedle + 1);
                }}
              >
                <AntDesign name="pluscircleo" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View className="">
              <Text className="text-2xl text-white">{intervalDataNeedle}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  if (intervalDataNeedle > 1) {
                    setIntervalDataNeedle(intervalDataNeedle - 1);
                  }
                }}
              >
                <AntDesign name="minuscircleo" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full bg-[#eda034] justify-center items-center mt-2">
            <View className="flex flex-row items-center justify-center">
              <Ionicons name="wifi" size={20} color="black" />
              <Text className="text-xl p-1 text-black">Sensor</Text>
            </View>
          </View>

          <View className="flex flex-row space-x-4 p-2 bg-[#143642] w-full items-center justify-center">
            <View>
              <TouchableOpacity
                onPress={() => {
                  setIntervalDataSensor(intervalDataSensor + 1);
                }}
              >
                <AntDesign name="pluscircleo" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-2xl text-white">{intervalDataSensor}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  if (intervalDataSensor > 1) {
                    setIntervalDataSensor(intervalDataSensor - 1);
                  }
                }}
              >
                <AntDesign name="minuscircleo" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full bg-[#eda034] justify-center items-center mt-2 rounded-lg">
            <TouchableOpacity onPress={() => listLatestChange()}>
              <View className="flex flex-row items-center justify-center">
                <Ionicons name="reload" size={30} color="#000" />
                <Text className="text-xl p-1 text-black font-bold">
                  Uppdatera
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
