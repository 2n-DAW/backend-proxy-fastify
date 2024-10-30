import { IResp } from "../interfaces/respUtils.interface";

export const respMsg = (status: number, result: object) => {
    return {
        status: status,
        result: { message: result }
    };

}

export const resp = (status: number, result: object): IResp => {
    return {
        status: status,
        result: result
    };

}