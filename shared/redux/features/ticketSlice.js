import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
  project: null,
  activity: null,
  defaultStatus: null,
};

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setModalOpen: (state, { payload }) => {
      state.modalOpen = !state.modalOpen;
      console.log("000000000000000003454534543sdfsdfdsfdsf", state.modalOpen);
    },
    setProject: (state, {payload}) => {
      state.project = payload;
    },
    setActivity: (state,{payload}) => {
 
      state.activity = payload;
    },
    setDefaultStatus: (state, {payload}) => {
      state.defaultStatus = payload;
    }
  },
  extraReducers: (builder) => {},
});

export const { setModalOpen, setProject, setActivity, setDefaultStatus } = ticketSlice.actions;
export default ticketSlice.reducer;
