import { NextApiResponse, NextApiRequest } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
  try {
    if (req.method === 'GET') {
      if (req?.query.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id)

        if (!usuario) {
          return res.status(400).json({ erro: 'Usuario não encontrado' })
        }
        const publicacoes = await PublicacaoModel.find({ idUsuario: usuario._id })
          .sort({ data: -1 })
        return res.status(200).json(publicacoes)
      }

    }
    return res.status(405).json({ erro: 'Metodo informado não é válido' })
  } catch (e) {
    return res.status(400).json({ erro: 'Não foi possivel obter o feed' })

  }


}


export default validarTokenJWT(connectMongoDB(feedEndpoint))