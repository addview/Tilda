import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useSession } from "../context/Ctx";
import { router } from "expo-router";

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
    <View className="flex-1 justify-center items-center  bg-[#74cdcd]">
      <View className="w-full p-4">
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            onChangeText={(text) => setEmail(text)}
            placeholder="ange din email"
            className="h-10 p-2 rounded-lg border-solid border-2 bg-[#ffffff]"
          />
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            placeholder="ange ditt lösenord"
            className="mt-2 h-10 p-2 rounded-lg border-solid border-2 bg-[#ffffff]"
          />
        </KeyboardAvoidingView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            <Button title="Create account" onPress={signUp} />
          </>
        )}
      </View>
    </View>
  );
};

export default login;
