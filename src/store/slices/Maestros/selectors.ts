import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../../../store";
import type { StoreMaestros } from "./namespace";
import { NAME } from "./namespace";

export default function Selector(store: StoreState): StoreMaestros.State {
    return ((store as any)[NAME] as StoreMaestros.State) ?? {
        maestroInfo: null,
        maestrosInfo: [],
        error: null
    };
}

Selector.getMaestros = CreateSelector(Selector, (state) => state.maestrosInfo);
Selector.getMaestro = CreateSelector(Selector, (state) => state.maestroInfo);