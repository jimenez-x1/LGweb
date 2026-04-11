import api from "../../../utilities/axiosConfig";

export const getGrados = async () => {
  const response = await api.get("/grados");
  return response.data;
};

export const getClases = async () => {
  const response = await api.get("/clases");
  return response.data;
};

export const insertGrado = async (data: any) => {
  const response = await api.post("/grados", data);
  return response.data;
};

export const updateGrado = async (data: any) => {
  const response = await api.put(`/grados/${data.ID_Grado}`, data);
  return response.data;
};

export const deleteGrado = async (id: any) => {
  const response = await api.delete(`/grados/${id}`);
  return response.data;
};
