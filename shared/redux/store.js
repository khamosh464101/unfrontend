import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import deleteReducer from "./features/deleteSlice";
import generalReducer from "./features/generalSlice";

const store = configureStore(
  {
    //  reducer: reducer
    reducer: {
      main: reducer,
      delete: deleteReducer,
      general: generalReducer,
    },
  },
);

export default store;
