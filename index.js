
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000;



app.use(express.json())
app.use(cors())

console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0supnyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const database = client.db("assignmentDB");
    const assignmentCollection = database.collection("allAssignment");

    const databaseTwo = client.db("submittedAssignment");
    const submittedAssignment = databaseTwo.collection("SubmittedA.");



app.post("/assignments", async(req, res)=>{
  const item = req.body;
  const result = await assignmentCollection.insertOne(item);
  res.send(result)
  console.log(result);
  
})

app.post("/submittedAssignment", async(req, res)=>{
  const item = req.body;
  const result = await submittedAssignment.insertOne(item);
  res.send(result)
  console.log(result);
  
})

app.get("/assignments", async(req, res)=>{
  const result = await assignmentCollection.find().toArray();
  res.send(result)
})

app.get("/submittedAssignment", async(req, res)=>{
  const result = await submittedAssignment.find().toArray();
  res.send(result)
})


app.get("/assignments/:email", async (req, res) => {
  console.log(req.params.email)
  const result = await assignmentCollection.find({email: req.params.email}).toArray();
  res.send(result);
});

app.delete("/assignments/:email", async (req, res) => {
  const email = req.params.email;
  console.log(email)
  const query = { email: email };
  const result = await assignmentCollection.deleteOne(query);
  res.send(result);
});
// app.put("/countries/:id", async(req, res)=>{
//   const id = req.params.id
//   const filter= { _id: new ObjectId(id)}
//   const options = {upsert: true};
//   const updateData = req.body;
//   console.log(updateData)
//   const updateCountries ={
//     $set:{
//       name:updateData.name,
//       userEmail:updateData.userEmail,
//       photoURL:updateData.photoURL,
//       spot_name:updateData.spot_name,
//       country_name:updateData.country_name,
//       price:updateData.price,
//       season:updateData.season,
//       travelTime:updateData.travelTime,
//       visitor:updateData.visitor,
//       description:updateData.description,
//     }
    
//   }
//   const result = await countryCollection.updateOne(filter, updateCountries, options);
//   console.log(result)
//   res.send(result)
  
// })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
  