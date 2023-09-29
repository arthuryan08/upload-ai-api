import { fastify } from 'fastify';
import { prisma } from './lib/prisma';
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)

app.listen({ 
  port: 3333,
}).then(() => {
  console.log('HTTP server is running on port 3333!');
})