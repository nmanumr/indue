import {Document, model, Model, Schema, Types} from "mongoose";
import {WalletDocument} from "./Wallet";
import {CategoryDocument} from "./Category";
import {updateOrCreateWalletState, WalletStateModel} from "./WalletState";
import {CategoryStateModel, updateOrCreateCategoryState} from "./CategoryState";

/*----------------
 * Types
 *----------------*/

export interface Transaction {
  wallet: Types.ObjectId | WalletDocument;
  category: Types.ObjectId | CategoryDocument;
  createdAt: Date
  subCategory: string;
  amount: number;
}

interface TransactionBaseDocument extends Transaction, Document {
}

export interface TransactionDocument extends TransactionBaseDocument {
  wallet: WalletDocument["_id"];
  category: CategoryDocument["_id"];
}

export interface TransactionPopulatedDocument extends TransactionBaseDocument {
  wallet: WalletDocument;
  category: CategoryDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<Transaction>({
  wallet: {type: Schema.Types.ObjectId, ref: "Wallet", required: true},
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  createdAt: {type: Date, required: true},
  subCategory: {type: String, default: () => '_default'},
  amount: Number,
});

/*----------------
 * Middlewares
 *----------------*/

schema.pre<TransactionDocument>("save", async function (next) {
  const transaction = this;
  if (this.isNew) {
    throw "you can't update a transaction";
  }

  let date = new Date(new Date().toDateString());

  await updateOrCreateWalletState(date, transaction.wallet, transaction.amount);
  await updateOrCreateCategoryState(date, transaction.category, transaction.subCategory, transaction.amount);

  return next();
})

/*----------------
 * Export
 *----------------*/

export let TransactionModel: Model<TransactionDocument>;
try {
  TransactionModel = model("Transaction");
} catch {
  TransactionModel = model("Transaction", schema);
}

