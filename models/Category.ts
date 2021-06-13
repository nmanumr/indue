import {Document, model, Model, Schema, Types} from "mongoose";
import {User, UserDocument} from "./User";

/*----------------
 * Types
 *----------------*/

export interface Category {
  name: string;
  color?: string;
  owner: Types.ObjectId | UserDocument;
  subCategories: Array<string>;
}

interface CategoryBaseDocument extends Category, Document {
}

export interface CategoryDocument extends CategoryBaseDocument {
  owner: UserDocument["_id"];
}

export interface CategoryPopulatedDocument extends CategoryBaseDocument {
  owner: UserDocument;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<User>({
  name: {type: String, required: true},
  color: String,
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  subCategories: {type: Array, default: () => ['_default']},
});

schema.index({name: 1, owner: 1}, {unique: true});

/*----------------
 * Export
 *----------------*/

export let CategoryModel: Model<CategoryDocument>;
try {
  CategoryModel = model("Category");
} catch {
  CategoryModel = model("Category", schema);
}
