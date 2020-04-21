const { MongoClient } = require("mongodb");

const dbFunction = async (dbName) => {
  const client = new MongoClient("mongodb://localhost", {
    useUnifiedTopology: true,
  });

  await client.connect();
  console.log("connected!");

  const db = client.db(dbName);

  await db.collection();
};
