import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { UsuarioModel } from "../../models/UsuarioModel";
import { SeguidorModel } from "../../models/SeguidorModel";

const seguirEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  try {
    if (req.method === 'PUT') {
      const { userId, id } = req?.query

      const usuarioLogado = await UsuarioModel.findById(userId)
      if (!usuarioLogado) {
        return res.status(400).json({ erro: 'Usuário logado não encontrado' })
      }
      const usuarioASerSeguido = await UsuarioModel.findById(id)
      if (!usuarioASerSeguido) {
        return res.status(400).json({ erro: 'Usuário a ser seguido não encontrado' })
      }

      const jaSigoEsseUsuario = await SeguidorModel.find({ usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id })

      if (jaSigoEsseUsuario && jaSigoEsseUsuario.length > 0) {
        jaSigoEsseUsuario.forEach(async (e: any) => await SeguidorModel.findByIdAndDelete({ _id: e._id }))
        usuarioLogado.seguindo--
        await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado)

        usuarioASerSeguido.seguidores--
        await UsuarioModel.findByIdAndUpdate({ _id: usuarioASerSeguido._id }, usuarioASerSeguido)
        return res.status(200).json({ erro: 'Deixou de seguir o usuário com sucesso' })
      } else {
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioSeguidoId: usuarioASerSeguido._id
        }
        await SeguidorModel.create(seguidor)

        usuarioLogado.seguindo++
        await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado)

        usuarioASerSeguido.seguidores++
        await UsuarioModel.findByIdAndUpdate({ _id: usuarioASerSeguido._id }, usuarioASerSeguido)

        return res.status(200).json({ msg: 'Usuario seguido com sucesso' })
      }
    }
    return res.status(405).json({ msg: 'Método não permitido' })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ erro: 'Não foi possível seguir/parar de seguir, tente novamente' })
  }

}


export default validarTokenJWT(connectMongoDB(seguirEndPoint))