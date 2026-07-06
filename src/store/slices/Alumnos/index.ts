import reducer from "./reducers";
// Importa el reducer de este módulo (maneja cómo se actualiza el estado en Redux)

export { default as fetchers } from "./fetchers";
// Exporta los fetchers (funciones que llaman a la API)

export { default as selectors } from "./selectors";
// Exporta los selectors (funciones para obtener datos del estado de Redux)

export { NAME } from "./namespace";
// Exporta el nombre del módulo (namespace) para identificarlo en Redux

export default reducer;
// Exporta el reducer como principal (se usará en el store)