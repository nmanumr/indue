import {Model, model, Schema, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

/*----------------
 * Types
 *----------------*/

export interface User {
  name: string;
  email: string;
  password: string;
  image?: string;
  emailVerified: boolean;
}

export interface UserDocument extends User, Document {
  validatePassword(password: string): Promise<Boolean>;
  getExposable(): Omit<User, 'password'>;
}

/*----------------
 * Base Schema
 *----------------*/

const schema = new Schema<User>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true, dropDups: true},
  password: {type: String, required: true},
  image: String,
  emailVerified: Boolean,
});


/*----------------
 * Methods
 *----------------*/

schema.methods.validatePassword = function (password): Promise<Boolean> {
  return new Promise((res) => {
    bcrypt.compare(password, this.password, function (error, isMatch) {
      return res(error ? false : isMatch);
    })
  })
}

schema.methods.getExposable = function (): Omit<User, 'password'> {
  return {
    name: this.name,
    email: this.email,
    image: this.image,
    emailVerified: this.emailVerified,
  }
}

/*----------------
 * Middlewares
 *----------------*/

schema.pre<UserDocument>("save", function (next) {
  const user = this;

  if (!this.isModified("password") && !this.isNew) {
    return next();
  }

  bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }

      user.password = hash;
      next();
    })
  })
})


/*----------------
 * Export
 *----------------*/

export let UserModel: Model<UserDocument>;
try {
  UserModel = model("User");
} catch {
  UserModel = model("User", schema);
}
