import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../context/Ctx";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import "moment/locale/sv";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { Link } from "expo-router";
import { FIREBASE_DB } from "../../firebaseConfig";

const db = FIREBASE_DB;

const index = () => {
  const ios = "20%";
  const android = "90%";
  const iosH = 215;
  const androidH = 185;

  const { session, signOut, isLoading } = useSession();
  const tyraUserID = "tuxs3L8OjXlMk1kimdWI";
  const loadingMessage = "..hämtar data";
  const [insulinData, setInsulinData] = useState(null);
  const [needleData, setNeedleData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showInsulinDateTime, setShowInsulinDateTime] = useState(false);
  const [showSensorDateTime, setShowSensorDateTime] = useState(false);
  const [showNeelDateTime, setShowNeelDateTime] = useState(false);

  const [intervalDataInsulin, setIntervalDataInsulin] = useState(null);
  const [intervalDataNeedle, setIntervalDataNeedle] = useState(null);
  const [intervalDataSensor, setIntervalDataSensor] = useState(null);

  const [isNeedleDataAfter, setIsNeedleDataAfter] = useState(false);
  const [isInsulinDataAfter, setIsInsulinDataAfter] = useState(false);
  const [isSensorDataAfter, setIsSensorDataAfter] = useState(false);
  const [uniqueDokumentId, setUniqueDokumentId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const executeAsyncFunctions = async () => {
      try {
        await getUserByEmail(session); // Väntar på att denna funktion ska slutföras
      } catch (error) {
        console.error(
          "Ett fel uppstod under körning av asynkrona funktioner",
          error
        );
      }
    };

    executeAsyncFunctions();
  }, [session]);

  useEffect(() => {
    if (needleData) {
      setIsNeedleDataAfter(isDataAfter(needleData));
    }
    if (insulinData) {
      setIsInsulinDataAfter(isDataAfter(insulinData));
    }
    if (sensorData) {
      setIsSensorDataAfter(isDataAfter(sensorData));
    }
  }, [needleData, insulinData, sensorData]);

  // En separat useEffect för att logga state när den ändras
  useEffect(() => {
    fetchData(); // Därefter körs denna
    getUserIntervall(session); // Och sist denna
  }, [uniqueDokumentId]);

  useEffect(() => {
    console.log("juse effect");
  }, []);

  const getUserByEmail = async (session) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", session),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", session);
      alert("Inga poster hittades för " + session);
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    setUniqueDokumentId(userDoc.id);
    return userDoc.data();
  };

  const getUserIntervall = async (email) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", session),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", email);
      alert("Inga poster hittades för", email);
      setIntervalDataInsulin(null);
      setIntervalDataNeedle(null);
      setIntervalDataSensor(null);
      setInsulinData(null);
      setNeedleData(null);
      setSensorData(null);
      return null;
    }
    const latestDoc = querySnapshot.docs[0];
    setIntervalDataInsulin(latestDoc.data().insulin);
    setIntervalDataNeedle(latestDoc.data().needle);
    setIntervalDataSensor(latestDoc.data().sensor);
    setUserName(latestDoc.data().Namn);
    return latestDoc.data();
  };

  const listLatestChange = async (userid, changeType) => {
    const q = query(
      collection(db, "changes"),
      where("changeType", "==", changeType),
      where("userId", "==", uniqueDokumentId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", changeType);
      return null;
    }
    const latestDoc = querySnapshot.docs[0];
    return latestDoc.data();
  };

  const addChanges = async (userId, changeType, date) => {
    let fixDate = moment(date, "dddd, Do MMMM , HH:mm").format("L");
    let fixTime = moment(date, "dddd, Do MMMM , HH:mm").format("LT");

    const docRef = await addDoc(collection(db, "changes"), {
      changeType: changeType,
      dateChanged: fixDate,
      timeChanged: fixTime,
      timestamp: moment().valueOf(),
      userId: userId,
    });
  };

  function changeTimeToNoon(inputStr) {
    // Använd en regex för att matcha klockslag (HH:MM format)
    let regex = /(\d{1,2}:\d{2})/;

    // Ersätt det befintliga klockslaget med "12:00"
    return inputStr.replace(regex, "12:00");
  }

  const onChangeInsulin = (event, selectedDate) => {
    setShowInsulinDateTime(false);
    if (event.type === "set") {
      const _insulinDate = addRegDays(selectedDate, intervalDataInsulin);

      let dateTimeStr = _insulinDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setInsulinData(updatedDateTimeStr);
      saveInsulinData(updatedDateTimeStr);
    }
  };

  const onChangeSensor = (event, selectedDate) => {
    setShowSensorDateTime(false);
    if (event.type === "set") {
      const _sensorDate = addRegDays(selectedDate, intervalDataSensor);

      let dateTimeStr = _sensorDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setSensorData(updatedDateTimeStr);
      saveSensorData(updatedDateTimeStr);
    }
  };

  const onChangeNeel = (event, selectedDate) => {
    setShowNeelDateTime(false);
    if (event.type === "set") {
      const _neelDate = addRegDays(selectedDate, intervalDataNeedle);

      let dateTimeStr = _neelDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setNeedleData(updatedDateTimeStr);
      saveNeedleData(updatedDateTimeStr);
    }
  };

  const showMode = (currentMode, index) => {
    if (index === 0) {
      setShowInsulinDateTime(true);
      setShowSensorDateTime(false);
      setShowNeelDateTime(false);
    }
    if (index === 1) {
      setShowSensorDateTime(true);
      setShowNeelDateTime(false);
      setShowInsulinDateTime(false);
    }
    if (index === 2) {
      setShowNeelDateTime(true);
      setShowSensorDateTime(false);
      setShowInsulinDateTime(false);
    }

    setMode(currentMode);
  };

  const showDatepicker = (index) => {
    showMode("date", index);
  };

  moment.locale("sv");

  const addRegDays = (date, days) => {
    return moment(date).add(days, "days").format("dddd, Do MMMM , HH:mm");
  };

  const saveInsulinData = async (insulinDatum) => {
    addChanges(uniqueDokumentId, "Insulin", insulinDatum);
  };

  const saveNeedleData = async (needleDatum) => {
    addChanges(uniqueDokumentId, "Needle", needleDatum);
  };

  const saveSensorData = async (sensorDatum) => {
    addChanges(uniqueDokumentId, "Sensor", sensorDatum);
  };

  const isDataAfter = (data) => {
    if (
      moment(
        moment(moment(), "dddd, Do MMMM , HH:mm").format("YYYY-MM-DD HH:mm")
      ).isAfter(
        moment(data, "dddd, Do MMMM , HH:mm").format("YYYY-MM-DD HH:mm")
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const fetchData = async () => {
    setShowInsulinDateTime(false);
    setShowSensorDateTime(false);
    setShowNeelDateTime(false);
    try {
      const [needleDataResponse, sensorDataResponse, insulinDataResponse] =
        await Promise.all([
          listLatestChange(uniqueDokumentId, "Needle"),
          listLatestChange(uniqueDokumentId, "Sensor"),
          listLatestChange(uniqueDokumentId, "Insulin"),
        ]);

      if (needleDataResponse) {
        const dateFix =
          needleDataResponse.dateChanged + " " + needleDataResponse.timeChanged;
        const dateFormat = "YYYY-MM-DD HH:mm:ss"; // Anpassa formatet efter ditt datums och tidsformat
        setNeedleData(
          moment(dateFix, dateFormat).format("dddd, Do MMMM , HH:mm")
        );
      }

      if (sensorDataResponse) {
        const sensorDateFix =
          sensorDataResponse.dateChanged + " " + sensorDataResponse.timeChanged;
        setSensorData(moment(sensorDateFix).format("dddd, Do MMMM , HH:mm"));
      }

      if (insulinDataResponse) {
        const insulinDateFix =
          insulinDataResponse.dateChanged +
          " " +
          insulinDataResponse.timeChanged;
        setInsulinData(moment(insulinDateFix).format("dddd, Do MMMM , HH:mm"));
      }
    } catch (error) {
      alert("Fel vid hämtning av data.");
    }
  };

  const onPressInsulin = (date) => {
    const _insulindate = addRegDays(date, intervalDataInsulin);
    setShowInsulinDateTime(false);
    setInsulinData(_insulindate);
    saveInsulinData(_insulindate);
  };
  const onPressNeedle = (date) => {
    const _needledate = addRegDays(date, intervalDataNeedle);
    setShowNeelDateTime(false);
    setNeedleData(_needledate);
    saveNeedleData(_needledate);
  };
  const onPressSensor = (date) => {
    const _sensordate = addRegDays(date, intervalDataSensor);
    setShowSensorDateTime(false);
    setSensorData(_sensordate);
    saveSensorData(_sensordate);
  };

  return (
    <SafeAreaView className="flex-1 flex-col gap-2 p-2 bg-[#74cdcd]">
      {showInsulinDateTime && (
        <View className="items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeInsulin}
                display={Platform.OS === "ios" ? "inline" : "default"}
                size="20"
              />
            </View>
          </View>
        </View>
      )}
      {showSensorDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeSensor}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      {showNeelDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeNeel}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      <View className="flex-row p-1">
        <View>
          <Link
            href={{
              pathname: "interval/[id]",
              params: {
                insulin:
                  intervalDataInsulin === null ? "" : intervalDataInsulin,
                needle: intervalDataNeedle === null ? "" : intervalDataNeedle,
                sensor: intervalDataSensor === null ? "" : intervalDataSensor,
                email: session === null ? "" : session,
              },
            }}
            asChild
          >
            <Pressable>
              {({ pressed }) => (
                <Ionicons name="settings-outline" size={30} color="white" />
              )}
            </Pressable>
          </Link>
        </View>
        <View className="grow items-center ">
          <Text className="text-2xl font-bold text-white">
            {userName === null ? "Singelvisa" : "Anv. " + userName}
          </Text>
        </View>
        <View className="flex-none mr-1">
          <TouchableOpacity onPress={() => fetchData()}>
            <Ionicons name="reload" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 3 }} className="bg-[#143642] rounded-xl">
        <View style={{ flex: 2 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 3 }} className="justify-center items-center">
              <TouchableOpacity
                onPress={() => onPressInsulin(moment.now())}
                style={{ width: 100, height: 100 }}
                className="items-center justify-center bg-[#0F8B8D]  p-4 rounded-xl"
              >
                <Entypo name="water" size={24} color="white" />
                <Text className="text-xl font-normal text-white">Insulin</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3 }} className="justify-center items-center">
              <TouchableOpacity
                onPress={() => showDatepicker(0)}
                className="items-center justify-center bg-[#20696a] p-4 rounded-xl"
              >
                <Text className="text-xl font-normal text-white">Justera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{ flex: 1 }}
          className="items-center justify-center bg-[#eda034]"
        >
          <Text
            className="text-xl font-bold"
            style={{
              color: isInsulinDataAfter ? "red" : "black",
            }}
          >
            {insulinData === null ? loadingMessage : insulinData}
          </Text>
        </View>
      </View>
      <View style={{ flex: 3 }} className="bg-[#143642] rounded-xl">
        <View style={{ flex: 2 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 3 }} className="justify-center items-center">
              <TouchableOpacity
                onPress={() => onPressNeedle(moment.now())}
                style={{ width: 100, height: 100 }}
                className="items-center justify-center bg-[#0F8B8D]   p-4 rounded-xl"
              >
                <MaterialCommunityIcons name="needle" size={40} color="white" />
                <Text className="text-xl font-normal text-white">Nål</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3 }} className="justify-center items-center">
              <TouchableOpacity
                onPress={() => showDatepicker(2)}
                className="items-center justify-center bg-[#20696a] p-4 rounded-xl"
              >
                <Text className="text-xl font-normal text-white">Justera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{ flex: 1 }}
          className="items-center justify-center bg-[#eda034]"
        >
          <Text
            className="text-xl font-bold text-white"
            style={{
              color: isNeedleDataAfter ? "red" : "black",
            }}
          >
            {needleData === null ? loadingMessage : needleData}
          </Text>
        </View>
      </View>
      <View style={{ flex: 3 }} className="bg-[#143642] rounded-xl">
        <View style={{ flex: 2 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 3 }} className="justify-center items-center">
              <TouchableOpacity
                onPress={() => onPressSensor(moment.now())}
                style={{ width: 100, height: 100 }}
                className="items-center justify-center bg-[#0F8B8D]  p-4 rounded-xl"
              >
                <Ionicons name="wifi" size={40} color="white" />
                <Text className="text-xl font-normal text-white">Sensor</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3 }} className="justify-center items-center">
              <TouchableOpacity
                onPress={() => showDatepicker(1)}
                className="items-center justify-center bg-[#20696a] p-4 rounded-xl"
              >
                <Text className="text-xl font-normal text-white">Justera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{ flex: 1 }}
          className="items-center justify-center bg-[#eda034]"
        >
          <Text
            className="text-xl font-bold"
            style={{
              color: isSensorDataAfter ? "red" : "black",
            }}
          >
            {sensorData === null ? loadingMessage : sensorData}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;
