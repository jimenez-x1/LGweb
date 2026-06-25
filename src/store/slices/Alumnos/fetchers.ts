import { CreateFetchers } from "../../../storeConfig"; 
// Función que crea los fetchers (acciones para consumir API con Redux)

import { NAME } from "./namespace"; 
// Nombre del módulo (namespace) para identificar este slice en Redux

import { getData, saveData, deleteData, updateData } from "../../../utilities/Utilities";
// Funciones reutilizables para hacer peticiones HTTP (GET, POST, DELETE, PUT)

import { isError } from "../../../Api/utilsError";
// Función que valida si la respuesta contiene error

export default CreateFetchers(NAME, {
  // Se exportan todas las funciones como fetchers ligados al NAME

  async getAlumnos(params: any) {
    // Obtiene la lista de alumnos desde la API
    const response = await getData(params); // Llamada GET

    if (isError<any>(response?.error)) {
      // Si hay error, lo retorna
      return { error: response?.error };
    }

    return { alumnosInfo: response?.data }; 
    // Retorna los datos de alumnos
  },

  async getGrados(params: any) {
    // Obtiene la lista de grados
    const response = await getData(params); // Llamada GET

    if (isError<any>(response?.error)) {
      return { error: response?.error };
    }

    return { gradosInfo: response?.data }; 
    // Retorna los datos de grados
  },

  async insertAlumno(params: any) {
    // Inserta un nuevo alumno
    const response = await saveData(params); // Llamada POST

    if (isError<any>(response?.error)) {
      return { error: response?.error };
    }

    return { alumnosInfo: response?.data }; 
    // Retorna el resultado de la inserción
  },

  async updateAlumno(params: any) {
    // Actualiza un alumno existente
    const response = await updateData(params); // Llamada PUT

    if (isError<any>(response?.error)) {
      return { error: response?.error };
    }

    return { alumnosInfo: response?.data }; 
    // Retorna el resultado de la actualización
  },

  async deleteAlumno(params: any) {
    // Elimina un alumno
    const response = await deleteData(params); // Llamada DELETE

    if (isError<any>(response?.error)) {
      return { error: response?.error };
    }

    return { alumnosInfo: response?.data }; 
    // Retorna el resultado de la eliminación
  },
});