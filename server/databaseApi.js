import { Router } from "express";

export function DatabaseApi(mongoDb) {
  const router = new Router();
  const currentCollection = "test"; // change to "movies" for production or "test" for testing

  router.get("/", async (req, res) => {
    const data = await mongoDb
      .collection(currentCollection)
      .find()
      .limit(100)
      .toArray();
    res.json(data);
  });

  router.post("/", async (req, res) => {
    const new_data = req.body;
    console.log(req.body);

    try {
      const { acknowledged, insertedId } = await mongoDb
        .collection(currentCollection)
        .insertOne(new_data);

      if (acknowledged) {
        console.log(insertedId);
        res.json(insertedId);
      } else {
        res.sendStatus(500);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  return router;
}
