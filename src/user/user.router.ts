//Interfaces
import { FastifyInstance } from "fastify";

//Controllers
import { userRegister } from "./user.controller";


const userRoutes = async (routes: FastifyInstance): Promise<void> => {
    routes.post("/user", userRegister);
};

export default userRoutes;

