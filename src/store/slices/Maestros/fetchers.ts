import { getData, saveData, updateData, deleteData } from "../../../utilities/Utilities";

export const getMaestros = async () => {
    const response = await getData({ url: "/maestros" });
    return response?.data;
};

export const getGrados = async () => {
    const response = await getData({ url: "/grados" });
    return response?.data;
};

export const insertMaestro = async (maestro: object) => {
    const response = await saveData({ url: "/insertMaestro", data: maestro });
    return response?.data;
};

export const updateMaestro = async (maestro: object) => {
    const response = await updateData({ url: "/updateMaestro", data: maestro });
    return response?.data;
};

export const deleteMaestro = async (id: number) => {
    const response = await deleteData({ url: `/deleteMaestro/${id}` });
    return response?.data;
};