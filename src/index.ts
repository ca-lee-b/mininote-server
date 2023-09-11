import { bootstrap } from "./server";
import { config } from "dotenv"
config();

const PORT = process.env.PORT ?? 8080
bootstrap().listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})