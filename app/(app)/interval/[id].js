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
import { useEffect, useState, useContext } from "react";
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
import { store } from "../../../store";
import { useSession } from "../../../context/Ctx";

const db = FIREBASE_DB;

export default function interval() {
  const { state, dispatch } = useContext(store);
  const { signOut, signIn, session, isLoading } = useSession();
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
        dispatch({ type: "CHANGE_INSULIN", payload: intervalDataInsulin });
        dispatch({ type: "CHANGE_NEEDLE", payload: intervalDataNeedle });
        dispatch({ type: "CHANGE_SENSOR", payload: intervalDataSensor });
      })
      .catch((error) => {
        console.error("Fel vid uppdatering:", error);
      });
  };

  useEffect(() => {
    setIntervalDataNeedle(parseInt(state.needle));

    setIntervalDataSensor(parseInt(state.sensor));

    setIntervalDataInsulin(parseInt(state.insulin));

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
    dispatch({ type: "CHANGE_INTERVAL", payload: true });
  }, [intervalDataNeedle, intervalDataSensor, intervalDataInsulin]);

  const nav = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView className=" bg-[#74cdcd]" style={{ flex: 1 }}>
      <View className="p-2">
        <View className="flex-row">
          <View className="flex-none">
            <Pressable onPress={() => nav()}>
              {({ pressed }) => (
                <Ionicons
                  name="arrow-back-circle-outline"
                  size={35}
                  color="white"
                />
              )}
            </Pressable>
          </View>
          <View className="grow pl-4">
            <Text className="text-2xl text-white font-bold">Inställningar</Text>
          </View>
        </View>
        <View className="grow mt-4">
          <Text className="text-2xl text-white font-bold">
            Antaldagar - intervallbyte
          </Text>
        </View>

        <View className="items-start p-2 ">
          <View className="w-full bg-[#143642] justify-center items-center p-1">
            <View className="flex flex-row items-center justify-center">
              <Entypo name="water" size={20} color="white" />
              <Text className="text-xl p-1 text-white">Insulin</Text>
            </View>
          </View>

          <View className="flex flex-row space-x-4 p-2  bg-[#20696a] w-full items-center justify-center">
            <View className="">
              <TouchableOpacity
                onPress={() => {
                  setIntervalDataInsulin(intervalDataInsulin + 1);
                  dispatch({
                    type: "CHANGE_INSULIN",
                    payload: intervalDataInsulin + 1,
                  });
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
          <View className="w-full  bg-[#143642] justify-center items-center mt-2">
            <View className="flex flex-row items-center justify-center">
              <MaterialCommunityIcons name="needle" size={20} color="white" />
              <Text className="text-xl p-1 text-white">Nål</Text>
            </View>
          </View>

          <View className="flex flex-row space-x-4 p-2 bg-[#20696a] w-full items-center justify-center">
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
          <View className="bg-[#143642] w-full justify-center items-center mt-2">
            <View className="flex flex-row items-center justify-center">
              <Ionicons name="wifi" size={20} color="white" />
              <Text className="text-xl p-1 text-white">Sensor</Text>
            </View>
          </View>

          <View className="flex flex-row space-x-4 p-2  bg-[#20696a]   w-full items-center justify-center">
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

          <View className="w-full bg-[#eda034] justify-center items-center mt-2 rounded-lg h-12">
            <TouchableOpacity onPress={() => listLatestChange()}>
              <View className="flex flex-row items-center justify-center">
                <Ionicons name="reload" size={24} color="#000" />
                <Text className="text-2xl p-1 text-black font-normal">
                  Uppdatera intervallen
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row">
          <View className="grow ">
            <Text className="text-2xl text-white font-bold">Konto</Text>
          </View>
        </View>
        <View className="p-2 ">
          <TouchableOpacity
            className="bg-[#eda034] rounded-lg h-12 w-full"
            onPress={signOut}
          >
            <View className="flex flex-row items-center justify-center">
              <Text className="text-2xl p-1 text-black font-normal">
                Logga ut
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
