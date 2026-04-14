import { CombineReducers } from "../storeConfig";
import { NAME as NAME_GRADOS, Reducer as ReducerGrados } from "./slices/Grado";
import { NAME as NAME_CLASES, Reducer as ReducerClases } from "./slices/Clase";

export default CombineReducers({
    [NAME_GRADOS]: ReducerGrados,
    [NAME_CLASES]: ReducerClases,
});