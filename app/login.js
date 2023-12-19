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
      console.log("dd", session);
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
    <SafeAreaView style={{ flex: 1 }} className="bg-[#20696a] justify-center ">
      <View className="justify-center items-center ">
        <View className="items-center">
          <Image
            style={{ height: 100, width: 100 }}
            className="flex"
            source={require("../assets/login.png")}
            contentFit="contain"
          />
          <Text className="text-4xl font-normal text-white">Singelvisa</Text>
        </View>

        <View className="flex flex-col w-full p-4 ">
          <KeyboardAvoidingView behavior="padding">
            <TextInput
              onChangeText={(text) => setEmail(text)}
              placeholder="Ange din email"
              className="h-10 p-2 rounded-lg font-semibold border-solid border-2  bg-[#74cdcd] text-white"
            />
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              placeholder="Ange ditt lösenord"
              className="mt-2 h-10 p-2 rounded-lg font-semibold border-solid border-2  bg-[#74cdcd] text-white"
            />

            {loading ? (
              <ActivityIndicator
                className="flex"
                size="large"
                color="#fff"
              ></ActivityIndicator>
            ) : (
              <View className="flex flex-row-reverse   mt-2">
                <TouchableOpacity
                  className="bg-[#eda034]   rounded-md py-1 px-2"
                  onPress={signIn}
                >
                  <View className="flex flex-row items-center justify-center ">
                    <Text className="text-xl  text-black font-normal">
                      Logga in
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[#eda034] mr-2 space-x-2 rounded-md py-1 px-2"
                  onPress={signUp}
                >
                  <View className="flex flex-row items-center justify-center">
                    <Text className="text-xl text-black font-normal">
                      Skapa konto
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default login;
