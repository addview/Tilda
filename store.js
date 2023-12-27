// store.js
import { createContext, useReducer } from "react";
const initialState = {
  insulin: 0,
  needle: 0,
  sensor: 0,
  glucagen: 0,
  sparepenlongterm: 0,
  sparepenmeal: 0,
  transmitter: 0,
  changeinterval: false,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "CHANGE_INSULIN":
        return { ...state, insulin: action.payload };
      case "CHANGE_NEEDLE":
        return { ...state, needle: action.payload };
      case "CHANGE_SENSOR":
        return { ...state, sensor: action.payload };
      case "CHANGE_INTERVAL":
        return { ...state, changeinterval: action.payload };
      case "CHANGE_GLUCAGEN":
        return { ...state, glucagen: action.payload };
      case "CHANGE_SPAREPENLONGTERM":
        return { ...state, sparepenlongterm: action.payload };
      case "CHANGE_SPAREPENMEAL":
        return { ...state, sparepenmeal: action.payload };
      case "CHANGE_TRANSMITTER":
        return { ...state, transmitter: action.payload };
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
export { store, StateProvider };
