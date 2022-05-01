import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as Process from "process";
import { DatabaseApi } from "./databaseApi.js";
import { fetchJSON } from "./fetchJSON.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const dbApiPath = "/api/movies";
const dbName = "sample_mflix";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(Process.env.COOKIE_SECRET));

const mongoClient = new MongoClient(process.env.MONGODB_URL); // .env-testing
mongoClient.connect().then(async () => {
  console.log("Connected to MongoDB");
  app.use(dbApiPath, DatabaseApi(mongoClient.db(dbName)));
});

app.get("/api/login", async (req, res) => {
  const { access_token } = req.signedCookies;

  if (access_token) {
    const { userinfo_endpoint } = await fetchJSON(
      "https://accounts.google.com/.well-known/openid-configuration"
    );

    const userinfo = await fetchJSON(userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.json(userinfo);
  } else {
    res.sendStatus(401);
  }
});

app.post("/api/login", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(200);
});

app.use(express.static(path.resolve(__dirname, "..", "client", "dist")));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Express server running on http://localhost:${server.address().port}`
  );
});
