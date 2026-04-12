import type { Type as TypeModal } from '../../../Api/namespaces/modalError';
import { CreateActions } from '../../../storeConfig';

export const NAME = "clases";

export declare namespace Type {
    export type ClaseInfo = {
        ID_Clase: number;
        Nombre_Clase: string;
    }
}

export declare namespace StoreClases {
    export type State = {
        claseInfo: Type.ClaseInfo | null;
        clasesInfo: Type.ClaseInfo[];
        error: TypeModal.ModalError | null;
    }
}

export const Action = CreateActions<{
    cleanClase: void;
    cleanStore: void;
    setClase: Type.ClaseInfo;
}>(NAME, ["cleanClase", "cleanStore", "setClase"]);

export const INIT: StoreClases.State = {
    claseInfo: null,
    clasesInfo: [],
    error: null,
};