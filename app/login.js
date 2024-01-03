import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useSession } from "../context/Ctx";
import { router } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signingIn, session, isLoading } = useSession();

  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const dd = await signingIn(response.user.email);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("Check your email");
    } catch (error) {
      console.log(error);
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  return (
    <SafeAreaView className="bg-[#74cdcd] flex-1 ">
      <View className="mt-16 items-center">
        <View className="items-center">
          <Text className="text-4xl font-normal text-white">Astemelia</Text>
          <Image
            style={{ height: 50, width: 100 }}
            className="flex"
            source={require("../assets/knut.png")}
            contentFit="contain"
          />
        </View>

        <View className="flex flex-col w-full p-6 mt-4 ">
          <KeyboardAvoidingView behavior="padding">
            <View className="pl-2 pr-2 gap-y-4">
              <TextInput
                onChangeText={(text) => setEmail(text)}
                placeholder="Ange din email"
                className="h-10 p-2 rounded-md font-semibold    bg-[#5db9b9] text-white"
              />
              <TextInput
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                placeholder="Ange ditt lösenord"
                className="mt-2 h-10 p-2 rounded-md font-semibold   bg-[#5db9b9] text-white"
              />
            </View>

            <View className="flex p-2 mt-4 ">
              <TouchableOpacity
                className="bg-[#eda034]   rounded-md py-1 px-2"
                onPress={signIn}
              >
                <View className="flex flex-row items-center justify-center p-1">
                  {loading ? (
                    <ActivityIndicator
                      className="flex"
                      size="large"
                      color="#fff"
                    ></ActivityIndicator>
                  ) : (
                    <Text className="text-lg  text-white font-normal">
                      Logga in
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className=" mr-2 space-x-2 rounded-md py-1 px-2"
                onPress={signUp}
              >
                <View className="flex flex-row items-center justify-center pt-2">
                  <Text className="text-md text-white font-normal underline">
                    Skapa konto
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default login;
