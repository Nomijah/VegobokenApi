import { addRecipe } from "../controllers/recipes";
import express from "express";

export default (router: express.Router) => {
  router.post("/recipes/addRecipe", addRecipe);
};
