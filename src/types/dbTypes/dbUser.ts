import { Authentication } from "./authentication";
import { Role } from "./role";

export type DbUser = {
  authentication: Authentication;
  _id: string;
  username: string;
  email: string;
  sharedRecipeIds: string[];
  favoriteRecipeIds: string[];
  friendIds: string[];
  __v: number;
  role: string;
};
