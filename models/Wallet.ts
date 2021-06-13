import {Document, Model, model, Schema, Types} from "mongoose";
import {UserDocument} from "./User";

/*----------------
 * Types
 *----------------*/

export interface Wallet {
  name: string;
  owner: Types.ObjectId | UserDocument;
  updatedAt: Date;
  deletedAt?: Date;
}

interface WalletBaseDocument extends Wallet, Document {
  getWalletState(date?: Date): void;
}

export interface WalletDocument extends WalletBaseDocument {
  company: UserDocument["_id"];
}

export interface WalletPopulatedDocument extends WalletBaseDocument {
  company: UserDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<Wallet>({
  name: {type: String, required: true},
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  updatedAt: {type: Date, required: true},
  deletedAt: Date
});

schema.index({name: 1, owner: 1, deletedAt: 1}, {unique: true});

/*----------------
 * Methods
 *----------------*/

schema.methods.getWalletState = function (this: WalletDocument, date?: Date) {
  console.log("HERE");
}

/*----------------
 * Middlewares
 *----------------*/

// set updated at on save
schema.pre<WalletDocument>('save', function (next) {
  if (this.isNew || this.isModified()) {
    this.updatedAt = new Date();
  }

  next();
});

/*----------------
 * Export
 *----------------*/

export let WalletModel: Model<WalletDocument>;
try {
  WalletModel = model("Wallet");
} catch {
  WalletModel = model("Wallet", schema);
}
