const fileSystem = require("file-system");
const { MongoClient } = require("mongodb");
const assert = require("assert");

const greetings = JSON.parse(fileSystem.readFileSync("data/greetings.json"));

const batchImport = async (greetings) => {
  console.log(greetings);

  const client = new MongoClient("mongodb://localhost", {
    useUnifiedTopology: true,
  });

  await client.connect();
  console.log("connected!");
  const db = client.db("exercises");

  const r = await db.collection("two").insertMany(greetings);
  assert.equal(greetings.length, r.insertedCount);

  client.close();
  console.log("disconnected!");
};

batchImport(greetings);
