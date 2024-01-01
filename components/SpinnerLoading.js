import { ActivityIndicator, View, Text } from "react-native";

const SpinnerLoading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-[#eda034]">
      <ActivityIndicator size="large" color="#3b8eea" />
      <Text className="text-xl text-[#20696a]">Hämtar data..</Text>
    </View>
  );
};

export default SpinnerLoading;
