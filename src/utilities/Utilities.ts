import type { TypeUtilities, TypeGenericResponse } from "./TypeUtilities";
import { INIT } from "./TypeUtilities";
import axios from "axios";
import { config } from "./axiosConfig";
import { isEmpty } from "lodash";

const api = axios.create(config);

const crearResponseData = (): TypeGenericResponse => {
    return JSON.parse(JSON.stringify(INIT));
};

const obtenerMensajeError = (
    error: any,
    mensajePredeterminado: string
) => {
    const response = error?.response;

    const mensajeOriginal =
        response?.data?.message ||
        response?.data?.error?.message ||
        response?.data?.error ||
        response?.statusText ||
        error?.message ||
        mensajePredeterminado;

    const mensaje = String(mensajeOriginal).toLowerCase();

    if (
        mensaje.includes("fk_alumno_padre_dni") ||
        mensaje.includes("foreign key constraint fails") &&
        mensaje.includes("dni_padre")
    ) {
        return "El DNI del padre ingresado no existe. Registre primero al padre o deje este campo vacío.";
    }

    if (
        mensaje.includes("fk_alumno_grado") ||
        mensaje.includes("foreign key constraint fails") &&
        mensaje.includes("id_grado")
    ) {
        return "El grado seleccionado no existe. Seleccione un grado válido.";
    }

    if (
        mensaje.includes("duplicate entry") ||
        mensaje.includes("unique constraint") ||
        mensaje.includes("validation error")
    ) {
        return "Ya existe un registro con esos datos.";
    }

    if (
        mensaje.includes("cannot delete or update a parent row") ||
        mensaje.includes("on delete restrict")
    ) {
        return "No se puede eliminar este registro porque está relacionado con otros datos del sistema.";
    }

    if (response?.status === 400) {
        return mensajeOriginal || "Los datos enviados no son válidos.";
    }

    if (response?.status === 401) {
        return "Su sesión ha vencido o no tiene autorización.";
    }

    if (response?.status === 403) {
        return "No tiene permisos para realizar esta operación.";
    }

    if (response?.status === 404) {
        return "No se encontró el registro solicitado.";
    }

    if (response?.status === 500) {
        return "Ocurrió un error interno en el servidor.";
    }

    return mensajeOriginal || mensajePredeterminado;
};

api.interceptors.request.use(
    async config => {
        const TOKEN = localStorage.getItem('SECURE');

        if (TOKEN) {
            config.headers.set({
                'Authorization': `Bearer ${TOKEN}`
            });
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

async function getData(props: TypeUtilities) {
    const responseData = crearResponseData();

    return await api.get(props.url)
        .then(response => {
            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.data = response.data;
            responseData.status = response.status;

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al obtener los datos"
            );

            return responseData;
        });
}

async function getSingleData(props: TypeUtilities) {
    const responseData = crearResponseData();

    return await api.get(props.url)
        .then(response => {
            const dataArray = response.data;

            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.singleData = dataArray[0];
            responseData.status = response.status;

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al obtener el registro"
            );

            return responseData;
        });
}

async function saveData(props: TypeUtilities) {
    const responseData = crearResponseData();
    const { data } = props;

    return await api.post(props.url, data)
        .then(response => {
            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.data = response.data;
            responseData.status = response.status;

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al guardar los datos"
            );

            return responseData;
        });
}

async function updateData(props: TypeUtilities) {
    const responseData = crearResponseData();

    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }

    const { data } = props;

    return await api.put(props.url, data)
        .then(response => {
            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.data = response.data;
            responseData.status = response.status;

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al actualizar los datos"
            );

            return responseData;
        });
}

async function deleteData(props: TypeUtilities) {
    const responseData = crearResponseData();

    return await api.delete(props.url)
        .then(response => {
            responseData.data = response.data;
            responseData.status = response.status;

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al eliminar los datos"
            );

            return responseData;
        });
}

async function signUp(props: TypeUtilities) {
    const responseData = crearResponseData();
    const { data } = props;

    return await api.post(props.url, data)
        .then(response => {
            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.data = response.data;
            responseData.status = response.status;

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al registrar el usuario"
            );

            return responseData;
        });
}

async function LogIn(props: TypeUtilities) {
    const responseData = crearResponseData();

    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }

    delete api.defaults.headers.common['Authorization'];

    const { data, url } = props;

    return await api.post(url, data)
        .then(response => {
            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.singleData = response.data;
            responseData.status = response.status;

            localStorage.setItem(
                'SECURE',
                responseData.singleData["token"]
            );

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error al iniciar sesión"
            );

            return responseData;
        });
}

async function LogOut() {
    localStorage.clear();
}

async function checkUser() {
    const responseData = crearResponseData();

    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }

    return await api.get('/user/whoami')
        .then(response => {
            if (response.status === 200) {
                responseData.data = response.data;
                responseData.status = response.status;

                return responseData;
            }

            responseData.error.code = 500;
            responseData.error.message = "Error de autenticación";

            return responseData;
        })
        .catch(error => {
            const response = error?.response;

            responseData.error.code = response?.status || 503;
            responseData.error.message = obtenerMensajeError(
                error,
                "Error de autenticación"
            );

            return responseData;
        });
}

function getToken() {
    const tokenStored = localStorage.getItem('SECURE');

    if (!isEmpty(tokenStored)) {
        return true;
    } else {
        return false;
    }
}

export {
    getData,
    getSingleData,
    saveData,
    deleteData,
    updateData,
    LogIn,
    checkUser,
    getToken,
    LogOut,
    signUp
};