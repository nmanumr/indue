import {Document, model, Model, Schema, Types} from "mongoose";
import {ExpenseAnchor, ExpenseAnchorDocument} from "./ExpenseAnchor";
import {User} from "./User";
import {CategoryDocument} from "./Category";

/*----------------
 * Types
 *----------------*/

export interface CategoryState {
  expenseAnchor: Types.ObjectId | ExpenseAnchor;
  category: Types.ObjectId | CategoryDocument;
  subcategory: string;
  budget: number;
  expense: number;
  initialBalance: number;
}

interface CategoryStateBaseDocument extends CategoryState, Document {
}

export interface CategoryStateDocument extends CategoryStateBaseDocument {
  expenseAnchor: ExpenseAnchorDocument["_id"];
}

export interface CategoryStatePopulatedDocument extends CategoryStateBaseDocument {
  expenseAnchor: ExpenseAnchorDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<User>({
  expenseAnchor: {type: Schema.Types.ObjectId, ref: "ExpenseAnchor", required: true},
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  subcategory: {type: String, default: () => '_default'},
  budget: {type: Number, default: () => 0},
  expense: {type: Number, default: () => 0},
  initialBalance: {type: Number, default: () => 0},
});

/*----------------
 * Export
 *----------------*/

export let CategoryStateModel: Model<CategoryStateDocument>;
try {
  CategoryStateModel = model("CategoryState");
} catch {
  CategoryStateModel = model("CategoryState", schema);
}
