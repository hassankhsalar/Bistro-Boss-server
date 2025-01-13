const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

////

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qxh3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewsCollection = client.db("bistroDB").collection("reviews");
    const cartCollection = client.db("bistroDB").collection("carts");
    const userCollection = client.db("bistroDB").collection("users");


    //user related api
    app.post('/users', async(req, res) =>{
      const user = req.body;
      //insert email if user doesnt exis
      //can be done in three ways (1.email unique, 2.upsert 3.simple checking same email)
      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user already exists', insertedId: null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get('/users', async(req, res) =>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    //Dashboard menu related apis
    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })


    //Make admin api
    app.patch('/users/admin/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
    })

    // menu data
    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result);
    })



    //review data
    app.get('/reviews', async(req, res) => {
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })


    //carts collection

    app.post('/carts', async(req, res) =>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })

    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

////
app.get('/', (req, res) => {
    res.send('boss is sitting')
})

app.listen(port, () => {
    console.log(`Bistro Boss is waiting`)
})




//**
// 
// app.get('/users')
// app.get('/users/:id')
// app.post('/users')
// app.put('/users/:id')
// app.patch('/users/:id')
// app.delete('/users/:id')
//
//  */ ..................................
// .............................................