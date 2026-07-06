import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calificaciones: [],
};

const calificacionesSlice = createSlice({
  name: "calificaciones",
  initialState,
  reducers: {
    setCalificaciones: (state, action) => {
      state.calificaciones = action.payload;
    },
  },
});

export const { setCalificaciones } = calificacionesSlice.actions;

export default calificacionesSlice.reducer;