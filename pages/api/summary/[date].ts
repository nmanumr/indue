import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {CategoryModel, getNearestCategoryState} from "models";
import {getSession} from "next-auth/client";
import all from "middlewares/all";
import {Session} from "next-auth";

async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let {date: dateParam} = req.query;
  let date = new Date(dateParam as string);
  let ownerId: string = (session.user as any)?.uid;

  let categories = await CategoryModel.find({owner: ownerId});

  let summary = await Promise.all(categories.map(async (category) => {
    let subCategoryStates = [];
    for (let subCategory of category.subCategories) {
      let state = await getNearestCategoryState(date, category._id, subCategory, ownerId);
      subCategoryStates.push({
        name: subCategory,
        state: {
          budgeted: state?.budget ?? 0,
          expense: state?.expense ?? 0,
          balance: (state?.budget ?? 0) - (state?.expense ?? 0),
        }
      });
    }

    (category as any)._doc.subCategories = subCategoryStates;
    (category as any)._doc.state = {
      budgeted: subCategoryStates.reduce((a, v) => a + v.state.budgeted, 0),
      expense: subCategoryStates.reduce((a, v) => a + v.state.expense, 0),
      balance: subCategoryStates.reduce((a, v) => a + v.state.balance, 0),
    };

    return category;
  }));

  res.send({
    month: dateParam,
    categories: summary,
    state: {
      budgeted: summary.reduce((a, v: any) => a + v._doc.state.budgeted, 0),
      expense: summary.reduce((a, v: any) => a + v._doc.state.expense, 0),
      balance: summary.reduce((a, v: any) => a + v._doc.state.balance, 0),
    }
  });
}

export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .get(getCategories)
