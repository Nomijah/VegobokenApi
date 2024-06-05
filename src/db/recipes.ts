import mongoose from "mongoose";
import { ImageMetadata } from "types/dbTypes/imageMetadata";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  portions: { type: Number },
  portionsUnit: { type: String },
  ingredients: [
    {
      name: { type: String },
      quantity: { type: Number },
      unit: { type: String },
    },
  ],
  instructions: [{ type: String }],
  mainCategory: { type: String },
  tags: [{ type: String }],
  imageMetadata: {
    fileName: { type: String },
    fileType: { type: String },
    caption: { type: String },
    imageUrl: { type: String },
  },
  creatorId: { type: String, required: true },
  public: { type: Boolean },
  sharedList: [{ type: String }],
});

export const RecipeModel = mongoose.model("Recipe", RecipeSchema);

export const getRecipesByCreatorId = (userId: string) =>
  RecipeModel.find({ creatorId: userId });
export const getRecipeById = (id: string) => RecipeModel.findById(id);
export const getRecipeByMainCategory = (category: string) =>
  RecipeModel.find({ mainCategory: category });
export const getPublicRecipes = (isPublic: boolean) =>
  RecipeModel.find({ public: isPublic });
export const createRecipe = (values: Record<string, any>) =>
  new RecipeModel(values).save().then((user) => user.toObject());
export const deleteRecipeById = (id: string) =>
  RecipeModel.findOneAndDelete({ _id: id });
export const updateRecipeById = (id: string, values: Record<string, any>) =>
  RecipeModel.findByIdAndUpdate(id, values);
export const updateMetadata = async (
  metadata: ImageMetadata,
  recipeId: string
) => {
  RecipeModel.findByIdAndUpdate(recipeId, { imageMetadata: metadata });
};
