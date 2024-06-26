import { Authentication } from "./authentication";
import { Role } from "./role";

export type User = {
  username: string;
  email: string;
  role: Role;
  authentication: Authentication;
  sharedRecipeIds: string[];
  favoriteRecipeIds: string[];
  friendIds: string[];
};
