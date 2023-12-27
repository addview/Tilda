import { ActivityIndicator, View, Text } from "react-native";

const SpinnerLoading = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="small" color="#3b8eea" />
      <Text className="text-xl">Hämtar data..</Text>
    </View>
  );
};

export default SpinnerLoading;
