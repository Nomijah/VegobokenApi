import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, validate: [isEmail, "Invalid email"] },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
    isVerified: { type: Boolean, default: false },
  },
  sharedRecipeIds: [{ type: String }],
  favoriteRecipeIds: [{ type: String }],
  friendIds: [{ type: String }],
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

