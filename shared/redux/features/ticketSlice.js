import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
};

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setModalOpen: (state, { payload }) => {
      state.modalOpen = !state.modalOpen;
      console.log("000000000000000003454534543sdfsdfdsfdsf", state.modalOpen);
    },
  },
  extraReducers: (builder) => {},
});

export const { setModalOpen } = ticketSlice.actions;
export default ticketSlice.reducer;
