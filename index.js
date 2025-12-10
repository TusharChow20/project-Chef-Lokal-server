const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.j7xeedk.mongodb.net/?appName=Cluster0`;
app.use(express.json());
app.use(cors());
// jwt token

const admin = require("firebase-admin");

const serviceAccount = require("./firebaseAdminSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    try {
      const token = authHeader.split(" ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedToken.email;
      next();
    } catch (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    // console.log("Verified user:", decodedToken.email);
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const stripe = require("stripe")(process.env.PAYMENT_SECRET);

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
    const orderCollection = myDB.collection("order_collection");
    const userCollection = myDB.collection("users");
    const roleChangeCollection = myDB.collection("role_change_req");
    const paymentHistoryCollection = myDB.collection("paymentHistory");
    const favoriteCollection = myDB.collection("favorite");
    // const

    // MEALS API'S---------------------------------------
    app.get("/home/meals", async (req, res) => {
      // console.log(req?.headers?.authorization);

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

    app.get("/meals", async (req, res) => {
      // console.log(req?.headers?.authorization);

      const { limit = 10, skip = 0, sortBy, sortOrder } = req.query;
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
    app.post("/meals", async (req, res) => {
      const mealData = req.body;
      const response = await mealCollection.insertOne(mealData);
      res.send(response);
    });

    app.get("/meals/chef/:chefId", async (req, res) => {
      const chefId = req.params.chefId;
      const response = await mealCollection.find({ chefId: chefId }).toArray();
      res.send(response);
    });

    app.put("/meals/meal/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = {
        $set: req.body,
      };
      const result = await mealCollection.updateOne(
        { _id: new ObjectId(id) },
        updateData
      );
      res.send(result);
    });
    app.delete("/meals/:id", async (req, res) => {
      const id = req.params.id;
      const result = await mealCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //order details-----------------------------------------
    app.get("/orders/all", async (req, res) => {
      const orders = await orderCollection.find().toArray();
      res.send(orders);
    });
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const result = await orderCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });
    app.get("/orders/:chefId", async (req, res) => {
      const chefId = req.params.chefId;
      const result = await orderCollection.find({ chefId: chefId }).toArray();
      res.send(result);
    });
    app.post("/orders", async (req, res) => {
      const orderData = req.body;
      const result = await orderCollection.insertOne(orderData);
      res.send(result);
    });

    app.patch("/orders/update/:orderId", async (req, res) => {
      const orderId = req.params.orderId;
      const { orderStatus } = req.body;
      const result = await orderCollection.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { orderStatus: orderStatus } }
      );
      res.send(result);
    });

    //meal details-----------------------------------------
    app.get("/mealDetails/:id", async (req, res) => {
      const mealId = req.params.id;
      const query = { _id: new ObjectId(mealId) };
      const result = await mealCollection.findOne(query);
      res.send(result);
    });

    //orderhandle api

    //REVIEW API'S---------------------------------------
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection
        .find()

        .sort({ reviewDate: -1 })
        .toArray();
      res.send(reviews);
    });
    app.get("/reviews/:email", verifyFirebaseToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decodedEmail) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      const result = await reviewsCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });
    app.get("/reviews/meal/:mealId", async (req, res) => {
      const mealId = req.params.mealId;
      // console.log(mealId);

      const result = await reviewsCollection.find({ mealId }).toArray();
      // console.log(result);

      res.send(result);
    });

    app.post("/reviews", verifyFirebaseToken, async (req, res) => {
      const reviewPayload = req.body;
      const result = await reviewsCollection.insertOne(reviewPayload);
      res.send(result);
    });

    app.patch("/reviews/:id", async (req, res) => {
      const reviewId = req.params.id;
      const { rating, comment } = req.body;
      if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      if (!rating || !comment) {
        return res
          .status(400)
          .json({ message: "Rating and comment are required" });
      }
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      const result = await reviewsCollection.updateOne(
        { _id: new ObjectId(reviewId) },
        {
          $set: {
            rating: rating,
            reviewText: comment,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json({
        message: "Review updated successfully",
        modifiedCount: result.modifiedCount,
      });
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) };

      const result = await reviewsCollection.deleteOne(filter);

      res.send(result);
    });

    //favorite api's
    app.get("/favorites/:email", async (req, res) => {
      const email = req.params.email;
      const result = await favoriteCollection.findOne({ userEmail: email });
      res.send(result);
    });
    app.get("/favorites/all/:email", async (req, res) => {
      const email = req.params.email;
      const result = await favoriteCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    app.post("/favorites", async (req, res) => {
      const favoriteInfo = req.body;

      const result = favoriteCollection.insertOne(favoriteInfo);
      res.send(result);
    });
    app.delete("/favorites/:id", async (req, res) => {
      const id = req.params.id;

      const result = await favoriteCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    //users api's---------------------------------------------
    app.get("/user/allUser", async (req, res) => {
      const user = await userCollection.find().toArray();
      res.send(user);
    });
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.findOne({ email });
      res.send(user);
    });

    app.get("/users/:email/role", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email });

      res.send({ role: user.role });
    });

    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;

      const { requestType, userStatus } = req.body;

      let updateFields = {};

      // If approving and a role is provided
      if (requestType) {
        if (requestType === "chef") {
          const chefId = "chef-" + Math.floor(1000 + Math.random() * 9000);
          updateFields.role = "chef";
          updateFields.chefId = chefId;
        } else {
          updateFields.role = requestType;
        }
      }

      // If rejecting
      if (userStatus) {
        updateFields.userStatus = userStatus;
      }

      // Only update fields that exist
      const result = await userCollection.updateOne(
        { email },
        { $set: updateFields }
      );

      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    //user role chnnage api's ----------------------------------
    app.get("/role_change_req/all", async (req, res) => {
      const requests = await roleChangeCollection.find().toArray();
      res.send(requests);
    });
    //filtered user role api
    app.get("/role_change_req", async (req, res) => {
      const email = req.query.email;
      const user = await roleChangeCollection
        .find({ userEmail: email })
        .toArray();
      res.send(user);
    });

    app.delete("/role_change_req/:id", async (req, res) => {
      const id = req.params.id;
      const result = await roleChangeCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.post("/role_change_req", async (req, res) => {
      const roleUpdate = req.body;
      const result = await roleChangeCollection.insertOne(roleUpdate);
      res.send(result);
    });

    // paymetn api's--------------------------------------
    app.post("/create-checkout-session", async (req, res) => {
      const { cost, orderId } = req.body; // Add orderId
      const amount = parseInt(cost) * 100;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: amount,
              product_data: {
                name: "Meal Order",
                description: "Your delicious meal order",
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.SITE_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${process.env.SITE_DOMAIN}/my-orders?canceled=true`,
        metadata: {
          orderId: orderId, // Store orderId in metadata
        },
      });

      res.send({ url: session.url });
    });

    app.post("/verify-payment", async (req, res) => {
      const { sessionId, orderId } = req.body;

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        const order = await orderCollection.findOne({
          _id: new ObjectId(orderId),
        });

        await orderCollection.updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { paymentStatus: "paid" } }
        );

        const paymentHistory = {
          orderId: orderId,
          sessionId: sessionId,
          amount: session.amount_total / 100,
          currency: session.currency,
          paymentStatus: session.payment_status,
          customerEmail: order.userEmail,
          mealName: order.mealName,
          quantity: order.quantity,
          chefId: order.chefId,
          chefName: order.chefName,
          paymentDate: new Date(),
          stripePaymentIntentId: session.payment_intent,
        };

        await paymentHistoryCollection.insertOne(paymentHistory);

        res.send({ success: true, payment: paymentHistory });
      } else {
        res
          .status(400)
          .send({ success: false, message: "Payment not completed" });
      }
    });
    app.get("/paymentHistory", async (req, res) => {
      const payment = await paymentHistoryCollection.find().toArray();
      res.send(payment);
    });
    // review api's----------------------------------

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
