import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../../../store";
import type { StoreCalificaciones } from "./namespace";
import { NAME } from "./namespace";

export default function Selector(store: StoreState): StoreCalificaciones.State {
    return ((store as any)[NAME] as StoreCalificaciones.State) ?? {
        calificacionInfo: null,
        calificacionesInfo: [],
        error: null
    };
}

Selector.getCalificaciones = CreateSelector(
    Selector,
    (state) => state.calificacionesInfo
);

Selector.getCalificacion = CreateSelector(
    Selector,
    (state) => state.calificacionInfo
);