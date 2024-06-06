import { z } from "zod";

const recipeDbSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  portions: z.number(),
  portionsUnit: z.string(),
  ingredients: z
    .object({
      name: z.string(),
      quantity: z
        .number()
        .min(0, "Ingredient quantity may not be less than zero."),
      unit: z.string(),
    })
    .array(),
  instructions: z.string().array().min(1, "Instructions may not be empty."),
  mainCategory: z.string().min(1, "Main category may not be empty"),
  tags: z.string().array(),
  imageMetadata: z.object({
    fileName: z.string(),
    fileType: z.string(),
    imageUrl: z.string(),
    caption: z.string(),
  }),
  public: z.boolean(),
  creatorId: z.string(),
  sharedList: z.string().array(),
});

export type RecipeDb = z.infer<typeof recipeDbSchema>;
