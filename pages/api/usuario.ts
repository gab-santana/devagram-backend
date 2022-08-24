import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/UsuarioModel";


const usuarioEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {

  try {
    const { userId } = req?.query

    const usuario = await UsuarioModel.findById(userId)
    usuario.senha = null
    return res.status(200).json(usuario)

  } catch (e) {

    console.log(e);
  }

  return res.status(400).json({ msg: 'Não foi possivel obter dados do usuário' })
}

export default validarTokenJWT(connectMongoDB(usuarioEndPoint))