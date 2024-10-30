//Interfaces
import { FastifyRequest, FastifyReply } from "fastify";

//Services
import { userLoginService, userRegisterService } from "./user.service";

export const userRegister = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const { status, result } = await userRegisterService(request);
        return reply.code(status).send(result);
    } catch (error) {
        return reply.code(500).send({ error: "Ocurrió un error" });
    }
}

export const userLogin = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const { status, result } = await userLoginService(request);
        return reply.code(status).send(result);
    } catch (error) {
        return reply.code(500).send({ error: "Ocurrió un error" });
    }
}