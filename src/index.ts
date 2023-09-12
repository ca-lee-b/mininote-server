import { bootstrap, logger } from "./server";
import { config } from "dotenv"
config();

const PORT = process.env.PORT ?? 8080
bootstrap().listen(PORT, () => {
    logger.log("info", `listening on port ${PORT}`)
})