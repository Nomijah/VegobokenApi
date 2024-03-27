import mongoose from "mongoose";

const EmailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expirationTime: { type: Number, required: true },
});

export const EmailVerificationModel = mongoose.model(
  "EmailVerification",
  EmailVerificationSchema
);

export const getEmailVerificationById = (id: string) =>
  EmailVerificationModel.findById(id);
export const getEmailVerificationByToken = (token: string) =>
  EmailVerificationModel.findOne({ token });
export const upsertEmailVerification = (values: Record<string, any>) => {
  const query = { email: values.email };
  return new EmailVerificationModel(values)
    .save()
    .then((emailVerification) =>
      EmailVerificationModel.findOneAndUpdate(query, emailVerification, {
        upsert: true,
      })
    );
};
export const deleteEmailVerificationById = (id: string) =>
  EmailVerificationModel.findOneAndDelete({ _id: id });
