import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart"
import { randomUUID } from "node:crypto"
import path from "node:path";
import fs from "node:fs"; 
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance){
  app.register(fastifyMultipart, {
    limits:{
      fileSize: 1_048_576 * 25, //25mb
    }
  })

  app.post('/videos', async (request, reply) => {
    const data = await request.file()

    if(!data){
      return reply.status(400).send({ error: 'Missing file input.'})
    }

    const extension = path.extname(data.filename)

    if(extension !== '.mp3'){
      return reply.status(400).send({ error: 'Invalid input type, please upload a MP3.'})
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

    // Certificar-se de que o diretório existe antes de escrever o arquivo.
    try {
      fs.mkdirSync(path.dirname(uploadDestination), { recursive: true });

      await pump(data.file, fs.createWriteStream(uploadDestination))
      
    } catch (err) {
      if (err.code !== 'EEXIST') {
        return reply.status(500).send({ error: 'Error creating upload directory.' });
      }
    }

    const video = await prisma.video.create({
      data: {
        name:data.filename,
        path:uploadDestination
      }
    })

    return {
      video,
    }
  })
}