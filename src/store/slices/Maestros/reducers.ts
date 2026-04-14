import { CreateReducer } from "../../../storeConfig";
import { Action, INIT } from "./namespace";
import type { Type } from "./namespace";
import fetchers from "./fetchers";

export default CreateReducer(INIT, ({addCase}) => {

    addCase(Action.cleanStore, (state) => ({
        ...state,
        ...INIT
    }));

    addCase(Action.cleanMaestro, (state) => ({
        ...state,
        maestroInfo: INIT.maestroInfo,
    }));

    addCase(Action.setMaestro, (state, {payload}) => ({
        ...state,
        maestroInfo: payload,
    }));

    addCase(fetchers.getMaestros.fulfilled, (state, { payload }) => ({
        ...state,
        maestrosInfo: (payload.maestrosInfo ?? []) as Type.MaestroInfo[],
    }));

});