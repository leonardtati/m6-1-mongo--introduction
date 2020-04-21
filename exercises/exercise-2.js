const { MongoClient } = require("mongodb");
const assert = require("assert");

const createGreeting = async (req, res) => {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("connected");
    const db = client.db("exercises");

    console.log(req.body);

    let r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);
    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }

  client.close();
  console.log("close");
};

const getGreeting = async (req, res) => {
  const _id = req.params._id;

  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("exercises");

  await db.collection("two").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db("exercises");

  console.log(res);

  db.collection("two")
    .find()
    .toArray((err, data) => {
      if (data.length) {
        const start = Number(req.query.start) || 0;
        const makeStart = start > -1 && start < data.length ? start : 0;
        const end = makeStart + (Number(req.query.limit) || 25);
        const makeEnd = end > data.length ? data.length - 1 : end;
        const slicedData = data.slice(makeStart, makeEnd);
        res.status(200).json({ status: 200, data: slicedData });
      } else {
        res.status(404).json({ status: 404, data: "Not Found" });
      }
      client.close();
    });
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("exercises");

    const r = await db.collection("two").deleteOne({ _id: _id.toUpperCase() });
    assert.equal(1, r.deletedCount);
    console.log(r.deletedCount);
    res.status(204).json({ status: 204, data: _id });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;
  console.log(hello);

  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  if (!hello) {
    res.status(400).json({
      status: 400,
      data: req.body,
      message: "you may only update hello",
    });
    return;
  }

  try {
    await client.connect();
    const db = client.db("exercises");

    const query = { _id };
    const newValues = { $set: { hello } };

    const r = await db.collection("two").updateOne(query, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    res.status(200).json({ status: 200, _id });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }

  client.close();
};
module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
