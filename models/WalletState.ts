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
 * Static Methods
 *----------------*/

export function getNearestWalletState(date: Date, walletId: string): Promise<WalletStateDocument | null> {
  return WalletStateModel
    .findOne({date: {$lte: date}})
    .sort({field: 'date', test: 'desc'})
    .exec();
}

export async function updateOrCreateWalletState(
  date: Date,
  walletId: string,
  newBalance: number
): Promise<WalletStateDocument> {
  let walletState = await WalletStateModel.findOne({date, wallet: walletId});
  if (walletState) {
    if (newBalance > 0) {
      await walletState.update({balance: walletState.balance + newBalance});
    }
    return walletState;
  } else {
    let previousState = await getNearestWalletState(date, walletId);
    let lastBalance = previousState ? previousState.balance : 0;

    return WalletStateModel.create({
      date,
      wallet: walletId,
      balance: lastBalance + newBalance,
    });
  }
}

/*----------------
 * Export
 *----------------*/

export let WalletStateModel: Model<WalletStateDocument>;
try {
  WalletStateModel = model("WalletState");
} catch {
  WalletStateModel = model("WalletState", schema);
}
