import {Document, model, Model, Schema, Types} from "mongoose";
import {User, UserDocument} from "./User";
import {CategoryStateDocument} from "./CategoryState";

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
 * Export
 *----------------*/

export let ExpenseAnchorModel: Model<ExpenseAnchorDocument>;
try {
  ExpenseAnchorModel = model("ExpenseAnchor");
} catch {
  ExpenseAnchorModel = model("ExpenseAnchor", schema);
}
