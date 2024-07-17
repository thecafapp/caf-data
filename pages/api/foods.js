import { MongoClient } from "mongodb";
export default async function handler(req, res) {
  if (req.method == "GET") {
    const client = new MongoClient(process.env.CAFMONGO);
    const dbName = process.env.CAFMONGO_DB;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("foods");
    const foods = await collection
      .find({
        $text: { $search: req.query.q },
      })
      .toArray();
    client.close();
    return res
      .setHeader("Cache-Control", "max-age=7200, public")
      .status(200)
      .json(foods);
  } else if (req.method == "POST") {
    const client = new MongoClient(process.env.CAFMONGO);
    const dbName = process.env.CAFMONGO_DB;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("foods");
    const food = await collection.find({ name: { $in: req.body } }).toArray();
    client.close();
    return res.status(200).json(food);
  }
}
