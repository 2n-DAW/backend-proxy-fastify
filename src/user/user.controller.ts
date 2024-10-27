//Interfaces
import { FastifyRequest, FastifyReply } from "fastify";

//Services
import { userRegisterService } from "./user.service";

export const userRegister = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
        const { status, result } = await userRegisterService(request);
        return reply.code(status).send(result);
    } catch (error) {
        return reply.code(500).send({ error: "Ocurrió un error" });
    }
}