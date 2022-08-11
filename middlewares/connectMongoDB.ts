import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export const connectMongoDB = (handler: NextApiHandler) =>
  async (req: NextApiRequest,
    res: NextApiResponse
  ) => {
    if (mongoose.connections[0].readyState) {
      return handler(req, res)
    }

    const { DB_CONEXAO_STRING } = process.env

    if (!DB_CONEXAO_STRING) {
      return res.status(500).json({ message: "Preencher ENV de configuração do não" })
    }
    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
    mongoose.connection.on('error', error => console.log('Ocorreu um erro ao conectar'))
    await mongoose.connect(DB_CONEXAO_STRING)

    return handler(req, res)

  }