import { z } from "zod";

export const recipeCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  portions: z.number().optional(),
  portionsUnit: z.string().optional(),
  ingredients: z
    .object({
      name: z.string(),
      quantity: z
        .number()
        .min(0.001, "Ingredient quantity must be more than zero."),
      unit: z.string(),
    })
    .array(),
  instructions: z.string().array().min(1, "Instructions may not be empty."),
  mainCategory: z.string().min(1, "Main category may not be empty"),
  tags: z.string().array().optional(),
  image: z
    .object({
      fileName: z.string(),
      fileType: z.string(),
      size: z.number().max(2050000, "File size limit exceeded."),
      base64: z.string(),
      caption: z.string(),
    })
    .optional(),
  public: z.boolean(),
});

export type RecipeCreate = z.infer<typeof recipeCreateSchema>;
