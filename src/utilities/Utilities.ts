import type { TypeUtilities, TypeGenericResponse } from "./TypeUtilities";
import { INIT } from "./TypeUtilities";
import axios from "axios";
import { config } from "./axiosConfig";
import { isEmpty } from "lodash";
const api = axios.create(config);

// Crea un objeto de respuesta NUEVO e independiente en cada llamada,
// para evitar que peticiones en paralelo se pisen entre sí.
function crearRespuestaVacia(): TypeGenericResponse {
    return {
        ...INIT,
        error: { ...INIT.error },
    };
}

api.interceptors.request.use(
    async config => {
        const TOKEN = localStorage.getItem('SECURE')
        if (TOKEN) {
            config.headers.set({ 'Authorization': `Bearer ${TOKEN}` })
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

async function getData(props: TypeUtilities) {
    return await api.get(props.url).then(response => {
        const responseData = crearRespuestaVacia();
        if (response['status'] === 401) {
            responseData.status = 401;
            return responseData
        };
        responseData.data = response.data;
        responseData.status = response.status;
        return responseData;
    }).catch(error => {
        const responseData = crearRespuestaVacia();
        const response = error["response"];
        if (response["status"] === 401 || response["status"] === 404) {
            responseData.error.code = parseInt(response["status"], 10);
            responseData.error.message = response["statusText"];
            return responseData;
        }
        responseData.error.code = 503;
        responseData.error.message = error["statusText"];
        return responseData;
    });
};

async function getSingleData(props: TypeUtilities) {
    return await api.get(props.url).then(response => {
        const responseData = crearRespuestaVacia();
        const dataArray = response.data;
        if (response['status'] === 401) {
            responseData.status = 401;
            return responseData
        };
        responseData.singleData = dataArray[0];
        responseData.status = response.status;
        return responseData;
    }).catch(error => {
        const responseData = crearRespuestaVacia();
        const response = error["response"];
        if (response["status"] === 401 || response["status"] === 404) {
            responseData.error.code = parseInt(response["status"], 10);
            responseData.error.message = response["statusText"];
            return responseData;
        }
        responseData.error.code = 503;
        responseData.error.message = error["statusText"];
        return responseData;
    });
};

async function saveData(props: TypeUtilities) {
    const { data } = props;
    return await api.post(props.url, data)
        .then(response => {
            const responseData = crearRespuestaVacia();
            if (response['status'] === 401) {
                responseData.status = 401;
                return responseData
            };
            responseData.data = response.data;
            responseData.status = response.status;
            return responseData;
        })
        .catch(error => {
            const responseData = crearRespuestaVacia();
            const response = error["response"];
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = parseInt(response["status"], 10);
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["statusText"];
            return responseData;
        });
}

async function updateData(props: TypeUtilities) {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    const { data } = props;
    return await api.put(props.url, data)
        .then(response => {
            const responseData = crearRespuestaVacia();
            if (response['status'] === 401) {
                responseData.status = 401;
                return responseData
            };
            responseData.data = response.data;
            responseData.status = response.status;
            return responseData;
        })
        .catch(error => {
            const responseData = crearRespuestaVacia();
            const response = error["response"];
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = parseInt(response["status"], 10);
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["statusText"];
            return responseData;
        });
}

async function deleteData(props: TypeUtilities) {
    return await api.delete(props.url)
        .then(response => {
            const responseData = crearRespuestaVacia();
            if (response['status'] === 200) {
                responseData.status = 200;
                return responseData
            };
            responseData.data = response.data;
            responseData.status = response.status;
            return responseData;
        })
        .catch(error => {
            const responseData = crearRespuestaVacia();
            const response = error["response"];
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = parseInt(response["status"], 10);
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["statusText"];
            return responseData;
        });
}

async function signUp(props: TypeUtilities) {
    const { data } = props;
    return await api.post(props.url, data)
        .then(response => {
            const responseData = crearRespuestaVacia();
            if (response['status'] === 401) {
                responseData.status = 401;
                return responseData
            };
            responseData.data = response.data;
            responseData.status = response.status;
            return responseData;
        })
        .catch(error => {
            const responseData = crearRespuestaVacia();
            const response = error["response"];
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = parseInt(response["status"], 10);
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["statusText"];
            return responseData;
        });
}

async function LogIn(props: TypeUtilities) {

    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }

    delete api.defaults.headers.common['Authorization'];

    const { data, url } = props;

    return await api.post(url, data)
        .then(response => {

            const responseData = crearRespuestaVacia();

            if (response.status === 401) {
                responseData.status = 401;
                return responseData;
            }

            responseData.data = response.data;
            responseData.status = response.status;

            localStorage.setItem(
                "SECURE",
                response.data.token
            );

            return responseData;

        })
        .catch(error => {

            const responseData = crearRespuestaVacia();
            const response = error.response;

            if (response?.status === 401 || response?.status === 404) {

                responseData.error.code = response.status;
                responseData.error.message = response.statusText;

                return responseData;

            }

            responseData.error.code = 503;
            responseData.error.message = error.message;

            return responseData;

        });

}

async function LogOut() {
    localStorage.clear();
}

async function checkUser() {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    return await api.get('/user/whoami')
        .then(response => {
            const responseData = crearRespuestaVacia();
            if (response.status === 200) {
                responseData.data = response.data;
                responseData.status = response.status;
                return responseData;
            } else {
                responseData.error.code = 500;
                responseData.error.message = "Error de Autenticacion";
                return responseData
            }
        }).catch(error => {
            const responseData = crearRespuestaVacia();
            const response = error["response"]
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = response["status"];
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["message"];
            return responseData;
        })
}

function getToken() {
    const tokenStored = localStorage.getItem('SECURE');
    if (!isEmpty(tokenStored)) {
        return true
    } else {
        return false
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