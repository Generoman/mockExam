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
const dbName = "mock_exam_testing"; // change to "sample_mflix" for production or "mock_exam_testing" for testing

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const mongoClient = new MongoClient(process.env.TEST_MONGODB_URL); // change to MONGODB_URL for production or TEST_MONGODB_URL for testing

mongoClient.connect().then(async () => {
  console.log("Connected to MongoDB");
  app.use(dbApiPath, DatabaseApi(mongoClient.db(dbName)));
});

app.get("/api/config", (req, res) => {
  const body = {
    google: {
      response_type: "token",
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: "email profile",
      discovery_endpoint:
        "https://accounts.google.com/.well-known/openid-configuration",
    },
    microsoft: {
      response_type: "code",
      response_mode: "fragment",
      client_id: process.env.AZURE_CLIENT_ID,
      code_challenge_method: "S256",
      scope: "openid",
      discovery_endpoint:
        "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration",
    },
  };
  res.json(body);
});

app.get("/api/login", async (req, res) => {
  const { access_token } = req.signedCookies;
  const { endpoint } = req.cookies;

  let endpointURL;

  if (endpoint === "google") {
    endpointURL =
      "https://accounts.google.com/.well-known/openid-configuration";
  } else if (endpoint === "microsoft") {
    endpointURL =
      "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration";
  }

  if (!access_token) {
    res.sendStatus(401);
    res.json(undefined);
  } else {
    const { userinfo_endpoint } = await fetchJSON(endpointURL);

    const userinfo = await fetchJSON(userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (userinfo) {
      res.json(userinfo);
    }
  }
});

app.post("/api/login", (req, res) => {
  const { access_token, endpoint } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.cookie("endpoint", endpoint);
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
