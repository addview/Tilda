import { View, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { store } from "../store";
import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Intervall = ({ setIntervalData, intervalData, type, name }) => {
  const { state, dispatch } = useContext(store);
  return (
    <View className="flex-row bg-[#20696a] w-full h-14 rounded-lg">
      <View className="flex-1 w-1/2 justify-center grow ">
        <View className="flex-row ml-4  items-center ">
          <Text className="text-2xl p-1 text-white">{name}</Text>
        </View>
      </View>
      <View className="flex-row gap-3  justify-center items-center mr-4 ">
        <View className="">
          <TouchableOpacity
            onPress={() => {
              setIntervalData(intervalData + 1);
              dispatch({
                type: type,
                payload: intervalData + 1,
              });
            }}
          >
            <AntDesign name="pluscircleo" size={34} color="white" />
          </TouchableOpacity>
        </View>
        <View className="">
          <Text className="text-xl text-white">{intervalData}</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              if (intervalData > 1) {
                setIntervalData(intervalData - 1);
              }
            }}
          >
            <AntDesign name="minuscircleo" size={34} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Intervall;
