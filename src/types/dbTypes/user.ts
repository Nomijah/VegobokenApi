export type User = {
    username: string;
    email: string;
    authentication: Authentication;
    sharedRecipeIds: string[];
    favoriteRecipeIds: string[];
    friendIds: string[];
  }

  type Authentication = {
    password: string;
    salt: string;
    sessionToken: string;
    isVerified: string;
  }