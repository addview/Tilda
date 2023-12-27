import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
const SparePenMealRegistration = ({
  onPressSparePenMeal,
  showDatepicker,
  textSparepenMealColor,
  sparepenMealData,
}) => {
  return (
    <>
      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => onPressSparePenMeal(moment())}
              style={{ width: 100, height: 100 }}
              className="items-center justify-center bg-[#0F8B8D]  p-4 rounded-xl"
            >
              <MaterialCommunityIcons
                name="food-variant"
                size={24}
                color="white"
              />
              <Text className="text-xl font-normal text-white">
                Måltidsinsulin
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 3 }} className="justify-center items-center">
            <TouchableOpacity
              onPress={() => showDatepicker(5)}
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
            color: textSparepenMealColor,
          }}
        >
          {sparepenMealData === null ? (
            <ActivityIndicator size="large" color="#20696a" />
          ) : (
            sparepenMealData
          )}
        </Text>
      </View>
    </>
  );
};

export default SparePenMealRegistration;
