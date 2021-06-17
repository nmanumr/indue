import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {Wallet, WalletModel} from "models";
import {getSession} from "next-auth/client";
import all from "middlewares/all";
import {Session} from "next-auth";


async function getWallets(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  res.send(await WalletModel.find({owner: (session.user as any)?.uid}));
}


async function addWallet(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let data: Omit<Wallet, 'owner'> = req.body;

  let category = await WalletModel.create({
    name: data.name,
    owner: (session.user as any)?.uid,
    updatedAt: new Date(),
  });

  res.status(201).send(category);
}


export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .get(getWallets)
  .post(addWallet);
