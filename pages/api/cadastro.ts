import { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroUsuario } from "../../types/UsuarioRequisicao";
import { UsuarioModel } from "../../models/UsuarioModel";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import md5 from "md5";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import nc from 'next-connect'
import { politicaCors } from "../../middlewares/politicaCors";

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    const usuario = req.body as CadastroUsuario

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ erro: 'Nome inválido' })
    }

    if (!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')) {
      return res.status(400).json({ erro: 'O campo e-mail é obrigatório' })
    }

    if (!usuario.senha || usuario.senha.length < 4) {
      return res.status(400).json({ erro: 'Senha inválida' })
    }

    const image = await uploadImagemCosmic(req)

    const usuarioASerSalvo = {
      nome: usuario.nome,
      email: usuario.email,
      senha: md5(usuario.senha),
      avatar: image?.media?.url
    }

    const usuariosComMesmoEmail = await UsuarioModel.find({ email: usuario.email })

    if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
      return res.status(400).json({ erro: 'Já existe uma conta com esse e-mail' })
    }
    await UsuarioModel.create(usuarioASerSalvo)

    return res.status(200).json({ msg: 'Usuário cadastrado com sucesso!' })
  })
export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCors(connectMongoDB(handler))  