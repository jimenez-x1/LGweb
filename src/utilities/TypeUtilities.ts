import type { Type as TypeError } from "../Api/namespaces/errorService";

export type TypeUtilities = {
    url: string;
    data?: Array<object> | object;
    key?: string;
}

export type TypeGenericResponse = {
    singleData: any;
    data: Array<object>;
    status: number;
    error: TypeError.ErrorSchema;
}

export const INIT: TypeGenericResponse = {
    singleData: {},
    data: [],
    error: {
        code: 0,
        message: ""
    },
    status: 0
};