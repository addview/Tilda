import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../context/Ctx";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Pressable,
  ActivityIndicator,
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
import { store } from "../../store.js";
import { useLocalSearchParams } from "expo-router";
import InsulineDateTime from "../../components/InsulineDateTime.js";
import InsulinRegistration from "../../components/InsulinRegistration.js";
import NeedleRegistration from "../../components/NeedleRegistration.js";
import SensorRegistration from "../../components/SensorRegistration.js";

const db = FIREBASE_DB;

const index = () => {
  const { state, dispatch } = useContext(store);
  const ios = "20%";
  const android = "90%";
  const iosH = 215;
  const androidH = 185;

  const { session, signOut, isLoading } = useSession();
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
  const [textInsulinColor, setTextInsulinColor] = useState("black");
  const [textNeedleColor, setTextNeedleColor] = useState("black");
  const [textSensorColor, setTextSensorColor] = useState("black");

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
    if (uniqueDokumentId !== null) {
      fetchData(); // Därefter körs denna
      getUserIntervall(session); // Och sist denna
    }
  }, [uniqueDokumentId]);

  useEffect(() => {
    console.log("ss", state.changeinterval);
    if (state.changeinterval) {
      fetchData();
      getUserIntervall(session); // Och sist denna
    }
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

    console.log(latestDoc.data().insulin);
    console.log(latestDoc.data().needle);
    console.log(latestDoc.data().sensor);

    setIntervalDataInsulin(latestDoc.data().insulin);
    setIntervalDataNeedle(latestDoc.data().needle);
    setIntervalDataSensor(latestDoc.data().sensor);
    setUserName(latestDoc.data().Namn);
    dispatch({ type: "CHANGE_INSULIN", payload: latestDoc.data().insulin });
    dispatch({ type: "CHANGE_NEEDLE", payload: latestDoc.data().needle });
    dispatch({ type: "CHANGE_SENSOR", payload: latestDoc.data().sensor });
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
      setTextInsulinColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
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
      setTextSensorColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
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
      setTextNeedleColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
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
        const needleDateFix =
          needleDataResponse.dateChanged + " " + needleDataResponse.timeChanged;
        const needleRes = moment(needleDateFix).format("dddd, Do MMMM , HH:mm");
        setNeedleData(needleRes);
        setTextNeedleColor(isDataAfter(needleRes) ? "red" : "black");
      }

      if (sensorDataResponse) {
        const sensorDateFix =
          sensorDataResponse.dateChanged + " " + sensorDataResponse.timeChanged;
        const sensorRes = moment(sensorDateFix).format("dddd, Do MMMM , HH:mm");
        setSensorData(sensorRes);
        setTextSensorColor(isDataAfter(sensorRes) ? "red" : "black");
      }

      if (insulinDataResponse) {
        const insulinDateFix =
          insulinDataResponse.dateChanged +
          " " +
          insulinDataResponse.timeChanged;
        const isulinRes = moment(insulinDateFix).format(
          "dddd, Do MMMM , HH:mm"
        );
        setInsulinData(isulinRes);
        setTextInsulinColor(isDataAfter(isulinRes) ? "red" : "black");
      }
    } catch (error) {
      alert("Fel vid hämtning av data.");
    }
  };

  const onPressInsulin = (date) => {
    const _insulindate = addRegDays(date, intervalDataInsulin);
    setTextInsulinColor(isDataAfter(_insulindate) ? "red" : "black");
    setShowInsulinDateTime(false);
    setInsulinData(_insulindate);
    saveInsulinData(_insulindate);
  };
  const onPressNeedle = (date) => {
    const _needledate = addRegDays(date, intervalDataNeedle);
    setTextNeedleColor(isDataAfter(_needledate) ? "red" : "black");
    setShowNeelDateTime(false);
    setNeedleData(_needledate);
    saveNeedleData(_needledate);
  };
  const onPressSensor = (date) => {
    const _sensordate = addRegDays(date, intervalDataSensor);
    setTextSensorColor(isDataAfter(_sensordate) ? "red" : "black");
    setShowSensorDateTime(false);
    setSensorData(_sensordate);
    saveSensorData(_sensordate);
  };

  return (
    <SafeAreaView className="flex-1 flex-col gap-2 p-2 bg-[#74cdcd]">
      <InsulineDateTime
        showInsulinDateTime={showInsulinDateTime}
        showSensorDateTime={showSensorDateTime}
        showNeelDateTime={showNeelDateTime}
        onChangeInsulin={onChangeInsulin}
        onChangeSensor={onChangeSensor}
        onChangeNeel={onChangeNeel}
        date={date}
        mode={mode}
      />
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
        <InsulinRegistration
          onPressInsulin={onPressInsulin}
          showDatepicker={showDatepicker}
          textInsulinColor={textInsulinColor}
          insulinData={insulinData}
        />
      </View>
      <View style={{ flex: 3 }} className="bg-[#143642] rounded-xl">
        <NeedleRegistration
          onPressNeedle={onPressNeedle}
          showDatepicker={showDatepicker}
          textNeedleColor={textNeedleColor}
          needleData={needleData}
        />
      </View>
      <View style={{ flex: 3 }} className="bg-[#143642] rounded-xl">
        <SensorRegistration
          onPressSensor={onPressSensor}
          showDatepicker={showDatepicker}
          textSensorColor={textSensorColor}
          sensorData={sensorData}
        />
      </View>
    </SafeAreaView>
  );
};

export default index;
