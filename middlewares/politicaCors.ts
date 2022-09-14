import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import NextCors from "nextjs-cors";

export const politicaCors = (handler: NextApiHandler) => 
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        optionsSuccessStatus: 200,
      })

      return handler(req, res)
    } catch (e) {
      console.log(e)
      return res.status(400).json({ erro: 'Ocorreu um erro ao tratar a politica de CORS' })
    }
  }
