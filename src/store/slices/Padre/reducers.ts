import { CreateReducer } from "../../../storeConfig";
import { Action, INIT } from "./namespace";
import type { Type } from "./namespace";
import fetchers from "./fetchers";

export default CreateReducer(INIT, ({addCase}) => {

addCase(Action.cleanStore, (state) => ({
    ...state,
    ...INIT
}));

addCase(Action.cleanPadre, (state) => ({
    ...state,
    padreInfo: INIT.padreInfo,
}));

addCase(Action.setPadre, (state, {payload}) => ({
    ...state,
    padreInfo: payload,
}));

addCase(fetchers.getPadres.fulfilled, (state, { payload }) => ({
    ...state,
    padresInfo: (payload.padresInfo ?? []) as Type.PadreInfo[],
}));

});