import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./namespace";
import { getData, saveData, updateData, deleteData } from "../../../utilities/Utilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {

    // Obtener calificaciones
    async getCalificaciones(params: any) {
        const response = await getData(params);

        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }

        return {
            calificacionesInfo: response?.data
        };
    },

    // Obtener alumnos
    async getAlumnos(params: any) {
        const response = await getData(params);

        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }

        return {
            alumnosInfo: response?.data
        };
    },

    // Obtener clases
    async getClases(params: any) {
        const response = await getData(params);

        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }

        return {
            clasesInfo: response?.data
        };
    },

    // Registrar calificación
    async insertCalificacion(params: any) {
        const response = await saveData(params);

        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }

        return {
            calificacionesInfo: response?.data
        };
    },

    // Actualizar calificación
    async updateCalificacion(params: any) {
        const response = await updateData(params);

        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }

        return {
            calificacionesInfo: response?.data
        };
    },

    // Eliminar calificación
    async deleteCalificacion(params: any) {
        const response = await deleteData(params);

        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }

        return {
            calificacionesInfo: response?.data
        };
    }

});