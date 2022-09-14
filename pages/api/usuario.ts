import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { politicaCors } from "../../middlewares/politicaCors";


const handler = nc()
  .use(upload.single('file'))
  .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req?.query
      const usuario = await UsuarioModel.findById(userId)

      if (!usuario) {
        return res.status(400).json({ erro: 'Usuário não autenticado' })
      }

      const { nome } = req.body
      if (nome && nome.length > 2) {
        usuario.nome = nome
      }

      const { file } = req
      if (file && file.originalmente) {

        const image = await uploadImagemCosmic(req)

        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url
        }
      }

      await UsuarioModel
        .findByIdAndUpdate({ _id: usuario._id }, usuario)

      return res.status(200).json({ msg: 'Usuário alterado com sucesso!' })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ erro: 'Não foi possível alterar imagem.' })
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
      const { userId } = req?.query
      const usuario = await UsuarioModel.findById(userId)
      console.log('usuario', usuario)
      usuario.senha = null
      return res.status(200).json(usuario)
    } catch (e) {
      console.log(e);
    }

    return res.status(400).json({ msg: 'Não foi possivel obter dados do usuário' })
  })

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCors(validarTokenJWT(connectMongoDB(handler)))