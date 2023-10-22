import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/sv";
import { Link } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function index() {
  const [insulinData, setInsulinData] = useState("Inget datum registrerat");
  const [needleData, setNeedleData] = useState("Inget datum registrerat");
  const [sensorData, setSensorData] = useState("Inget datum registrerat");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showInsulinDateTime, setShowInsulinDateTime] = useState(false);

  //const [date, setDate] = useState(new Date(1598051730000));
  const [showSensorDateTime, setShowSensorDateTime] = useState(false);

  //const [date, setDate] = useState(new Date(1598051730000));
  const [showNeelDateTime, setShowNeelDateTime] = useState(false);

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
  };

  const onChangeSensor = (event, selectedDate) => {
    setShowSensorDateTime(false);
    const _sensorDate = addTenDays(selectedDate);

    let dateTimeStr = _sensorDate;
    let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);

    setSensorData(updatedDateTimeStr);
  };

  const onChangeNeel = (event, selectedDate) => {
    setShowNeelDateTime(false);
    const _neelDate = addThreeDays(selectedDate);

    let dateTimeStr = _neelDate;
    let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);

    setNeedleData(updatedDateTimeStr);
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

    //setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = (index) => {
    showMode("date", index);
  };

  moment.locale("sv");

  const addThreeDays = (date) => {
    //if (date != null) {
    const newDate = moment(date).add(3, "days").format("dddd, Do MMMM , HH:mm");
    return moment(date).add(3, "days").format("dddd, Do MMMM , HH:mm");
    //}
    //return moment().add(3, "days").format("dddd, Do MMMM , HH:mm");
  };

  const addTenDays = (date) => {
    return moment(date).add(10, "days").format("dddd, Do MMMM , HH:mm");
  };

  const saveInsulinData = async (insulinDatum) => {
    try {
      await AsyncStorage.setItem("insulin", insulinDatum);
    } catch (error) {
      alert(error);
      alert("Fel vid sparande av data.");
    }
  };

  const saveNeedleData = async (needleDatum) => {
    try {
      await AsyncStorage.setItem("needle", needleDatum);
    } catch (error) {
      alert("Fel vid sparande av data.");
    }
  };

  const saveSensorData = async (sensorDatum) => {
    try {
      await AsyncStorage.setItem("sensor", sensorDatum);
    } catch (error) {
      alert("Fel vid sparande av data.");
    }
  };

  removeFew = async () => {
    const keys = ["insulin", "needle", "sensor"];
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      // remove error
    }

    setInsulinData("Inget datum registrerat");
    setSensorData("Inget datum registrerat");
    setNeedleData("Inget datum registrerat");
  };

  const fetchInsulinData = async () => {
    try {
      const value1 = await AsyncStorage.getItem("insulin");
      const value2 = await AsyncStorage.getItem("needle");
      const value3 = await AsyncStorage.getItem("sensor");

      if (value1 != null) {
        setInsulinData(value1);
      }
      if (value2 != null) {
        setNeedleData(value2);
      }
      if (value3 != null) {
        setSensorData(value3);
      }
    } catch (error) {
      alert("Fel vid hämtning av data.");
    }
  };

  useEffect(() => {
    fetchInsulinData();
  }, []);

  const onPressInsulin = () => {
    const _insulindate = addThreeDays();
    console.log(_insulindate);
    setShowInsulinDateTime(false);
    setInsulinData(_insulindate);
    saveInsulinData(_insulindate);
  };
  const onPressNeedle = () => {
    const _needledate = addThreeDays();
    setShowNeelDateTime(false);
    setNeedleData(_needledate);
    saveNeedleData(_needledate);
  };
  const onPressSensor = () => {
    const _sensordate = addTenDays();
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

        <View className="m-2 p-2  items-center justify-center ">
          <TouchableOpacity
            className="w-16 h-16 bg-[#c32da7] rounded-full items-center justify-center"
            onPress={() => removeFew()}
          >
            <Text className="text-white text-sm font-bold">Rensa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
