import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/sv";

const styles = StyleSheet.create({
  marginTop: Platform.OS === "android" ? 35 : 1,
});

export default function App() {
  const [insulinData, setInsulinData] = useState("Ingen datum registrerad");
  const [needleData, setNeedleData] = useState("Ingen datum registrerad");
  const [sensorData, setSensorData] = useState("Ingen datum registrerad");

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

    setInsulinData("Ingen datum registrerad");
    setSensorData("Ingen datum registrerad");
    setNeedleData("Ingen datum registrerad");
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
    <SafeAreaView className="bg-fuchsia-200" style={{ flex: 1 }}>
      <View className="flex-1 justify-between" style={styles}>
        <View className="m-2 flex-1 items-center justify-center bg-[#313866] rounded-xl">
          <TouchableOpacity
            className="w-24 h-24  bg-[#FE7BE5] rounded-full items-center justify-center"
            onPress={() => onPressInsulin(moment.now())}
          >
            <Text className="text-white text-lg font-bold">Insulin</Text>
          </TouchableOpacity>
          <Text className="text-center text-white mt-2 font-bold text-xl pt-2">
            {insulinData}
          </Text>
        </View>

        <View className="m-2 flex-1 items-center justify-center  bg-[#504099] rounded-xl">
          <TouchableOpacity
            className="w-24 h-24 bg-[#FE7BE5] rounded-full items-center justify-center"
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
            className="w-24 h-24 bg-[#FE7BE5] rounded-full items-center justify-center"
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
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
