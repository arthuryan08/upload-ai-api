import { fastify } from 'fastify';

const app = fastify()

app.get('/', () => {
  return 'Hello world!'
})

app.listen({ 
  port: 3333,
}).then(() => {
  console.log('HTTP server is running on port 3333!');
})