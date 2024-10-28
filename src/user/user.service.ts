//Utils
import axios, { AxiosResponse } from "axios";
import { resp } from "../shared/utils/utils";

//Interfaces
import { FastifyRequest } from "fastify";
import { IResp } from "../shared/interfaces/respUtils.interface";
import { IUserRegister } from "./dto/userRegister.interface";




export const userRegisterService = async (request: FastifyRequest): Promise<IResp> => {
    const { user, user_type } = request.body as IUserRegister;
    let user_resp = {} as AxiosResponse;

    try {
        //!Cambiar en todos los servidores el error de la respuesta por duplicidad por el 409
        const userResponse = await axios.post(`${process.env.SERVER_CLIENT}/register`, user);
        const user_Id = userResponse.data.id;

        switch (user_type) {
            case 'userClient':
                user_resp = await axios.post(`${process.env.SERVER_CLIENT}/user`, { user: { ...user, user_Id } });
                break;
            case 'userCompany':
                user_resp = await axios.post(`${process.env.SERVER_COMPANY}/user`, { user: { ...user, user_Id } });
                break;
            case 'userRecruiter':
                user_resp = await axios.post(`${process.env.SERVER_RECRUITER}/user`, { user: { ...user, user_Id } });
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
                case 409:
                    switch (url) {
                        case `${process.env.SERVER_CLIENT}/register`:
                            return resp(status, { message: 'El correo electrónico ya está en uso.' });
                        case `${process.env.SERVER_CLIENT}/user`:
                        case `${process.env.SERVER_COMPANY}/user`:
                        case `${process.env.SERVER_REGISTER}/user`:
                            axios.delete(`${process.env.SERVER_CLIENT}/register/${user.email}`);
                            return resp(status, { message: 'El correo electrónico ya está en uso en el servidor COMPANY.' });

                        default:
                            return resp(status, { message: 'El correo electrónico ya está en uso en un servidor desconocido.' });
                    }

                default:
                    status ? status = status : status = 500;
                    return resp(status, { message: data.message, server: url });
            }
        } else {
            console.error('Error inesperado:', error);
            return resp(500, { message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.' });
        }
    }
}