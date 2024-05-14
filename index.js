
const express = require('express')
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000;



app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);

console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { populate } = require('dotenv');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0supnyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const logger = (req, res, next) => {
  console.log("Called", req.hostname, req.originalUrl);
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);
  if (!token) {
    return res.status(401).send({ message: 'Not Authorized' });
  }
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
  if(err){
    console.log(err);
    return res.status(401).send({ message: 'Not Authorized' });
  }
  console.log('value in the', decoded);
  req.user = decoded;
  next();
})
};

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



app.get("/assignments", logger, verifyToken, async(req, res)=>{
  const result = await assignmentCollection.find().toArray();
  res.send(result)
})



app.get("/submittedAssignment", logger, verifyToken, async(req, res)=>{
  const result = await submittedAssignment.find().toArray();
  res.send(result)
})


app.get("/submittedAssignment/:email", logger, verifyToken, async (req, res) => {
  const result = await submittedAssignment.find({email: req.params.email}).toArray();
  res.send(result);
});


app.patch("/submittedAssignment/:id", async(req, res)=>{
  const updateStatus = req.body;
  console.log(updateStatus);
  
})












app.delete("/submittedAssignment/:id", async (req, res) => {
  const id = req.params.id;
  
  const query = { _id: new ObjectId(id) };
  const result = await submittedAssignment.deleteOne(query);
  res.send(result);
});




app.delete("/assignments/:email",  async (req, res) => {
  const email = req.params.email;
  
  const query = { email: email };
  const result = await assignmentCollection.deleteOne(query);
  res.send(result);
});

app.put("/assignments/:id",  async(req, res)=>{
  const id = req.params.id
  const filter= { _id: new ObjectId(id)}
  const options = {upsert: true};
  const updateData = req.body;
  console.log(updateData)
  const updateAssignment ={
    $set:{
      title:updateData.title,
      photoURL:updateData.photoURL,
      marks:updateData.marks,
      difficultyLevel: updateData.difficultyLevel,
      date: updateData.date,
      descriptions:updateData.descriptions,
    }
    
  }
  const result = await assignmentCollection.updateOne(filter, updateAssignment, options);
  console.log(result)
  res.send(result)
  
})








app.post("/jwt", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'none' // For cross-site requests
    }).send({ success: true });
  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).send({ success: false, error: 'Internal server error' });
  }
});










 app.post("/submittedAssignment/:id", async (req, res) => {
  const id = req.params.id;
  const { obtained, status, appreciate } = req.body; // Assuming obtained, status, and appreciate values are sent in the request body

  try {
    const result = await submittedAssignment.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          obtained: obtained,
          status: status,
          appreciate: appreciate
        } 
      }
    );

    if (result.modifiedCount === 1) {
      console.log('Data added successfully');
      res.status(200).send('Data added successfully');
    } else {
      console.log('Document not found');
      res.status(404).send('Document not found');
    }
  } catch (err) {
    console.error('Error adding data:', err);
    res.status(500).send('Error adding data');
  }
});



   



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
  
  