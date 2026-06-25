const getAlumnos = (state: any) => state.alumnos.alumnos;
// Selector que obtiene la lista de alumnos desde el estado global de Redux

export default {
  getAlumnos,
};
// Exporta el selector para poder usarlo en otros componentes