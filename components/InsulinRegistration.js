import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";
const InsulinRegistration = ({
  onPressInsulin,
  showDatepicker,
  textInsulinColor,
  insulinData,
}) => {
  return (
    <>
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
            color: textInsulinColor,
          }}
        >
          {insulinData === null ? (
            <ActivityIndicator size="large" color="#20696a" />
          ) : (
            insulinData
          )}
        </Text>
      </View>
    </>
  );
};

export default InsulinRegistration;