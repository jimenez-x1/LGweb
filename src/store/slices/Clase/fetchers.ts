import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./namespace";
import { getData, saveData, deleteData, updateData } from "../../../utilities/Utilities"; 
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    async getClases(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { clasesInfo: response?.data };
    },
    async insertClase(params: any) {
        const response = await saveData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { clasesInfo: response?.data };
    },
    async updateClase(params: any) {
        const response = await updateData(params); 
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { clasesInfo: response?.data };
    },
    async deleteClase(params: any) {
        const response = await deleteData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { clasesInfo: response?.data };
    },
});