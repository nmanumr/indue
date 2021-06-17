import {Document, model, Model, Schema, Types} from "mongoose";
import {WalletDocument} from "./Wallet";
import {CategoryDocument} from "./Category";
import {User} from "./User";
import {WalletStateDocument} from "./WalletState";

/*----------------
 * Types
 *----------------*/

export interface Transaction {
  wallet: Types.ObjectId | WalletDocument;
  walletState: Types.ObjectId | WalletStateDocument;
  category: Types.ObjectId | CategoryDocument;
  subCategory: string;
  amount: number;
}

interface TransactionBaseDocument extends Transaction, Document {
}

export interface TransactionDocument extends TransactionBaseDocument {
  wallet: WalletDocument["_id"];
  walletState: WalletStateDocument["_id"];
  category: CategoryDocument["_id"];
}

export interface TransactionPopulatedDocument extends TransactionBaseDocument {
  wallet: WalletDocument;
  walletState: WalletStateDocument;
  category: CategoryDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<User>({
  wallet: {type: Schema.Types.ObjectId, ref: "Wallet", required: true},
  walletState: {type: Schema.Types.ObjectId, ref: "WalletState", required: true},
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  subCategory: {type: String, default: () => '_default'},
  amount: Number,
});

/*----------------
 * Export
 *----------------*/

export let TransactionModel: Model<TransactionDocument>;
try {
  TransactionModel = model("Transaction");
} catch {
  TransactionModel = model("Transaction", schema);
}

