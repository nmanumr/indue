import mongoose from "mongoose";
import {NextApiRequest, NextApiResponse} from "next";
import {NextHandler} from "next-connect";

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db;
  }

  return mongoose.connect(
    process.env.MONGODB_URI as string,
    {useNewUrlParser: true, useUnifiedTopology: true}
  );
}

export default async function database(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  await dbConnect();
  return next();
}
