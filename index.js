const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@ubaid-database.njfi7n5.mongodb.net/?retryWrites=true&w=majority&appName=Ubaid-Database`;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const dataBase = client.db("Medimart");
    const usersCollection = dataBase.collection("users");
    const categoryCollection = dataBase.collection("category");
    const reviewsCollection = dataBase.collection("reviews");
    // ? get all user
    app.get("/allUsers", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    // ? get all reviews
    app.get("/allReviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    // ? get banner from db
    app.get('/getBanners', async(req,res) => {
      const result = await bannersCollection.find().toArray()
      res.send(result)
    })
    // ? get category from db
    app.get('/category',async(req,res)=> {
      const result = await categoryCollection.find().toArray()
      res.send(result)
    })
    // ? create user and store into db
    app.post("/users", async (req, res) => {
      const data = req.body;
      const query = { email: data.email };
      const alreadyExist = await usersCollection.findOne(query);
      if (!!alreadyExist) {
        return res.send({ message: "User already exist" });
      }
      const result = await usersCollection.insertOne(data);
      res.send(result);
    });
    // ? create banners for hero section
    app.post('/createBanners',async(req,res) => {
      const data = req.body
      const result = await bannersCollection.insertOne(data)
      res.send(result)
    })
    // ? create reviews for review section
    app.post('/reviews',async(req,res) => {
      const data = req.body
      const result = await reviewsCollection.insertOne(data)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
