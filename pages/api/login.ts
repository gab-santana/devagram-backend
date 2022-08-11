import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
// eslint-disable-next-line import/no-anonymous-default-export
const endpointLogin = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const { login, password } = req.body

    if (login === 'teste' && password === 'teste') {
      return res.status(200).json({ message: 'Usuario autenticado com sucesso' })
    }
    return res.status(405).json({ message: 'Usuário e/ou senha inválido' })

  }
  return res.status(405).json({ message: 'Method not allowed' })
}

export default connectMongoDB(endpointLogin)