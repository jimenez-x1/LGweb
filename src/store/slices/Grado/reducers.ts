import { CreateReducer } from "../../../storeConfig";
import { Action, INIT } from "./namespace";
import type { Type } from "./namespace";
import fetchers from "./fetchers";

export default CreateReducer(INIT, ({addCase}) => {

addCase(Action.cleanStore, (state) => ({
    ...state,
    ...INIT
}));

addCase(Action.cleanGrado, (state) => ({
    ...state,
    gradoInfo: INIT.gradoInfo,
}));

addCase(Action.setGrado, (state, {payload}) => ({
    ...state,
    gradoInfo: payload,
}));

addCase(fetchers.getGrados.fulfilled, (state, { payload }) => ({
    ...state,
    gradosInfo: (payload.gradosInfo ?? []) as Type.GradoInfo[],
}));

});