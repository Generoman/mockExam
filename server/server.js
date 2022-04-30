import express from "express";
import * as path from "path";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as Process from "process";
import {MainApi} from "./mainApi.js";

dotenv.config();

const dbApiPath = "/api/movies";
const dbName = "sample_mflix";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(Process.env.COOKIE_SECRET));

const mongoClient = new MongoClient(process.env.MONGODB_URL);
mongoClient.connect().then(async () => {
  console.log("Connected to MongoDB");
  app.use(dbApiPath, MainApi(mongoClient.db(dbName)));
});

app.use(express.static("../client/dist"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express server running on http://localhost:${server.address().port}`);
});
