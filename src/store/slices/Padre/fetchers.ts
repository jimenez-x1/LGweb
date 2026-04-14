import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./namespace";
import { getData, saveData, deleteData, updateData } from "../../../utilities/Utilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    async getPadres(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { padresInfo: response?.data };
    },
    async getAlumnos(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { alumnosInfo: response?.data };
    },
    async insertPadre(params: any) {
        const response = await saveData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { padresInfo: response?.data };
    },
    async updatePadre(params: any) {
        const response = await updateData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { padresInfo: response?.data };
    },
    async deletePadre(params: any) {
        const response = await deleteData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { padresInfo: response?.data };
    },
});