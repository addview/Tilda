import { useEffect, useState } from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import moment from "moment";
import "moment/locale/sv";
import DateTimePicker from "@react-native-community/datetimepicker";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBopr6LO-8qhIfm2oUeTxcgKo_B33LnNUg",
  authDomain: "singelvisa.firebaseapp.com",
  projectId: "singelvisa",
  storageBucket: "singelvisa.appspot.com",
  messagingSenderId: "947224097736",
  appId: "1:947224097736:web:728d0d28323a859319c6fd",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default function index() {
  const tyraUserID = "tuxs3L8OjXlMk1kimdWI";
  const loadingMessage = "..hämtar data";
  const [insulinData, setInsulinData] = useState(loadingMessage);
  const [needleData, setNeedleData] = useState(loadingMessage);
  const [sensorData, setSensorData] = useState(loadingMessage);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showInsulinDateTime, setShowInsulinDateTime] = useState(false);
  const [showSensorDateTime, setShowSensorDateTime] = useState(false);
  const [showNeelDateTime, setShowNeelDateTime] = useState(false);

  const listLatestChange = async (userid, changeType) => {
    const q = query(
      collection(db, "changes"),
      where("changeType", "==", changeType),
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
    const _insulinDate = addThreeDays(selectedDate);

    let dateTimeStr = _insulinDate;
    let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
    setInsulinData(updatedDateTimeStr);
    saveInsulinData(updatedDateTimeStr);
  };

  const onChangeSensor = (event, selectedDate) => {
    setShowSensorDateTime(false);
    const _sensorDate = addTenDays(selectedDate);

    let dateTimeStr = _sensorDate;
    let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
    setSensorData(updatedDateTimeStr);
    saveSensorData(updatedDateTimeStr);
  };

  const onChangeNeel = (event, selectedDate) => {
    setShowNeelDateTime(false);
    const _neelDate = addThreeDays(selectedDate);

    let dateTimeStr = _neelDate;
    let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
    setNeedleData(updatedDateTimeStr);
    saveNeedleData(updatedDateTimeStr);
  };

  const showMode = (currentMode, index) => {
    console.log("index", index);
    if (index === 0) {
      setShowInsulinDateTime(true);
    }
    if (index === 1) {
      setShowSensorDateTime(true);
    }
    if (index === 2) {
      setShowNeelDateTime(true);
    }

    setMode(currentMode);
  };

  const showDatepicker = (index) => {
    showMode("date", index);
  };

  moment.locale("sv");

  const addThreeDays = (date) => {
    return moment(date).add(3, "days").format("dddd, Do MMMM , HH:mm");
  };

  const addTenDays = (date) => {
    return moment(date).add(10, "days").format("dddd, Do MMMM , HH:mm");
  };

  const saveInsulinData = async (insulinDatum) => {
    addChanges(tyraUserID, "Insulin", insulinDatum);
  };

  const saveNeedleData = async (needleDatum) => {
    addChanges(tyraUserID, "Needle", needleDatum);
  };

  const saveSensorData = async (sensorDatum) => {
    addChanges(tyraUserID, "Sensor", sensorDatum);
  };

  const fetchData = async () => {
    try {
      listLatestChange(tyraUserID, "Needle").then((data) => {
        let dateFix = data.dateChanged + " " + data.timeChanged;
        setNeedleData(moment(dateFix).format("dddd, Do MMMM , HH:mm"));
      });

      listLatestChange(tyraUserID, "Sensor").then((data) => {
        let dateFix = data.dateChanged + " " + data.timeChanged;
        setSensorData(moment(dateFix).format("dddd, Do MMMM , HH:mm"));
      });

      listLatestChange(tyraUserID, "Insulin").then((data) => {
        let dateFix = data.dateChanged + " " + data.timeChanged;
        setInsulinData(moment(dateFix).format("dddd, Do MMMM , HH:mm"));
      });
    } catch (error) {
      alert("Fel vid hämtning av data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onPressInsulin = (date) => {
    const _insulindate = addThreeDays(date);
    setShowInsulinDateTime(false);
    setInsulinData(_insulindate);
    saveInsulinData(_insulindate);
  };
  const onPressNeedle = (date) => {
    const _needledate = addThreeDays(date);
    setShowNeelDateTime(false);
    setNeedleData(_needledate);
    saveNeedleData(_needledate);
  };
  const onPressSensor = (date) => {
    const _sensordate = addTenDays(date);
    setShowSensorDateTime(false);
    setSensorData(_sensordate);
    saveSensorData(_sensordate);
  };

  return (
    <SafeAreaView className="bg-fuchsia-200  flex-1 pt-2 pr-2 pl-2">
      <View className="flex">
        {showInsulinDateTime && (
          <View className="m-2 items-center justify-center bg-[#d9a3ff] rounded-xl">
            <View>
              <View>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeInsulin}
                  display="default"
                />
              </View>
            </View>
          </View>
        )}
        {showSensorDateTime && (
          <View className="m-2 items-center justify-center bg-[#d9a3ff] rounded-xl">
            <View>
              <View>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeSensor}
                  display="default"
                />
              </View>
            </View>
          </View>
        )}
        {showNeelDateTime && (
          <View className="m-2 items-center justify-center bg-[#d9a3ff] rounded-xl">
            <View>
              <View>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeNeel}
                  display="default"
                />
              </View>
            </View>
          </View>
        )}
      </View>
      <View className="flex-1 justify-between">
        <View className="m-2 flex-1 items-center justify-center bg-[#313866] rounded-xl">
          <View className="mt-4 flex flex-row justify-evenly w-full">
            <View>
              <TouchableOpacity
                className=" bg-[#FE7BE5] rounded-full h-20 w-20  items-center justify-center"
                onPress={() => onPressInsulin(moment.now())}
              >
                <Text className="text-white text-lg font-bold">Insulin</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className="bg-[#6473d0] rounded-full h-20 w-20  items-center justify-center"
                onPress={() => showDatepicker(0)}
              >
                <Text className="text-white text-lg font-bold">Justera</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="m-2">
            <Text className="text-center text-white mt-2 font-bold text-xl pt-2">
              {insulinData}
            </Text>
          </View>
        </View>

        <View className="m-2 flex-1 items-center justify-center bg-[#974EC3] rounded-xl">
          <View className="mt-4 flex flex-row justify-evenly w-full">
            <View>
              <TouchableOpacity
                className=" bg-[#FE7BE5] rounded-full h-20 w-20  items-center justify-center"
                onPress={() => onPressNeedle(moment.now())}
              >
                <Text className="text-white text-lg font-bold">Nål</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className="bg-[#b961ef] rounded-full h-20 w-20  items-center justify-center"
                onPress={() => showDatepicker(2)}
              >
                <Text className="text-white text-lg font-bold">Justera</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="m-2">
            <Text className="text-center text-white mt-2 font-bold text-xl pt-2">
              {needleData}
            </Text>
          </View>
        </View>

        <View className="m-2 flex-1 items-center justify-center  bg-[#504099] rounded-xl">
          <View className="mt-4 flex flex-row justify-evenly w-full">
            <View>
              <TouchableOpacity
                className=" bg-[#FE7BE5] rounded-full h-20 w-20  items-center justify-center"
                onPress={() => onPressSensor(moment.now())}
              >
                <Text className="text-white text-lg font-bold">Sensor</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className=" bg-[#7d67e0] rounded-full h-20 w-20  items-center justify-center"
                onPress={() => showDatepicker(1)}
              >
                <Text className="text-white text-lg font-bold">Justera</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="m-2">
            <Text className="text-center text-white mt-2 font-bold text-xl pt-2">
              {sensorData}
            </Text>
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
