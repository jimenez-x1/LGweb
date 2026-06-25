import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./namespace";
import { getData, saveData, deleteData, updateData } from "../../../utilities/Utilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    async getGrados(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { gradosInfo: response?.data };
    },
    async getClases(params: any) {
        const response = await getData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { clasesInfo: response?.data };
    },
    async insertGrado(params: any) {
        const response = await saveData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { gradosInfo: response?.data };
    },
  async updateGrado(params: any) {
    const response = await updateData(params);
    if (isError<any>(response?.error)) {
        return { error: response?.error };
    }
    return { gradosInfo: response?.data };
},
    async deleteGrado(params: any) {
        const response = await deleteData(params);
        if (isError<any>(response?.error)) {
            return { error: response?.error };
        }
        return { gradosInfo: response?.data };
    },
});