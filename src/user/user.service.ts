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
        const user_reso = await axios.post(`${process.env.SERVER_CLIENT}/register`, { user, userType });
        const userId = user_reso.data.user._id;
        console.log(user_reso.data.user._id);
        switch (userType) {
            case 'client':
                user_resp = await axios.post(`${process.env.SERVER_CLIENT}/user`, { user: { ...user, userId } });
                break;
            case 'company':
                user_resp = await axios.post(`${process.env.SERVER_COMPANY}/user`, { user: { ...user, userId } });
                break;
            case 'recruiter':
                user_resp = await axios.post(`${process.env.SERVER_RECRUITER}/user`, { user: { ...user, userId } });
                break;
            default:
                throw new Error('Tipo de usuario inválido');
        }

        return resp(200, user_resp.data);

    } catch (error) {
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