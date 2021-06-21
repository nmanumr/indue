import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {Transaction, TransactionModel, WalletModel} from "models";
import {getSession} from "next-auth/client";
import all from "middlewares/all";
import {Session} from "next-auth";


async function getTransactions(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let wallets = await WalletModel
    .find({owner: (session.user as any)?.uid})
    .populate('');

  let data = await TransactionModel
    .find({wallet: {$in: wallets.map(w => w._id)}})
    .populate('category')
    .populate('wallet');

  res.send(data);
}


async function addTransaction(req: NextApiRequest, res: NextApiResponse) {
  let data: Omit<Transaction, 'walletState'> = req.body;

  let [category, ...subCategory] = data.category.toString().split('/');
  let wallet = await TransactionModel.create({
    wallet: data.wallet,
    category: category,
    subCategory: subCategory.join('/'),
    amount: (data as any).type === 'expense' ? -data.amount : data.amount,
  });

  return res.status(201).send(wallet);
}


export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .get(getTransactions)
  .post(addTransaction);
