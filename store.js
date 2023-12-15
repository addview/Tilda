// store.js
import { createContext, useReducer } from "react";
const initialState = {
  insulin: 0,
  needle: 0,
  sensor: 0,
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
      default:
        throw new Error();
    }
  }, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
export { store, StateProvider };
