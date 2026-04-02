import api from "../../../utilities/axiosConfig";
export const getAlumnos = async () => {
  const response = await api.get("/alumnos");
  return response.data;
};