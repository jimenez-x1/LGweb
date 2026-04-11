import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../../../store";
import type { StoreGrados } from "./namespace";
import { NAME } from "./namespace";

export default function Selector(store: StoreState): StoreGrados.State {
    return ((store as any)[NAME] as StoreGrados.State) ?? {
        gradoInfo: null,
        gradosInfo: [],
        error: null
    };
}

Selector.getGrados = CreateSelector(Selector, (state) => state.gradosInfo);
Selector.getGrado = CreateSelector(Selector, (state) => state.gradoInfo);