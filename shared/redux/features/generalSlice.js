import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default generalSlice.reducer;
