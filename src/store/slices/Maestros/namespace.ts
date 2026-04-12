import type { Type as TypeModal } from '../../../Api/namespaces/modalError';
import { CreateActions } from '../../../storeConfig';

export const NAME = "maestros";

export declare namespace Type {
    export type MaestroInfo = {
        ID_Maestro: number;
        ID_Grado: number;
        Nombre: string;
        Apellido: string;
        Telefono: string;
        Correo: string;
    }
}

export declare namespace StoreMaestros {
    export type State = {
        maestroInfo: Type.MaestroInfo | null;
        maestrosInfo: Type.MaestroInfo[];
        error: TypeModal.ModalError | null;
    }
}

export const Action = CreateActions<{
    cleanMaestro: void;
    cleanStore: void;
    setMaestro: Type.MaestroInfo;
}>(NAME, ["cleanMaestro", "cleanStore", "setMaestro"]);

export const INIT: StoreMaestros.State = {
    maestroInfo: null,
    maestrosInfo: [],
    error: null,
};