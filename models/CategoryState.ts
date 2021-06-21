import {Document, model, Model, Schema, Types} from "mongoose";
import {
  ExpenseAnchor,
  ExpenseAnchorDocument,
  getNearestExpenseAnchor,
  getOrCreateMonthAnchor,
  isCurrentAnchor
} from "./ExpenseAnchor";
import {User} from "./User";
import {CategoryDocument, CategoryModel} from "./Category";

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
 * Static Methods
 *----------------*/

export async function getNearestCategoryState(
  date: Date,
  categoryId: string,
  subCategory: string,
  ownerId: string,
): Promise<CategoryStatePopulatedDocument | null> {
  let expenseAnchor = await getNearestExpenseAnchor(date, ownerId);
  if (!expenseAnchor) {
    return null;
  }

  return CategoryStateModel
    .findOne({category: categoryId, subCategory, expenseAnchor})
    .populate('expenseAnchor')
    .exec();
}

export async function updateOrCreateCategoryState(
  date: Date,
  categoryId: string,
  subCategory: string,
  newExpense: number,
): Promise<CategoryStateDocument> {
  let category = await CategoryModel.findOne({_id: categoryId});
  let state = await getNearestCategoryState(date, categoryId, subCategory, category?.owner as string);

  if (state && isCurrentAnchor(state.expenseAnchor)) {
    if (newExpense !== 0) {
      await state.update({expense: state.expense + newExpense});
    }
    return state;
  }

  let expenseAnchor = await getOrCreateMonthAnchor(date, category?.owner as string);
  if (state) {
    return await CategoryStateModel.create({
      expenseAnchor,
      category: categoryId,
      subCategory,
      budget: state.budget,
      expense: newExpense,
      initialBalance: Math.max(state.budget - state.expense, 0),
    });
  } else {
    return await CategoryStateModel.create({
      expenseAnchor,
      category: categoryId,
      subCategory,
      budget: 0,
      expense: newExpense,
      initialBalance: 0,
    });
  }
}

/*----------------
 * Export
 *----------------*/

export let CategoryStateModel: Model<CategoryStateDocument>;
try {
  CategoryStateModel = model("CategoryState");
} catch {
  CategoryStateModel = model("CategoryState", schema);
}
