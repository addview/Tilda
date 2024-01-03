import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
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
  query,
  where,
  limit,
  updateDoc,
} from "firebase/firestore";
import { store } from "../../../store";
import { useSession } from "../../../context/Ctx";
import Intervall from "../../../components/Intervall";

const db = FIREBASE_DB;

export default function interval() {
  const { state, dispatch } = useContext(store);
  const { signOut } = useSession();
  const params = useLocalSearchParams();
  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();

  const [intervalDataNeedle, setIntervalDataNeedle] = useState(0);
  const [intervalDataSensor, setIntervalDataSensor] = useState(0);
  const [intervalDataInsulin, setIntervalDataInsulin] = useState(0);

  const [intervalDataGlucaGen, setIntervalDataGlucaGen] = useState(0);
  const [intervalDataSparepenMeal, setIntervalDataSparepenMeal] = useState(0);
  const [intervalDataSparepenLongTerm, setIntervalDataSparepenLongTerm] =
    useState(0);
  const [intervalDataTransmitter, setIntervalDataTransmitter] = useState(0);

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
      sparepenmeal: intervalDataSparepenMeal,
      sparepenlongterm: intervalDataSparepenLongTerm,
      glucagen: intervalDataGlucaGen,
      transmitter: intervalDataTransmitter,
    })
      .then(() => {
        console.log("Dokumentet uppdaterat!");
        dispatch({ type: "CHANGE_INSULIN", payload: intervalDataInsulin });
        dispatch({ type: "CHANGE_NEEDLE", payload: intervalDataNeedle });
        dispatch({ type: "CHANGE_SENSOR", payload: intervalDataSensor });
        dispatch({
          type: "CHANGE_SPAREPENMEAL",
          payload: intervalDataSparepenMeal,
        });
        dispatch({
          type: "CHANGE_SPAREPENLONGTERM",
          payload: intervalDataSparepenLongTerm,
        });
        dispatch({ type: "CHANGE_GLUCAGEN", payload: intervalDataGlucaGen });
        dispatch({
          type: "CHANGE_TRANSMITTER",
          payload: intervalDataTransmitter,
        });
      })
      .catch((error) => {
        console.error("Fel vid uppdatering:", error);
      });
  };

  useEffect(() => {
    setIntervalDataNeedle(parseInt(state.needle));
    setIntervalDataSensor(parseInt(state.sensor));
    setIntervalDataInsulin(parseInt(state.insulin));
    setIntervalDataSparepenMeal(parseInt(state.sparepenmeal));
    setIntervalDataSparepenLongTerm(parseInt(state.sparepenlongterm));
    setIntervalDataGlucaGen(parseInt(state.glucagen));
    setIntervalDataTransmitter(parseInt(state.transmitter));
    setTargetEmail(params.email);
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

    if (intervalDataSparepenMeal) {
      setIntervalDataSparepenMeal(intervalDataSparepenMeal);
    }

    if (intervalDataSparepenLongTerm) {
      setIntervalDataSparepenLongTerm(intervalDataSparepenLongTerm);
    }

    if (intervalDataGlucaGen) {
      setIntervalDataGlucaGen(intervalDataGlucaGen);
    }

    if (intervalDataTransmitter) {
      setIntervalDataTransmitter(intervalDataTransmitter);
    }

    dispatch({ type: "CHANGE_INTERVAL", payload: true });
  }, [
    intervalDataNeedle,
    intervalDataSensor,
    intervalDataInsulin,
    intervalDataSparepenMeal,
    intervalDataSparepenLongTerm,
    intervalDataGlucaGen,
    intervalDataTransmitter,
  ]);

  const nav = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView className=" bg-[#74cdcd]" style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
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
            <View className="grow pl-2">
              <Text className="text-2xl text-white font-bold">
                Inställningar
              </Text>
            </View>
          </View>
          <View className="mt-2">
            <Text className="text-2xl text-white font-bold">
              Antaldagar - intervallbyte
            </Text>
          </View>

          <View className="flex flex-col gap-2 p-2">
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataInsulin}
                intervalData={intervalDataInsulin}
                type="CHANGE_INSULIN"
                name="Insulin"
              />
            </View>
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataNeedle}
                intervalData={intervalDataNeedle}
                type="CHANGE_NEEDLE"
                name="Nål"
              />
            </View>
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataSensor}
                intervalData={intervalDataSensor}
                type="CHANGE_SENSOR"
                name="Sensor"
              />
            </View>
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataSparepenMeal}
                intervalData={intervalDataSparepenMeal}
                type="CHANGE_SPAREPENMEAL"
                name="Måltid"
              />
            </View>
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataSparepenLongTerm}
                intervalData={intervalDataSparepenLongTerm}
                type="CHANGE_SPAREPENLONGTERM"
                name="Långtid"
              />
            </View>
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataTransmitter}
                intervalData={intervalDataTransmitter}
                type="CHANGE_TRANSMITTER"
                name="Sändare"
              />
            </View>
            <View>
              <Intervall
                className=""
                setIntervalData={setIntervalDataGlucaGen}
                intervalData={intervalDataGlucaGen}
                type="CHANGE_GLUCAGEN"
                name="Glukagon"
              />
            </View>
          </View>

          <View className="pr-1 pl-1">
            <View className="w-full bg-[#eda034] justify-center items-center mt-2 rounded-lg h-12">
              <TouchableOpacity onPress={() => listLatestChange()}>
                <View className="flex flex-row items-center justify-center">
                  <Text className="text-lg p-1 text-white font-normal">
                    Uppdatera intervallen
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row mt-2">
            <View className="grow ">
              <Text className="text-2xl text-white font-bold">Konto</Text>
            </View>
          </View>
          <View className="p-2 ">
            <TouchableOpacity
              className="bg-[#eda034] justify-center items-center mt-2 rounded-lg h-12"
              onPress={signOut}
            >
              <View className="flex flex-row items-center justify-center">
                <Text className="text-lg p-1 text-white font-normal">
                  Logga ut
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
