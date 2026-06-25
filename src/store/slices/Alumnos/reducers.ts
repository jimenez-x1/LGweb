import { createSlice } from "@reduxjs/toolkit";
// Función de Redux Toolkit para crear un slice (parte del estado global)

const initialState = {
  alumnos: [], // Estado inicial: lista vacía de alumnos
};

const alumnosSlice = createSlice({
  name: "alumnos", 
  // Nombre del slice dentro de Redux

  initialState, 
  // Estado inicial definido arriba

  reducers: {
    setAlumnos: (state, action) => {
      // Función que actualiza el estado
      state.alumnos = action.payload; 
      // Guarda los alumnos que vienen en la acción
    },
  },
});

export const { setAlumnos } = alumnosSlice.actions;
// Exporta la acción para poder usarla en otros archivos

export default alumnosSlice.reducer;
// Exporta el reducer para conectarlo al store