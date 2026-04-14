import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../../../store";
import type { StoreClases } from "./namespace";  // 
import { NAME } from "./namespace";              

export default function Selector(store: StoreState): StoreClases.State {
    return ((store as any)[NAME] as StoreClases.State) ?? {
        claseInfo: null,
        clasesInfo: [],
        error: null
    };
}

Selector.getClases = CreateSelector(Selector, (state) => state.clasesInfo);
Selector.getClase = CreateSelector(Selector, (state) => state.claseInfo);