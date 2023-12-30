import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

const SparePenLongTermRegistration = ({
  onPressSparePenLongTerm,
  showDatepicker,
  textSparepenLongTermColor,
  sparepenLongTermData,
}) => {
  return (
    <>
      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => onPressSparePenLongTerm(moment())}
              style={{ width: 100, height: 100 }}
              className="items-center justify-center bg-[#0F8B8D]  p-4 rounded-xl"
            >
              <MaterialIcons name="last-page" size={30} color="white" />
              <Text className="text-xl font-normal text-white">Långtid</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => showDatepicker(4)}
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
            color: textSparepenLongTermColor,
          }}
        >
          {sparepenLongTermData === null ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            sparepenLongTermData
          )}
        </Text>
      </View>
    </>
  );
};

export default SparePenLongTermRegistration;
