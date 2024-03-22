import express from "express";
import { getAllUsers } from "../db/mongoClient";

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    console.log("getUsers körs");
    const users = await getAllUsers();
    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
