import {NextApiRequest, NextApiResponse} from "next";
import nc from "next-connect";
import {Category, CategoryModel} from "models";
import {getSession} from "next-auth/client";
import all from "middlewares/all";
import {Session} from "next-auth";


async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  res.send(await CategoryModel.find({owner: (session.user as any)?.uid}));
}


async function addCategory(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({req}) as Session;
  let data: Omit<Category, 'owner'> = req.body;

  let category = await CategoryModel.create({
    owner: (session.user as any)?.uid,
    name: data.name,
    color: data.color,
    subCategories: data.subCategories,
  });

  res.status(201).send(category);
}


export default nc<NextApiRequest, NextApiResponse>()
  .use(all)
  .get(getCategories)
  .post(addCategory);
