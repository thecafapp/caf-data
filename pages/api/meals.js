import { MongoClient } from "mongodb";
import firebaseAdmin from "firebase-admin";
export default async function handler(req, res) {
  // Retrieving meals by date
  if (req.method == "GET") {
    const client = new MongoClient(process.env.CAFMONGO);
    const dbName = process.env.CAFMONGO_DB;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("menu");
    const foods = await collection.findOne({
      date: req.query.date,
    });
    client.close();
    return res
      .setHeader("Cache-Control", "max-age=7200, public")
      .status(200)
      .json(foods);
  } else if (req.method == "POST") {
    // Modifying or adding a day
    const firebaseApp = firebaseAdmin.initializeApp(
      {
        credential: firebaseAdmin.credential.cert({
          type: "service_account",
          project_id: "thecaf-dotme",
          private_key_id: "5d24fb90d04cf25e5252d26f388584a9817eb81d",
          private_key: process.env.FIREBASE_PRIVATE_KEY,
          client_email: process.env.FIREBASE_EMAIL,
          client_id: "103347218908101696305",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url:
            "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url:
            "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c3key%40thecaf-dotme.iam.gserviceaccount.com",
        }),
      },
      String(Math.random())
    );
    if (!req.headers["x-firebase-token"]) {
      await firebaseApp.delete();
      res.status(400).json({
        error: "You must provide a Firebase token.",
        status: "failure",
      });
    }
    const client = new MongoClient(process.env.CAFMONGO);
    const dbName = process.env.CAFMONGO_DB;
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const auth = firebaseApp.auth();
    const user = await auth.verifyIdToken(req.headers["x-firebase-token"]);
    const isAdmin = await usersCollection.findOne({
      admin: true,
      uid: user.uid,
    });
    if (!!isAdmin) {
      const db = client.db(dbName);
      const collection = db.collection("menu");
      const result = await collection.updateOne(
        {
          date: req.body.date,
        },
        {
          $set: {
            meals: [...req.body.meals],
            updatedAt: new Date(),
          },
        },
        {
          upsert: true,
        }
      );
      await client.close();
      await firebaseApp.delete();
      return res.status(200).json(result);
    } else {
      res.status(401).json({
        error: "You are not a Caf App administrator.",
        status: "failure",
      });
    }
  }
}
