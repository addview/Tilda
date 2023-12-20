import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

const NeedleRegistration = ({
  onPressNeedle,
  showDatepicker,
  textNeedleColor,
  needleData,
}) => {
  return (
    <>
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
        style={{ padding: Platform.OS === "ios" ? 10 : 4 }}
        className="items-center justify-center bg-[#eda034]"
      >
        <Text
          className="text-xl font-bold"
          style={{
            color: textNeedleColor,
          }}
        >
          {needleData === null ? (
            <ActivityIndicator size="large" color="#20696a" />
          ) : (
            needleData
          )}
        </Text>
      </View>
    </>
  );
};

export default NeedleRegistration;
