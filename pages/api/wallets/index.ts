import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {getNearestWalletState, Wallet, WalletModel} from "models";
import {getSession} from "next-auth/client";
import all from "middlewares/all";
import {Session} from "next-auth";


async function getWallets(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let wallets = await WalletModel.find({owner: (session.user as any)?.uid});

  let walletsWithState = await Promise.all(wallets.map(async (wallet: any) => {
    let state = await getNearestWalletState(new Date(), wallet._id);
    wallet._doc.amount = state ? state.balance : 0
    return wallet;
  }))

  res.send(walletsWithState);
}


async function addWallet(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let data: Omit<Wallet, 'owner'> = req.body;

  let wallet = await WalletModel.create({
    name: data.name,
    owner: (session.user as any)?.uid,
    updatedAt: new Date(),
  });

  res.status(201).send(wallet);
}


export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .get(getWallets)
  .post(addWallet);
