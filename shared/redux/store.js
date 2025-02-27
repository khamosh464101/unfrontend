import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import deleteReducer from "./features/deleteSlice";
import thunkMiddleware from "redux-thunk";
import generalReducer from "./features/generalSlice";

const store = configureStore(
  {
    reducer: {
      main: reducer,
      delete: deleteReducer,
      general: generalReducer,
    },
  },
  applyMiddleware(thunkMiddleware)
);

export default store;
