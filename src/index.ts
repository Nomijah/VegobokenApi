import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import { DbUser } from "types/dbTypes/dbUser";

declare global {
  namespace Express {
    export interface Request {
      identity?: DbUser;
    }
  }
}

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_DOMAIN_ADDRESS,
  })
);

app.use(compression());
app.use(cookieParser());
app.disable("x-powered-by");
app.use(bodyParser.json({ limit: "3mb" })); // Change request size limit here

const server = http.createServer(app);

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001/");
});

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.mcj2nln.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
