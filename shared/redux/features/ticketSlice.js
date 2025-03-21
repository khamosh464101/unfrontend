import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
  modalTimeLogOpen: false,
  project: null,
  activity: null,
  defaultStatus: null,
  timeLogEdit: null,
  ticketEdit: null,
};

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setModalOpen: (state, { payload }) => {
      state.modalOpen = !state.modalOpen;
    },
    setModalTimeLogOpen: (state, { payload }) => {
      state.modalTimeLogOpen = !state.modalTimeLogOpen;
      console.log(
        "000000000000000003454534543sdfsdfdsfdsf",
        state.modalTimeLogOpen
      );
    },
    setProject: (state, { payload }) => {
      state.project = payload;
    },
    setActivity: (state, { payload }) => {
      state.activity = payload;
    },
    setDefaultStatus: (state, { payload }) => {
      state.defaultStatus = payload;
    },
    setTimeLogEdit: (state, {payload}) => {
      state.timeLogEdit = payload;
    },
    setTicketEdit: (state, {payload}) => {

      state.ticketEdit = payload;
    }
  },
  extraReducers: (builder) => {},
});

export const {
  setModalOpen,
  setModalTimeLogOpen,
  setProject,
  setActivity,
  setDefaultStatus,
  setTimeLogEdit,
  setTicketEdit
} = ticketSlice.actions;
export default ticketSlice.reducer;
