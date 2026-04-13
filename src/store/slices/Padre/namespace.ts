import type { Type as TypeModal } from '../../../Api/namespaces/modalError';
import { CreateActions } from '../../../storeConfig';

export const NAME = "padres";

export declare namespace Type {
    export type PadreInfo = {
        ID_Padre: number;
        ID_Alumno: number;
        Nombre: string;
        Apellido: string;
        Telefono: string;
        Correo: string;
    }
}

export declare namespace StorePadres {
    export type State = {
        padreInfo: Type.PadreInfo | null;
        padresInfo: Type.PadreInfo[];
        error: TypeModal.ModalError | null;
    }
}

export const Action = CreateActions<{
    cleanPadre: void;
    cleanStore: void;
    setPadre: Type.PadreInfo;
}>(NAME, ["cleanPadre", "cleanStore", "setPadre"]);

export const INIT: StorePadres.State = {
    padreInfo: null,
    padresInfo: [],
    error: null,
};