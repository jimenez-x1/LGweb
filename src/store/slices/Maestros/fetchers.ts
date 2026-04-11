const API = "http://localhost:3000/api";

export const getMaestros = async () => {
  const response = await fetch(`${API}/maestros`);
  if (!response.ok) throw new Error("Error al obtener maestros");
  return response.json();
};

export const insertMaestro = async (maestro: object) => {
  const response = await fetch(`${API}/insertMaestro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(maestro),
  });
  if (!response.ok) throw new Error("Error al registrar maestro");
  return response.json();
};

export const updateMaestro = async (maestro: object) => {
  const response = await fetch(`${API}/updateMaestro`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(maestro),
  });
  if (!response.ok) throw new Error("Error al actualizar maestro");
  return response.json();
};

export const deleteMaestro = async (id: number) => {
  const response = await fetch(`${API}/deleteMaestro/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar maestro");
  return response.json();
};

export const getGrados = async () => {
  const response = await fetch(`${API}/grados`);
  if (!response.ok) throw new Error("Error al obtener grados");
  return response.json();
};