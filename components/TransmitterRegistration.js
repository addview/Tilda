import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

const TransmitterRegistration = ({
  onPressTransmitter,
  showDatepicker,
  textTransmitterColor,
  transmitterData,
}) => {
  let fixdate = moment(transmitterData).format("dddd, Do MMMM, [kl.]HH:mm");
  return (
    <>
      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => onPressTransmitter(moment())}
              style={{ width: 100, height: 100 }}
              className="items-center justify-center bg-[#0F8B8D]  p-4 rounded-xl"
            >
              <MaterialCommunityIcons
                name="wifi-refresh"
                size={30}
                color="white"
              />
              <Text className="font-normal text-white" style={{ fontSize: 18 }}>
                Sändare
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => showDatepicker(6)}
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
            color: textTransmitterColor,
          }}
        >
          {transmitterData === null ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            fixdate
          )}
        </Text>
      </View>
    </>
  );
};

export default TransmitterRegistration;
