import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../../../store";
import type { StorePadres } from "./namespace";
import { NAME } from "./namespace";

export default function Selector(store: StoreState): StorePadres.State {
    return store[NAME] ?? {
        padreInfo: null,
        padresInfo: [],
        error: null
    };
}

Selector.getPadres = CreateSelector(Selector, (state) => state.padresInfo);
Selector.getPadre = CreateSelector(Selector, (state) => state.padreInfo);