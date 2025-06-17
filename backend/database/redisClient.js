import 'dotenv/config'

import { createClient } from 'redis';

const redis = await createClient({
  password: process.env.REDIS_DEV_PASSWORD,
  socket: {
    host: process.env.REDIS_DEV_HOST,
    port: process.env.REDIS_DEV_PORT
  }
})
.connect()
.catch(console.error);

export default redis;
