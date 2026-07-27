import type { Type as TypeModal } from '../../../Api/namespaces/modalError';
import { CreateActions } from '../../../storeConfig';

export const NAME = "calificaciones";

export declare namespace Type {
    export type CalificacionInfo = {
        ID_Calificacion: number;
        ID_Alumno: number;
        ID_Clase: number;
        Parcial1: number;
        Parcial2: number;
        Parcial3: number;
        Parcial4: number;
        Promedio: number;
    }
}

export declare namespace StoreCalificaciones {
    export type State = {
        calificacionInfo: Type.CalificacionInfo | null;
        calificacionesInfo: Type.CalificacionInfo[];
        error: TypeModal.ModalError | null;
    }
}

export const Action = CreateActions<{
    cleanCalificacion: void;
    cleanStore: void;
    setCalificacion: Type.CalificacionInfo;
}>(NAME, [
    "cleanCalificacion",
    "cleanStore",
    "setCalificacion"
]);

export const INIT: StoreCalificaciones.State = {
    calificacionInfo: null,
    calificacionesInfo: [],
    error: null,
};