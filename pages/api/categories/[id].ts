import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {updateOrCreateCategoryState} from "models";
import all from "middlewares/all";


async function updateBudget(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query;
  const {amount, month, subCategory}: {
    amount: string;
    subCategory: string;
    month: string;
  } = req.body;

  let state = await updateOrCreateCategoryState(new Date(month), id as string, subCategory, 0);

  await state.update({
    budget: +amount,
  })

  return res.status(200).send({message: "done!"});
}


export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .patch(updateBudget);
