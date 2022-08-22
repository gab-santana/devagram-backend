import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from 'jsonwebtoken';
import { LoginResposta } from "../../types/LoginResposta";

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
  const { MINHA_CHAVE_JWT } = process.env

  if (!MINHA_CHAVE_JWT) {
    return res.status(500).json({ erro: 'ENV JWT não informado' })
  }

  if (req.method === 'POST') {
    const { login, senha } = req.body

    const usuariosEncontrados = await UsuarioModel.find({ email: login, senha: md5(senha) })

    if (usuariosEncontrados && usuariosEncontrados.length > 0) {
      const usuarioEncontrado = usuariosEncontrados[0]

      const token = jwt.sign({ id: usuarioEncontrado._id }, MINHA_CHAVE_JWT)
      return res.status(200).json({
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        token
      })
    }
    return res.status(405).json({ erro: 'Usuário e/ou senha inválido' })

  }
  return res.status(405).json({ erro: 'Method not allowed' })
}

export default connectMongoDB(endpointLogin)