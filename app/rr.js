import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

const rr = () => {
  const ios = 115;
  const android = 100;
  const iosH = 215;
  const androidH = 185;

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

  useEffect(() => {
    fetchData();
    getUserIntervall("tyra@slowmotion.se");
  }, []);

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

  const getUserIntervall = async (email) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", email),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", email);
      return null;
    }
    const latestDoc = querySnapshot.docs[0];
    setIntervalDataInsulin(latestDoc.data().insulin);
    setIntervalDataNeedle(latestDoc.data().needle);
    setIntervalDataSensor(latestDoc.data().sensor);

    return latestDoc.data();
  };

  const listLatestChange = async (userid, changeType) => {
    const q = query(
      collection(db, "changes"),
      where("changeType", "==", changeType),
      where("userId", "==", tyraUserID),
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

  const addRegDays = (date, days) => {
    return moment(date).add(days, "days").format("dddd, Do MMMM , HH:mm");
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
    try {
      const [needleDataResponse, sensorDataResponse, insulinDataResponse] =
        await Promise.all([
          listLatestChange(tyraUserID, "Needle"),
          listLatestChange(tyraUserID, "Sensor"),
          listLatestChange(tyraUserID, "Insulin"),
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
    <SafeAreaView className="flex-1 pt-6 bg-[#C8BCC6] ">
      {showInsulinDateTime && (
        <View className="m-2 items-center justify-center bg-[#EC9A29] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeInsulin}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                size="20"
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
                display={Platform.OS === "ios" ? "spinner" : "default"}
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
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      <View className="p-2">
        <View className="flex-row mb-3 h-8 justify-center">
          <Text className="font-extrabold text-2xl text-[#143642]">
            Tidsstämpling
          </Text>
        </View>
        <View className="flex-1 flex-col gap-2">
          <View
            style={{
              height: Platform.OS === "ios" ? iosH : androidH,
            }}
            className="bg-[#143642]  rounded-lg "
          >
            <View className="flex-1 flex-col gap-4 items-center justify-center">
              <View>
                <View className="flex-row gap-16">
                  <View>
                    <TouchableOpacity
                      onPress={() => onPressInsulin(moment.now())}
                      style={{
                        height: Platform.OS === "ios" ? ios : android,
                        width: Platform.OS === "ios" ? ios : android,
                      }}
                      className=" bg-[#0F8B8D] rounded-full   items-center justify-center"
                    >
                      <Text className="text-white text-2xl font-bold">
                        Insulin
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => showDatepicker(0)}
                      style={{
                        height: Platform.OS === "ios" ? ios : android,
                        width: Platform.OS === "ios" ? ios : android,
                      }}
                      className=" bg-[#0F8B8D] rounded-full   items-center justify-center"
                    >
                      <Text className="text-white text-2xl font-bold">
                        Justera
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                <Text
                  className="text-xl font-bold"
                  style={{
                    color: isInsulinDataAfter ? "red" : "white",
                  }}
                >
                  {insulinData === null ? loadingMessage : insulinData}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: Platform.OS === "ios" ? iosH : androidH,
            }}
            className="bg-[#143642]  rounded-lg"
          >
            <View className="flex-1 flex-col gap-4 items-center justify-center">
              <View>
                <View className="flex-row gap-16">
                  <View>
                    <TouchableOpacity
                      onPress={() => onPressNeedle(moment.now())}
                      style={{
                        height: Platform.OS === "ios" ? ios : android,
                        width: Platform.OS === "ios" ? ios : android,
                      }}
                      className=" bg-[#0F8B8D] rounded-full  items-center justify-center"
                    >
                      <Text className="text-white text-2xl font-bold">Nål</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => showDatepicker(2)}
                      style={{
                        height: Platform.OS === "ios" ? ios : android,
                        width: Platform.OS === "ios" ? ios : android,
                      }}
                      className=" bg-[#0F8B8D] rounded-full   items-center justify-center"
                    >
                      <Text className="text-white text-2xl font-bold">
                        Justera
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                <Text
                  className="text-xl font-bold text-white"
                  style={{
                    color: isNeedleDataAfter ? "red" : "white",
                  }}
                >
                  {needleData === null ? loadingMessage : needleData}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: Platform.OS === "ios" ? iosH : androidH,
            }}
            className="bg-[#143642]  rounded-lg "
          >
            <View className="flex-1 flex-col gap-4 items-center justify-center">
              <View>
                <View className="flex-row gap-16">
                  <View>
                    <TouchableOpacity
                      onPress={() => onPressSensor(moment.now())}
                      style={{
                        height: Platform.OS === "ios" ? ios : android,
                        width: Platform.OS === "ios" ? ios : android,
                      }}
                      className=" bg-[#0F8B8D] rounded-full  items-center justify-center"
                    >
                      <Text className="text-white text-2xl font-bold">
                        Sensor
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => showDatepicker(1)}
                      style={{
                        height: Platform.OS === "ios" ? ios : android,
                        width: Platform.OS === "ios" ? ios : android,
                      }}
                      className=" bg-[#0F8B8D] rounded-full   items-center justify-center"
                    >
                      <Text className="text-white text-2xl font-bold">
                        Justera
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                <Text
                  className="text-xl font-bold"
                  style={{
                    color: isSensorDataAfter ? "red" : "white",
                  }}
                >
                  {sensorData === null ? loadingMessage : sensorData}
                </Text>
              </View>
            </View>
          </View>
          <View className="m-2 p-2  items-center justify-center ">
            <TouchableOpacity
              className="w-16 h-16 bg-[#EC9A29] rounded-full items-center justify-center"
              onPress={() => fetchData()}
            >
              <Ionicons name="reload" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default rr;
