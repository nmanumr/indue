import {NextApiRequest, NextApiResponse} from "next";
import {NextHandler} from "next-connect";
import {getSession} from "next-auth/client";

export default async function session(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  const session = await getSession({req});
  if (!session) {
    res.status(401).send({'message': 'Unauthorized'});
    return;
  }
  return next();
}
