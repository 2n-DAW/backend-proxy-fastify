//Interfaces
import { FastifyInstance } from "fastify";

//Controllers
import { userLogin, userRegister } from "./user.controller";


const userRoutes = async (routes: FastifyInstance): Promise<void> => {
    routes.post("/user", userRegister);
    routes.post("/user/login", userLogin)
};

export default userRoutes;

