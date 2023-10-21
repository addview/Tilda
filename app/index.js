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

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChangeInsulin = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const onChangeSensor = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const onChangeNeel = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  moment.locale("sv");

  const addThreeDays = () => {
    return moment().add(3, "days").format("dddd, Do MMMM , HH:mm");
  };

  const addTenDays = () => {
    return moment().add(10, "days").format("dddd, Do MMMM , HH:mm");
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
    setInsulinData(_insulindate);
    saveInsulinData(_insulindate);
  };
  const onPressNeedle = () => {
    const _needledate = addThreeDays();
    setNeedleData(_needledate);
    saveNeedleData(_needledate);
  };
  const onPressSensor = () => {
    const _sensordate = addTenDays();
    setSensorData(_sensordate);
    saveSensorData(_sensordate);
  };

  return (
    <SafeAreaView className="bg-fuchsia-200  flex-1 pt-2 pr-2 pl-2">
      <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChangeInsulin}
          />
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
                className="bg-fuchsia-300 rounded-full h-20 w-20  items-center justify-center"
                onPress={() => showDatepicker()}
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

        <View className="m-2 flex-1 items-center justify-center  bg-[#504099] rounded-xl">
          <TouchableOpacity
            className=" bg-[#FE7BE5] rounded-full h-20 w-20  items-center justify-center"
            onPress={() => onPressSensor(moment.now())}
          >
            <Text className="text-white text-lg font-bold">Sensor</Text>
          </TouchableOpacity>
          <Text className="text-center text-white mt-2 font-bold text-xl pt-2">
            {sensorData}
          </Text>
        </View>

        <View className="m-2 flex-1 items-center justify-center bg-[#974EC3] rounded-xl">
          <TouchableOpacity
            className="w-20 h-20 bg-[#FE7BE5] rounded-full items-center justify-center"
            onPress={() => onPressNeedle(moment.now())}
          >
            <Text className="text-white text-lg font-bold">Nål</Text>
          </TouchableOpacity>
          <Text className="text-center text-white mt-2 font-bold text-xl pt-2">
            {needleData}
          </Text>
        </View>

        <View className="m-2 p-2  items-center justify-center ">
          <TouchableOpacity
            className="w-16 h-16 bg-[#FE7BE5] rounded-full items-center justify-center"
            onPress={() => removeFew()}
          >
            <Text className="text-white text-sm font-bold">Rensa</Text>
          </TouchableOpacity>
          <Link href="/home">About</Link>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
