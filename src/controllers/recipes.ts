import express from "express";
import { RecipeCreateRequest } from "types/requestTypes/recipeCreateRequest";
import { ResponseBody } from "types/responseTypes/responseBody";

export const addRecipe = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let resBody: ResponseBody = {
      isSuccessful: true,
      statusCode: 400,
      errorMessages: [],
    };

    const recipe: RecipeCreateRequest = req.body;
    if (!recipe.title || !recipe.mainCategory || !recipe.ingredients || !recipe.instructions) {
      resBody = {
        ...resBody,
        isSuccessful: false,
        errorMessages: [...resBody.errorMessages, "Required fields missing."],
      };
      return res.status(resBody.statusCode).json(resBody).end();
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
