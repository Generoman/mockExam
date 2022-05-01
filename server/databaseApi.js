import { Router } from "express";

export function DatabaseApi(mongoDb) {
  const router = new Router();

  router.get("/", async (req, res) => {
    const movies = await mongoDb
      .collection("movies")
      .find()
      .limit(100)
      .toArray();
    res.json(movies);
  });

  router.post("/", (req, res) => {
    res.sendStatus(500);
  });

  return router;
}
