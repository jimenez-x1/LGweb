import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alumnos: [],
};

const alumnosSlice = createSlice({
  name: "alumnos",
  initialState,
  reducers: {
    setAlumnos: (state, action) => {
      state.alumnos = action.payload;
    },
  },
});

export const { setAlumnos } = alumnosSlice.actions;
export default alumnosSlice.reducer;