const getCalificaciones = (state: any) => state.calificaciones.calificaciones;
// Selector que obtiene la lista de calificaciones desde el estado global de Redux

export default {
  getCalificaciones,
};
// Exporta el selector para poder usarlo en otros componentes