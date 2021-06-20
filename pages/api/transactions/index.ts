import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {Transaction, TransactionModel} from "models";
import {getSession} from "next-auth/client";
import all from "middlewares/all";
import {Session} from "next-auth";


async function getTransactions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  // let wallets = await WalletModel
  //   .find({owner: (session.user as any)?.uid})
  //   .populate('');

  let data = await TransactionModel
    .find()
    .populate('wallet')
    .where('wallet.owner', (session.user as any)?.uid).exec();

  res.send(data);
}


async function addTransaction(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let data: Omit<Transaction, 'walletState'> = req.body;

  let wallet = await TransactionModel.create({
    wallet: data.wallet,
    category: data.category,
    subCategory: data.subCategory,
    amount: data.amount,
  });

  res.status(201).send(wallet);
}


export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .get(getTransactions)
  .post(addTransaction);
