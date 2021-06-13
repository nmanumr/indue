import type {NextApiRequest, NextApiResponse} from 'next';
import {createSchema as S, TsjsonParser, Validated} from 'ts-json-validator';
import {dbConnect} from 'middlewares'
import {UserModel} from "models";

let schema = S({
  type: 'object',
  properties: {
    name: S({type: 'string'}),
    email: S({type: 'string', format: 'email'}),
    password: S({type: 'string'}),
  },
  required: ['name', 'email', 'password'],
});

let parser = new TsjsonParser(schema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send({
      message: "Method not allowed"
    });
  }

  if (!parser.validates(req.body)) {
    return res.status(400).send({
      message: "JSON validation failed",
      errors: parser.getErrors()
    });
  }

  await dbConnect();
  try {
    await UserModel.create(req.body as Validated<typeof schema>);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send({success: false, message: "Email already exists."});
    }
    return res.status(400).send({success: false, message: "Oops! Something went wrong."});
  }

  return res.status(201).send({success: true});
}
