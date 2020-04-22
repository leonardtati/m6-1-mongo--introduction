const { MongoClient } = require("mongodb");

const dbFUnction = async (dbName) => {
  //creating new client with this:
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });
  // This opens the connection to the databse server

  await client.connect();
  console.log("connected!");

  const db = client.db(dbName);

  //thise populates the db with data

  await db.collection("one").insertOne({ name: "Billy the Kid" });

  // this closes the connection to the database server

  client.close();
  console.log("disconnected!");
};
//this creates the db
dbFUnction("exercise_one");
