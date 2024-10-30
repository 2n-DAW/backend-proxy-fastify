//Utils
import axios, { AxiosResponse } from "axios";
import { resp } from "../shared/utils/utils";

//Interfaces
import { FastifyRequest } from "fastify";
import { IResp } from "../shared/interfaces/respUtils.interface";
import { IUserRegister } from "./dto/userRegister.interface";




export const userRegisterService = async (request: FastifyRequest): Promise<IResp> => {
    const { user, userType } = request.body as IUserRegister;
    let user_resp = {} as AxiosResponse;

    try {
        //!Cambiar en todos los servidores el error de la respuesta por duplicidad por el 500
        await axios.post(`${process.env.SERVER_CLIENT}/register`, { user, userType });

        switch (userType) {
            case 'client':
                user_resp = await axios.post(`${process.env.SERVER_CLIENT}/user`, { user });
                break;
            case 'company':
                user_resp = await axios.post(`${process.env.SERVER_COMPANY}/user`, { user });
                break;
            case 'recruiter':
                user_resp = await axios.post(`${process.env.SERVER_RECRUITER}/user`, { user });
                break;
            default:
                throw new Error('Tipo de usuario inválido');
        }

        return resp(200, user_resp.data);

    } catch (error) {
        console.log("error", error);
        if (axios.isAxiosError(error)) {
            let status = error.response?.status;
            const data = error.response?.data;
            const url = error.config?.url;
            switch (status) {
                case 500:
                    switch (url) {
                        case `${process.env.SERVER_CLIENT}/register`:
                            return resp(status, { message: 'El correo o el usuraio ya existe.' });
                        case `${process.env.SERVER_CLIENT}/user`:
                        case `${process.env.SERVER_COMPANY}/user`:
                        case `${process.env.SERVER_REGISTER}/user`:
                            axios.delete(`${process.env.SERVER_CLIENT}/user/${user.username}`);
                            return resp(status, { message: 'El correo o el usuraio ya existe.' });

                        default:
                            return resp(status, { message: 'El correo electrónico ya está en uso en un servidor desconocido.' });
                    }

                default:
                    status = status || 500;
                    return resp(status, { message: data.message, server: url });
            }
        } else {
            console.error('Error inesperado:', error);
            return resp(500, { message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.' });
        }
    }
}


export const userLoginService = async (request: FastifyRequest): Promise<IResp> => {
    const { user } = request.body as IUserRegister;
    let user_resp = {} as AxiosResponse;

    try {
        const resp_user_type = await axios.post(`${process.env.SERVER_CLIENT}/user/type`, { user });
        const user_type = resp_user_type.data.user.userType;
        console.log("user_type", user_type);

        switch (user_type) {
            case 'client':
                user_resp = await axios.post(`${process.env.SERVER_CLIENT}/user/login`, { user });
                break;
            case 'company':
                user_resp = await axios.post(`${process.env.SERVER_COMPANY}/user/login`, { user });
                break;
            case 'recruiter':
                user_resp = await axios.post(`${process.env.SERVER_RECRUITER}/user/login`, { user });
                break;
            default:
                throw new Error('Tipo de usuario inválido');
        }
        return resp(200, { user: user_resp.data, type: user_type });

    } catch (error) {
        return resp(500, { message: 'Ocurrió un error inesperado.' });
    }
}