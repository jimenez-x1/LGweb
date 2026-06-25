import type { Type as TypeModal } from '../../../Api/namespaces/modalError';
import { CreateActions } from '../../../storeConfig';

export const NAME = "grados";

export declare namespace Type {
    export type GradoInfo = {
        ID_Grado: number;
        ID_Clase: number;
        Nombre_Grado: string;
        Seccion: string;
        Anio: number;
    }
}

export declare namespace StoreGrados {
    export type State = {
        gradoInfo: Type.GradoInfo | null;
        gradosInfo: Type.GradoInfo[];
        error: TypeModal.ModalError | null;
    }
}

export const Action = CreateActions<{
    cleanGrado: void;
    cleanStore: void;
    setGrado: Type.GradoInfo;
}>(NAME, ["cleanGrado", "cleanStore", "setGrado"]);

export const INIT: StoreGrados.State = {
    gradoInfo: null,
    gradosInfo: [],
    error: null,
};