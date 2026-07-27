import { CreateReducer } from "../../../storeConfig";
import { Action, INIT } from "./namespace";
import type { Type } from "./namespace";
import fetchers from "./fetchers";

export default CreateReducer(INIT, ({ addCase }) => {

    addCase(Action.cleanStore, (state) => ({
        ...state,
        ...INIT
    }));

    addCase(Action.cleanCalificacion, (state) => ({
        ...state,
        calificacionInfo: INIT.calificacionInfo,
    }));

    addCase(Action.setCalificacion, (state, { payload }) => ({
        ...state,
        calificacionInfo: payload,
    }));

    addCase(fetchers.getCalificaciones.fulfilled, (state, { payload }) => ({
        ...state,
        calificacionesInfo: (payload.calificacionesInfo ?? []) as Type.CalificacionInfo[],
    }));

});