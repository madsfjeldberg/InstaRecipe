import 'dotenv/config'
import { createClient } from "redis";

const redis = await createClient({
    url: process.env.REDIS_URL_PROD || 'redis://127.0.0.1:6379'
  })
.on("error", (error) => console.error("Error creating redis client", error))
.connect();

export default redis;