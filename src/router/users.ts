import express from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { authPage, isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get(
    "/users/getAllUsers",
    isAuthenticated,
    authPage(["admin"]),
    getAllUsers
  );
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
