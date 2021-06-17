import {Document, model, Model, Schema, Types} from "mongoose";
import {WalletDocument} from "./Wallet";
import {User} from "./User";

/*----------------
 * Types
 *----------------*/

export interface WalletState {
  wallet: Types.ObjectId | WalletDocument;
  date: Date;
  balance: number;
}

interface WalletStateBaseDocument extends WalletState, Document {
}

export interface WalletStateDocument extends WalletStateBaseDocument {
  wallet: WalletDocument["_id"];
}

export interface WalletStatePopulatedDocument extends WalletStateBaseDocument {
  wallet: WalletDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<User>({
  wallet: {type: Schema.Types.ObjectId, ref: "Wallet", required: true},
  date: {type: Date, required: true},
  balance: {type: Number, required: true},
});

/*----------------
 * Export
 *----------------*/

export let WalletStateModel: Model<WalletStateDocument>;
try {
  WalletStateModel = model("WalletState");
} catch {
  WalletStateModel = model("WalletState", schema);
}
