import {Document, model, Model, Schema, Types} from "mongoose";
import {User, UserDocument} from "./User";
import {start} from "repl";

/*----------------
 * Types
 *----------------*/

export interface ExpenseAnchor {
  startDate: Date;
  endDate: Date;
  owner: Types.ObjectId | UserDocument;
}

interface ExpenseAnchorBaseDocument extends ExpenseAnchor, Document {
}

export interface ExpenseAnchorDocument extends ExpenseAnchorBaseDocument {
  owner: UserDocument["_id"];
}

export interface ExpenseAnchorPopulatedDocument extends ExpenseAnchorBaseDocument {
  owner: UserDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<User>({
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
});

schema.index({name: 1, startDate: 1, endDate: 1}, {unique: true});

/*----------------
 * Static Methods
 *----------------*/

export async function getOrCreateMonthAnchor(startDate: Date, ownerId: string): Promise<ExpenseAnchorDocument> {
  startDate = new Date(startDate.toDateString());
  let anchor = await ExpenseAnchorModel.findOne({startDate});
  if (anchor) {
    return anchor;
  }

  let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1);
  endDate.setDate(0);

  anchor = await ExpenseAnchorModel.create({startDate, endDate, owner: ownerId});
  return anchor as ExpenseAnchorDocument;
}

export async function getNearestExpenseAnchor(date: Date, ownerId: string) {
  let anchor = await ExpenseAnchorModel.findOne({
    startDate: {$gte: date},
    endDate: {$lte: date},
  });

  if (!anchor) {
    anchor = await ExpenseAnchorModel
      .findOne({endDate: {$lt: date}})
      .sort({field: 'endDate', test: 'desc'})
      .limit(1);
  }

  return anchor;
}

export function isCurrentAnchor(anchor: ExpenseAnchorDocument) {
  let date = new Date();
  return date >= anchor.startDate && date <= anchor.endDate;
}

/*----------------
 * Export
 *----------------*/

export let ExpenseAnchorModel: Model<ExpenseAnchorDocument>;
try {
  ExpenseAnchorModel = model("ExpenseAnchor");
} catch {
  ExpenseAnchorModel = model("ExpenseAnchor", schema);
}
