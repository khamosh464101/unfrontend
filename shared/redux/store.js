import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import deleteReducer from "./features/deleteSlice";
import generalReducer from "./features/generalSlice";
import apiReducer from './features/apiSlice';

const store = configureStore(
  {
    //  reducer: reducer
    reducer: {
      main: reducer,
      delete: deleteReducer,
      general: generalReducer,
      api: apiReducer
    },
  },
);

export default store;
