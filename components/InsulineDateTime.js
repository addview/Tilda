import { View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const ShowInsulineDateTime = ({
  showInsulinDateTime,
  showSensorDateTime,
  showNeelDateTime,
  showGlucaGenDateTime,
  showSparepenLongTermDateTime,
  showSparepenMealDateTime,
  showTransmitterDateTime,
  onChangeInsulin,
  onChangeSensor,
  onChangeNeel,
  onChangeGlucagen,
  onChangeSparePenLongTerm,
  onChangeSparepenMeal,
  onChangeTransmitter,
  date,
  mode,
}) => {
  return (
    <>
      {showInsulinDateTime && (
        <View className="items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeInsulin}
                display={Platform.OS === "ios" ? "inline" : "default"}
                size="20"
              />
            </View>
          </View>
        </View>
      )}
      {showSensorDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeSensor}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      {showNeelDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeNeel}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      {showGlucaGenDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeGlucagen}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      {showSparepenLongTermDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeSparePenLongTerm}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      {showSparepenMealDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeSparepenMeal}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
      {showTransmitterDateTime && (
        <View className="m-2 items-center justify-center bg-[#3d9a9c] rounded-xl">
          <View>
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChangeTransmitter}
                display={Platform.OS === "ios" ? "inline" : "default"}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default ShowInsulineDateTime;
