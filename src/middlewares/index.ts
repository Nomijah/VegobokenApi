import { getUserBySessionToken } from "../db/users";
import express from "express";
import { get, merge } from "lodash";
import { Role } from "types/dbTypes/role";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["vego-token"];
    if (!sessionToken) {
      console.log("Could not read token from cookies.");
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(404).end("Token doesn't match any existing user.");
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const authPage = (permissions: Role[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userRole = req.identity.role;
      if (permissions.includes(userRole as Role)) {
        next();
      } else {
        return res.status(401).json("Unauthorized request.");
      }
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
};
