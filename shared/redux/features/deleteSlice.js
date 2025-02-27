import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: false,
};

export const deleteSlice = createSlice({
  name: "delete",
  initialState,
  reducers: {
    setDelete: (state, { payload }) => {
      console.log("000000000000000003454534543sdfsdfdsfdsf");
      state.item = !state.item;
    },
  },
  extraReducers: (builder) => {},
});

export const { setDelete } = deleteSlice.actions;
export default deleteSlice.reducer;
