import Fastify from "fastify";
import cors from "@fastify/cors";
const dotenv = require("dotenv");
dotenv.config();

const app = Fastify({ logger: true });
app.register(cors, {
    origin: (origin, callback) => {
        const urls_allowed = process.env.CORS_URLS!.split(",");
        if (!origin || urls_allowed.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"), false);
        }
    }
});


const start = async () => {
    try {
        const port = parseInt(process.env.PORT!);
        await app.listen({ port });
        app.log.info(`Server running at http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();