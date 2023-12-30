import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../context/Ctx";
import { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/sv";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { Link } from "expo-router";
import { FIREBASE_DB } from "../../firebaseConfig";
import { store } from "../../store.js";
import InsulineDateTime from "../../components/InsulineDateTime.js";
import InsulinRegistration from "../../components/InsulinRegistration.js";
import NeedleRegistration from "../../components/NeedleRegistration.js";
import SensorRegistration from "../../components/SensorRegistration.js";

import SparePenMealRegistration from "../../components/SparePenMealRegistration.js";
import SparePenLongTermRegistration from "../../components/SparePenLongTermRegistration.js";
import GlucagenRegistration from "../../components/GlucagenRegistration.js";
import TransmitterRegistration from "../../components/TransmitterRegistration.js";

const db = FIREBASE_DB;

const index = () => {
  const { state, dispatch } = useContext(store);
  const { session, signOut, isLoading } = useSession();

  const [insulinData, setInsulinData] = useState(null);
  const [needleData, setNeedleData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [transmitterData, setTransmitterData] = useState(null);
  const [glucagenData, setGlucagenData] = useState(null);
  const [sparepenLongTermData, setSparepenLongTermData] = useState(null);
  const [sparepenMealData, setSparepenMealData] = useState(null);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");

  const [showInsulinDateTime, setShowInsulinDateTime] = useState(false);
  const [showSensorDateTime, setShowSensorDateTime] = useState(false);
  const [showNeelDateTime, setShowNeelDateTime] = useState(false);
  const [showTransmitterDateTime, setShowTransmitterDateTime] = useState(false);
  const [showGlucaGenDateTime, setShowGlucaGenDateTime] = useState(false);
  const [showSparepenLongTermDateTime, setShowSparepenLongTermDateTime] =
    useState(false);
  const [showSparepenMealDateTime, setShowSparepenMealDateTime] =
    useState(false);

  const [intervalDataInsulin, setIntervalDataInsulin] = useState(null);
  const [intervalDataNeedle, setIntervalDataNeedle] = useState(null);
  const [intervalDataSensor, setIntervalDataSensor] = useState(null);
  const [intervalDataTransmitter, setIntervalDataTransmitter] = useState(null);
  const [intervalDataSparepenLongTerm, setIntervalDataSparepenLongTerm] =
    useState(null);
  const [intervalDataSparepenMeal, setIntervalDataSparepenMeal] =
    useState(null);
  const [intervalDataGlucaGen, setIntervalDataGlucaGen] = useState(null);

  const [isNeedleDataAfter, setIsNeedleDataAfter] = useState(false);
  const [isInsulinDataAfter, setIsInsulinDataAfter] = useState(false);
  const [isSensorDataAfter, setIsSensorDataAfter] = useState(false);
  const [uniqueDokumentId, setUniqueDokumentId] = useState(null);
  const [userName, setUserName] = useState(null);

  const [textInsulinColor, setTextInsulinColor] = useState("#eda034");
  const [textNeedleColor, setTextNeedleColor] = useState("#eda034");
  const [textSensorColor, setTextSensorColor] = useState("#eda034");
  const [textTransmitterColor, setTextTransmitterColor] = useState("#eda034");
  const [textSparepenLongTermColor, setTextSparepenLongTermColor] =
    useState("#eda034");
  const [textSparepenMealColor, setTextSparepenMealColor] = useState("#eda034");
  const [textGlucaGenColor, setTextGlucaGenColor] = useState("#eda034");

  useEffect(() => {
    const executeAsyncFunctions = async () => {
      try {
        await getUserByEmail(session); // Väntar på att denna funktion ska slutföras
      } catch (error) {
        console.error(
          "Ett fel uppstod under körning av asynkrona funktioner",
          error
        );
      }
    };

    executeAsyncFunctions();
  }, [session]);

  useEffect(() => {
    if (needleData) {
      setIsNeedleDataAfter(isDataAfter(needleData));
    }
    if (insulinData) {
      setIsInsulinDataAfter(isDataAfter(insulinData));
    }
    if (sensorData) {
      setIsSensorDataAfter(isDataAfter(sensorData));
    }
    if (glucagenData) {
      setIsSensorDataAfter(isDataAfter(glucagenData));
    }
    if (sparepenLongTermData) {
      setIsSensorDataAfter(isDataAfter(sparepenLongTermData));
    }
    if (sparepenMealData) {
      setIsSensorDataAfter(isDataAfter(sparepenMealData));
    }
    if (transmitterData) {
      setIsSensorDataAfter(isDataAfter(transmitterData));
    }
  }, [
    needleData,
    insulinData,
    sensorData,
    glucagenData,
    sparepenLongTermData,
    sparepenMealData,
    transmitterData,
  ]);

  // En separat useEffect för att logga state när den ändras
  useEffect(() => {
    if (uniqueDokumentId !== null) {
      fetchData(); // Därefter körs denna
      getUserIntervall(session); // Och sist denna
    }
  }, [uniqueDokumentId]);

  useEffect(() => {
    if (state.changeinterval) {
      fetchData();
      getUserIntervall(session); // Och sist denna
    }
  }, []);

  const getUserByEmail = async (session) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", session),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", session);
      alert("Inga poster hittades för " + session);
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    setUniqueDokumentId(userDoc.id);
    return userDoc.data();
  };

  const getUserIntervall = async (email) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", session),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", email);
      alert("Inga poster hittades för", email);
      setIntervalDataInsulin(null);
      setIntervalDataNeedle(null);
      setIntervalDataSensor(null);
      setInsulinData(null);
      setNeedleData(null);
      setSensorData(null);
      setGlucagenData(null);
      setSparepenLongTermData(null);
      setSparepenMealData(null);
      setTransmitterData(null);
      return null;
    }
    const latestDoc = querySnapshot.docs[0];

    setIntervalDataInsulin(latestDoc.data().insulin);
    setIntervalDataNeedle(latestDoc.data().needle);
    setIntervalDataSensor(latestDoc.data().sensor);
    setIntervalDataGlucaGen(latestDoc.data().glucagen);
    setIntervalDataSparepenLongTerm(latestDoc.data().sparepenlongterm);
    setIntervalDataSparepenMeal(latestDoc.data().sparepenmeal);
    setIntervalDataTransmitter(latestDoc.data().transmitter);
    setUserName(latestDoc.data().Namn);
    dispatch({ type: "CHANGE_INSULIN", payload: latestDoc.data().insulin });
    dispatch({ type: "CHANGE_NEEDLE", payload: latestDoc.data().needle });
    dispatch({ type: "CHANGE_SENSOR", payload: latestDoc.data().sensor });

    dispatch({ type: "CHANGE_GLUCAGEN", payload: latestDoc.data().glucagen });
    dispatch({
      type: "CHANGE_SPAREPENLONGTERM",
      payload: latestDoc.data().sparepenlongterm,
    });
    dispatch({
      type: "CHANGE_SPAREPENMEAL",
      payload: latestDoc.data().sparepenmeal,
    });
    dispatch({
      type: "CHANGE_TRANSMITTER",
      payload: latestDoc.data().transmitter,
    });

    return latestDoc.data();
  };

  const listLatestChange = async (userid, changeType) => {
    const q = query(
      collection(db, "changes"),
      where("changeType", "==", changeType),
      where("userId", "==", uniqueDokumentId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Inga poster hittades för", changeType);
      return null;
    }
    const latestDoc = querySnapshot.docs[0];
    return latestDoc.data();
  };

  const handleSwedishDate = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm");
  };

  const addChanges = async (userId, changeType, date) => {
    // Dela upp det formaterade datumet i datum och klockslag
    let [datePart, timePart] = date.split(" ");

    const docRef = await addDoc(collection(db, "changes"), {
      changeType: changeType,
      dateChanged: datePart,
      timeChanged: timePart,
      timestamp: moment().valueOf(),
      userId: userId,
    });
  };

  function changeTimeToNoon(inputStr) {
    // Använd en regex för att matcha klockslag (HH:MM format)
    let regex = /(\d{1,2}:\d{2})/;

    // Ersätt det befintliga klockslaget med "12:00"
    return inputStr.replace(regex, "12:00");
  }

  const onChangeInsulin = (event, selectedDate) => {
    try {
      let fixDate = handleSwedishDate(selectedDate);

      setShowInsulinDateTime(false);
      if (event.type === "set") {
        let _insulinDate = addRegDays(fixDate, intervalDataInsulin);
        let updatedDateTimeStr = changeTimeToNoon(_insulinDate);

        setTextInsulinColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
        setInsulinData(updatedDateTimeStr);
        saveInsulinData(updatedDateTimeStr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSensor = (event, selectedDate) => {
    let fixDate = handleSwedishDate(selectedDate);
    setShowSensorDateTime(false);
    if (event.type === "set") {
      const _sensorDate = addRegDays(fixDate, intervalDataSensor);

      let dateTimeStr = _sensorDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setTextSensorColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
      setSensorData(updatedDateTimeStr);
      saveSensorData(updatedDateTimeStr);
    }
  };

  const onChangeNeel = (event, selectedDate) => {
    let fixDate = handleSwedishDate(selectedDate);
    setShowNeelDateTime(false);
    if (event.type === "set") {
      const _neelDate = addRegDays(fixDate, intervalDataNeedle);

      let dateTimeStr = _neelDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setTextNeedleColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
      setNeedleData(updatedDateTimeStr);
      saveNeedleData(updatedDateTimeStr);
    }
  };

  const onChangeGlucagen = (event, selectedDate) => {
    let fixDate = handleSwedishDate(selectedDate);
    setShowGlucaGenDateTime(false);
    if (event.type === "set") {
      const _glucagenDate = addRegDays(fixDate, intervalDataGlucaGen);

      let dateTimeStr = _glucagenDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setTextGlucaGenColor(isDataAfter(updatedDateTimeStr) ? "red" : "black");
      setGlucagenData(updatedDateTimeStr);
      saveGlucagenData(updatedDateTimeStr);
    }
  };

  const onChangeSparePenLongTerm = (event, selectedDate) => {
    try {
      let fixDate = handleSwedishDate(selectedDate);
      setShowSparepenLongTermDateTime(false);
      if (event.type === "set") {
        const _sparepenLongTermDate = addRegDays(
          fixDate,
          intervalDataSparepenLongTerm
        );

        let dateTimeStr = _sparepenLongTermDate;
        let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
        setTextSparepenLongTermColor(
          isDataAfter(updatedDateTimeStr) ? "red" : "black"
        );
        setSparepenLongTermData(updatedDateTimeStr);
        saveSparepenlongtermData(updatedDateTimeStr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSparepenMeal = (event, selectedDate) => {
    let fixDate = handleSwedishDate(selectedDate);
    setShowSparepenMealDateTime(false);
    if (event.type === "set") {
      const _sparepenMealDate = addRegDays(fixDate, intervalDataSparepenMeal);

      let dateTimeStr = _sparepenMealDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setTextSparepenMealColor(
        isDataAfter(updatedDateTimeStr) ? "red" : "black"
      );
      setSparepenMealData(updatedDateTimeStr);
      saveSparepenmealData(updatedDateTimeStr);
    }
  };

  const onChangeTransmitter = (event, selectedDate) => {
    let fixDate = handleSwedishDate(selectedDate);
    setShowTransmitterDateTime(false);
    if (event.type === "set") {
      const _transmitterDate = addRegDays(fixDate, intervalDataTransmitter);

      let dateTimeStr = _transmitterDate;
      let updatedDateTimeStr = changeTimeToNoon(dateTimeStr);
      setTextTransmitterColor(
        isDataAfter(updatedDateTimeStr) ? "red" : "black"
      );
      setTransmitterData(updatedDateTimeStr);
      saveTransmitterData(updatedDateTimeStr);
    }
  };

  const showMode = (currentMode, index) => {
    // if (index === 0) {
    //   setShowInsulinDateTime(true);
    //   setShowSensorDateTime(false);
    //   setShowNeelDateTime(false);
    //   setShowGlucaGenDateTime(false);
    //   setShowSparepenLongTermDateTime(false);
    //   setShowSparepenMealDateTime(false);
    //   setShowTransmitterDateTime(false);
    // }
    // if (index === 1) {
    //   setShowSensorDateTime(true);
    //   setShowNeelDateTime(false);
    //   setShowInsulinDateTime(false);
    // }
    // if (index === 2) {
    //   setShowNeelDateTime(true);
    //   setShowSensorDateTime(false);
    //   setShowInsulinDateTime(false);
    // }

    // Första if-satsen: index 0
    if (index === 0) {
      setShowInsulinDateTime(true);
      setShowSensorDateTime(false);
      setShowNeelDateTime(false);
      setShowGlucaGenDateTime(false);
      setShowSparepenLongTermDateTime(false);
      setShowSparepenMealDateTime(false);
      setShowTransmitterDateTime(false);
    }

    // Andra if-satsen: index 1
    if (index === 1) {
      setShowInsulinDateTime(false);
      setShowSensorDateTime(true);
      setShowNeelDateTime(false);
      setShowGlucaGenDateTime(false);
      setShowSparepenLongTermDateTime(false);
      setShowSparepenMealDateTime(false);
      setShowTransmitterDateTime(false);
    }

    // Tredje if-satsen: index 2
    if (index === 2) {
      setShowInsulinDateTime(false);
      setShowSensorDateTime(false);
      setShowNeelDateTime(true);
      setShowGlucaGenDateTime(false);
      setShowSparepenLongTermDateTime(false);
      setShowSparepenMealDateTime(false);
      setShowTransmitterDateTime(false);
    }

    // Fjärde if-satsen: index 3
    if (index === 3) {
      setShowInsulinDateTime(false);
      setShowSensorDateTime(false);
      setShowNeelDateTime(false);
      setShowGlucaGenDateTime(true);
      setShowSparepenLongTermDateTime(false);
      setShowSparepenMealDateTime(false);
      setShowTransmitterDateTime(false);
    }

    // Femte if-satsen: index 4
    if (index === 4) {
      setShowInsulinDateTime(false);
      setShowSensorDateTime(false);
      setShowNeelDateTime(false);
      setShowGlucaGenDateTime(false);
      setShowSparepenLongTermDateTime(true);
      setShowSparepenMealDateTime(false);
      setShowTransmitterDateTime(false);
    }

    // Sjätte if-satsen: index 5
    if (index === 5) {
      setShowInsulinDateTime(false);
      setShowSensorDateTime(false);
      setShowNeelDateTime(false);
      setShowGlucaGenDateTime(false);
      setShowSparepenLongTermDateTime(false);
      setShowSparepenMealDateTime(true);
      setShowTransmitterDateTime(false);
    }

    // Sjätte if-satsen: index 5
    if (index === 6) {
      setShowInsulinDateTime(false);
      setShowSensorDateTime(false);
      setShowNeelDateTime(false);
      setShowGlucaGenDateTime(false);
      setShowSparepenLongTermDateTime(false);
      setShowSparepenMealDateTime(false);
      setShowTransmitterDateTime(true);
    }

    setMode(currentMode);
  };

  const showDatepicker = (index) => {
    showMode("date", index);
  };

  moment.locale("sv");

  const addRegDays = (date, days) => {
    let formattedDate = moment(date)
      .add(days, "days")
      .format("YYYY-MM-DD HH:mm");

    console.log(formattedDate);
    return formattedDate;
  };

  const saveInsulinData = async (insulinDatum) => {
    addChanges(uniqueDokumentId, "Insulin", insulinDatum);
  };

  const saveNeedleData = async (needleDatum) => {
    addChanges(uniqueDokumentId, "Needle", needleDatum);
  };

  const saveSensorData = async (sensorDatum) => {
    addChanges(uniqueDokumentId, "Sensor", sensorDatum);
  };

  const saveGlucagenData = async (glucagenDatum) => {
    addChanges(uniqueDokumentId, "GlucaGen", glucagenDatum);
  };

  const saveSparepenlongtermData = async (sparepenlongtermDatum) => {
    addChanges(uniqueDokumentId, "SparePenLongTerm", sparepenlongtermDatum);
  };

  const saveSparepenmealData = async (sparepenmealDatum) => {
    addChanges(uniqueDokumentId, "SparePenMeal", sparepenmealDatum);
  };

  const saveTransmitterData = async (transmitterDatum) => {
    addChanges(uniqueDokumentId, "Transmitter", transmitterDatum);
  };

  const isDataAfter = (data) => {
    if (
      moment(moment(moment()).format("YYYY-MM-DD HH:mm")).isAfter(
        moment(data).format("YYYY-MM-DD HH:mm")
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const fetchData = async () => {
    setShowInsulinDateTime(false);
    setShowSensorDateTime(false);
    setShowNeelDateTime(false);
    setShowGlucaGenDateTime(false);
    setShowSparepenLongTermDateTime(false);
    setShowSparepenMealDateTime(false);
    setShowTransmitterDateTime(false);
    try {
      const [
        needleDataResponse,
        sensorDataResponse,
        insulinDataResponse,
        glucagenDataResponse,
        sparepenLongTermDataResponse,
        sparepenMealDataResponse,
        transmitterDataResponse,
      ] = await Promise.all([
        listLatestChange(uniqueDokumentId, "Needle"),
        listLatestChange(uniqueDokumentId, "Sensor"),
        listLatestChange(uniqueDokumentId, "Insulin"),

        listLatestChange(uniqueDokumentId, "GlucaGen"),
        listLatestChange(uniqueDokumentId, "SparePenLongTerm"),
        listLatestChange(uniqueDokumentId, "SparePenMeal"),
        listLatestChange(uniqueDokumentId, "Transmitter"),
      ]);

      if (needleDataResponse) {
        const needleDateFix =
          needleDataResponse.dateChanged + " " + needleDataResponse.timeChanged;
        const needleRes = moment(needleDateFix).format("YYYY-MM-DD HH:mm");
        setNeedleData(needleRes);
        setTextNeedleColor(isDataAfter(needleRes) ? "red" : "black");
      }

      if (sensorDataResponse) {
        const sensorDateFix =
          sensorDataResponse.dateChanged + " " + sensorDataResponse.timeChanged;
        const sensorRes = moment(sensorDateFix).format("YYYY-MM-DD HH:mm");
        setSensorData(sensorRes);
        setTextSensorColor(isDataAfter(sensorRes) ? "red" : "black");
      }

      if (insulinDataResponse) {
        const insulinDateFix =
          insulinDataResponse.dateChanged +
          " " +
          insulinDataResponse.timeChanged;
        const isulinRes = moment(insulinDateFix).format("YYYY-MM-DD HH:mm");
        setInsulinData(isulinRes);
        setTextInsulinColor(isDataAfter(isulinRes) ? "red" : "black");
      }

      if (glucagenDataResponse) {
        const glucagenDateFix =
          glucagenDataResponse.dateChanged +
          " " +
          glucagenDataResponse.timeChanged;
        const glucagenRes = moment(glucagenDateFix).format("YYYY-MM-DD HH:mm");
        setGlucagenData(glucagenRes);
        setTextGlucaGenColor(isDataAfter(glucagenRes) ? "red" : "black");
      }

      if (sparepenLongTermDataResponse) {
        const sparepenLongTermDateFix =
          sparepenLongTermDataResponse.dateChanged +
          " " +
          sparepenLongTermDataResponse.timeChanged;
        const sparepenLongTermRes = moment(sparepenLongTermDateFix).format(
          "YYYY-MM-DD HH:mm"
        );

        console.log("ffffffff", sparepenLongTermRes);

        setSparepenLongTermData(sparepenLongTermRes);
        setTextSparepenLongTermColor(
          isDataAfter(sparepenLongTermRes) ? "red" : "black"
        );
      }

      if (sparepenMealDataResponse) {
        const fix =
          sparepenMealDataResponse.dateChanged +
          " " +
          sparepenMealDataResponse.timeChanged;
        const res = moment(fix).format("YYYY-MM-DD HH:mm");

        setSparepenMealData(res);
        setTextSparepenMealColor(isDataAfter(res) ? "red" : "black");
      }

      if (transmitterDataResponse) {
        const fix =
          transmitterDataResponse.dateChanged +
          " " +
          transmitterDataResponse.timeChanged;
        const res = moment(fix).format("YYYY-MM-DD HH:mm");
        setTransmitterData(res);
        setTextTransmitterColor(isDataAfter(res) ? "red" : "black");
      }
    } catch (error) {
      alert("Fel vid hämtning av data.");
    }
  };

  const onPressInsulin = (date) => {
    const _insulindate = addRegDays(date, intervalDataInsulin);
    setTextInsulinColor(isDataAfter(_insulindate) ? "red" : "black");
    setShowInsulinDateTime(false);
    setInsulinData(_insulindate);
    saveInsulinData(_insulindate);
  };
  const onPressNeedle = (date) => {
    const _needledate = addRegDays(date, intervalDataNeedle);
    setTextNeedleColor(isDataAfter(_needledate) ? "red" : "black");
    setShowNeelDateTime(false);
    setNeedleData(_needledate);
    saveNeedleData(_needledate);
  };
  const onPressSensor = (date) => {
    const _sensordate = addRegDays(date, intervalDataSensor);
    setTextSensorColor(isDataAfter(_sensordate) ? "red" : "black");
    setShowSensorDateTime(false);
    setSensorData(_sensordate);
    saveSensorData(_sensordate);
  };

  const onPressGlucagen = (date) => {
    const _date = addRegDays(date, intervalDataGlucaGen);
    setTextGlucaGenColor(isDataAfter(_date) ? "red" : "black");
    setShowGlucaGenDateTime(false);
    setGlucagenData(_date);
    saveGlucagenData(_date);
  };

  const onPressSparePenLongTerm = (date) => {
    const _date = addRegDays(date, intervalDataSparepenLongTerm);
    setTextSparepenLongTermColor(isDataAfter(_date) ? "red" : "black");
    setShowSparepenLongTermDateTime(false);
    setSparepenLongTermData(_date);
    saveSparepenlongtermData(_date);
  };

  const onPressSparePenMeal = (date) => {
    const _date = addRegDays(date, intervalDataSparepenMeal);
    console.log("_date", _date);
    setTextSparepenMealColor(isDataAfter(_date) ? "red" : "black");
    setShowSparepenMealDateTime(false);
    setSparepenMealData(_date);
    saveSparepenmealData(_date);
  };

  const onPressTransmitter = (date) => {
    const _date = addRegDays(date, intervalDataTransmitter);
    setTextTransmitterColor(isDataAfter(_date) ? "red" : "black");
    setShowTransmitterDateTime(false);
    setTransmitterData(_date);
    saveTransmitterData(_date);
  };

  return (
    <SafeAreaView className="flex-1  bg-[#74cdcd]">
      <View className="flex-row mr-3 ml-3">
        <View>
          <Link
            href={{
              pathname: "interval/[id]",
              params: {
                insulin:
                  intervalDataInsulin === null ? "" : intervalDataInsulin,
                needle: intervalDataNeedle === null ? "" : intervalDataNeedle,
                sensor: intervalDataSensor === null ? "" : intervalDataSensor,
                email: session === null ? "" : session,
              },
            }}
            asChild
          >
            <Pressable>
              {({ pressed }) => (
                <Ionicons name="settings-outline" size={30} color="white" />
              )}
            </Pressable>
          </Link>
        </View>
        <View className="grow items-center ">
          <Text className="text-2xl font-bold text-white">
            {userName === null ? "Singelvisa" : "Anv. " + userName}
          </Text>
        </View>
        <View className="flex-none mr-1">
          <TouchableOpacity onPress={() => fetchData()}>
            <Ionicons name="reload" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <InsulineDateTime
          showInsulinDateTime={showInsulinDateTime}
          showSensorDateTime={showSensorDateTime}
          showNeelDateTime={showNeelDateTime}
          showGlucaGenDateTime={showGlucaGenDateTime}
          showSparepenLongTermDateTime={showSparepenLongTermDateTime}
          showSparepenMealDateTime={showSparepenMealDateTime}
          showTransmitterDateTime={showTransmitterDateTime}
          onChangeInsulin={onChangeInsulin}
          onChangeSensor={onChangeSensor}
          onChangeNeel={onChangeNeel}
          onChangeGlucagen={onChangeGlucagen}
          onChangeSparePenLongTerm={onChangeSparePenLongTerm}
          onChangeSparepenMeal={onChangeSparepenMeal}
          onChangeTransmitter={onChangeTransmitter}
          date={date}
          mode={mode}
        />
        <View className="flex-1 flex-col gap-3 p-2 bg-[#74cdcd]">
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <InsulinRegistration
              onPressInsulin={onPressInsulin}
              showDatepicker={showDatepicker}
              textInsulinColor={textInsulinColor}
              insulinData={insulinData}
            />
          </View>
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <NeedleRegistration
              onPressNeedle={onPressNeedle}
              showDatepicker={showDatepicker}
              textNeedleColor={textNeedleColor}
              needleData={needleData}
            />
          </View>
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <SensorRegistration
              onPressSensor={onPressSensor}
              showDatepicker={showDatepicker}
              textSensorColor={textSensorColor}
              sensorData={sensorData}
            />
          </View>
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <SparePenMealRegistration
              onPressSparePenMeal={onPressSparePenMeal}
              showDatepicker={showDatepicker}
              textSparepenMealColor={textSparepenMealColor}
              sparepenMealData={sparepenMealData}
            />
          </View>
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <SparePenLongTermRegistration
              onPressSparePenLongTerm={onPressSparePenLongTerm}
              showDatepicker={showDatepicker}
              textSparepenLongTermColor={textSparepenLongTermColor}
              sparepenLongTermData={sparepenLongTermData}
            />
          </View>
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <TransmitterRegistration
              onPressTransmitter={onPressTransmitter}
              showDatepicker={showDatepicker}
              textTransmitterColor={textTransmitterColor}
              transmitterData={transmitterData}
            />
          </View>
          <View className="bg-[#143642] rounded-xl" style={{ height: 200 }}>
            <GlucagenRegistration
              onPressGlucagen={onPressGlucagen}
              showDatepicker={showDatepicker}
              textGlucaGenColor={textGlucaGenColor}
              glucagenData={glucagenData}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
