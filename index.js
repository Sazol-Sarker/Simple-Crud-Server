const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// MONGODB

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://sazolsarker1:hspun2ClsZYUYx6V@cluster0.uomr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsAllowInvalidCertificates=true";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // CREATE DATABASE
    const database = client.db("usersDB");
    const userCollection = database.collection("userCollection");

    // ALL client-server-DB APIs goes here
    // GET read API
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get specific user data from mongodb for PUT update
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Get id=> ", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // POST create api
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log("Server got user data=>", user);
      // send user to mongodb
      const result = await userCollection.insertOne(user);

      // console.log(result);
      res.send(result);
    });

    // DELETE API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Received id client to server=>", id);

      // hit the server with DELETE
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      // response to client after delete
      res.send(result);
    });

    // PUT update specific user data
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;

      // PUT api
      const filter = { _id: new ObjectId(id) };
      /* Set the upsert option to insert a document if no documents match
    the filter */
      const options = { upsert: true };

      const userData = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };

      const result = await userCollection.updateOne(filter, userData, options);

      // response to client
      res.send(result);
    });

    // *******************

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Requests
app.get("/", (req, res) => {
  res.send("Welcome to server homepage!");
});

app.listen(port, () => {
  console.log("Listening at port=<> ", port);
});
