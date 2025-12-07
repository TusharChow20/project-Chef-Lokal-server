const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.j7xeedk.mongodb.net/?appName=Cluster0`;
app.use(express.json());
app.use(cors());
//mongo
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

    const myDB = client.db("projectChefLokal");
    const mealCollection = myDB.collection("meals");
    const reviewsCollection = myDB.collection("reviews");

    // MEALS API'S
    app.get("/meals", async (req, res) => {
      const { limit = 6, skip = 0, sortBy, sortOrder } = req.query;
      let sortOptions = {};
      if (sortBy && sortOrder) {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      }
      const totalMeals = await mealCollection.countDocuments();
      let query = mealCollection
        .find()
        .project({ ingredients: 0, estimatedDeliveryTime: 0, createdDate: 0 });
      if (Object.keys(sortOptions).length > 0) {
        query = query.sort(sortOptions);
      }
      const meals = await query
        .limit(Number(limit))
        .skip(Number(skip))
        .toArray();
      res.send({ meals, total: totalMeals });
    });

    //REVIEW API'S
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection
        .find()

        .sort({ reviewDate: -1 })
        .toArray();
      res.send(reviews);
    });

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
