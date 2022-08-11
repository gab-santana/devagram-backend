import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

const dia = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    data: moment().format('DD/MM/yyyy HH:mm:ss')
  })
}

export default dia