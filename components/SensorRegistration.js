import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const SensorRegistration = ({
  onPressSensor,
  showDatepicker,
  textSensorColor,
  sensorData,
}) => {
  return (
    <>
      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => onPressSensor(moment())}
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
        style={{ padding: Platform.OS === "ios" ? 10 : 4 }}
        className="items-center justify-center bg-[#eda034]"
      >
        <Text
          className="text-xl font-bold"
          style={{
            color: textSensorColor,
          }}
        >
          {sensorData === null ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            sensorData
          )}
        </Text>
      </View>
    </>
  );
};

export default SensorRegistration;
