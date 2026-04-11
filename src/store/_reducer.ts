import { CombineReducers } from "../storeConfig";
import { NAME as NAME_GRADOS, Reducer as ReducerGrados } from "./slices/Grado";

export default CombineReducers({
    [NAME_GRADOS]: ReducerGrados,
});