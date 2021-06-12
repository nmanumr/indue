import {Model, model, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  emailVerified: boolean;
}

interface UserDocument extends User, Document {
  validatePassword(password: string): Promise<Boolean>;
}

const schema = new Schema<User>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true, dropDups: true},
  password: {type: String, required: true},
  avatar: String,
  emailVerified: Boolean,
});

schema.methods.validatePassword = function (password): Promise<Boolean> {
  return new Promise((res) => {
    bcrypt.compare(password, this.password, function (error, isMatch) {
      return res(error ? false : isMatch);
    })
  })
}

schema.pre("save", function (next) {
  const user: User = this;

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

export let UserModel: Model<UserDocument>;
try {
  UserModel = model("User");
} catch {
  UserModel = model("User", schema);
}
