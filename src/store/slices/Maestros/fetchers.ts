import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./namespace";
import { getData, saveData, updateData, deleteData } from "../../../utilities/Utilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    async getMaestros(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { maestrosInfo: response?.data };
    },
    async getGrados(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { gradosInfo: response?.data };
    },
    async insertMaestro(params: any) {
        const response = await saveData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { maestrosInfo: response?.data };
    },
    async updateMaestro(params: any) {
        const response = await updateData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { maestrosInfo: response?.data };
    },
    async deleteMaestro(params: any) {
        const response = await deleteData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { maestrosInfo: response?.data };
    },
});