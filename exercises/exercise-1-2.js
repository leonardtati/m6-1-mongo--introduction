const { MongoClient } = require("mongodb");

const getCollection = async (req, res) => {
  const { dbName, collection } = req.params;
  console.log(dbName, collection);
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbName);

  db.collection(collection)
    .find()
    .toArray((err, data) => {
      console.log(err);
      if (err) {
        res.send(err);
      } else {
        res.status(200).json({ status: 200, data: data });
        client.close();
        console.log("disconnected!");
      }
    });
};

module.exports = { getCollection };
