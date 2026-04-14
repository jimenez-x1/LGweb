import { CreateReducer } from "../../../storeConfig";
import { Action, INIT } from "./namespace";
import type { Type } from "./namespace";
import fetchers from "./fetchers";

export default CreateReducer(INIT, ({addCase}) => {

addCase(Action.cleanStore, (state) => ({
    ...state,
    ...INIT
}));

addCase(Action.cleanClase, (state) => ({
    ...state,
    claseInfo: INIT.claseInfo,
}));

addCase(Action.setClase, (state, {payload}) => ({
    ...state,
    claseInfo: payload,
}));

addCase(fetchers.getClases.fulfilled, (state, { payload }) => ({
    ...state,
    clasesInfo: (payload.clasesInfo ?? []) as Type.ClaseInfo[],
}));

});