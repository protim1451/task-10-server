const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const corsConfig = {
  origin: 'https://b9a10-client-side-protim1451.web.app', // Adjust this based on your frontend origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.edgm8kl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    console.log("Connected to MongoDB");

    const collection = client.db('tourist_spots').collection('spots_collection');
    const userCollection = client.db('tourist_spots').collection('user');
    const CountryCollection = client.db('tourist_spots').collection('CountryCollection');

    app.post('/spots', async (req, res) => {
      try {
        const newSpot = req.body;
        const result = await collection.insertOne(newSpot);
        res.status(201).json({ message: 'Tourist spot added successfully', insertedId: result.insertedId });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to add tourist spot' });
      }
    });

    app.get('/spots', async (req, res) => {
      const cursor = collection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/CountryCollection', async (req, res) => {
      try {
        const countries = await CountryCollection.find().toArray();
        console.log('Fetched countries:', countries); // Log the fetched countries
        res.json(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Failed to fetch countries' });
      }
    });
    
    
    

    app.get('/spots/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.findOne(query);
      res.send(result);
    });

    app.delete('/spots/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collection.deleteOne(query);
        res.json(result);
      } catch (error) {
        console.error('Error deleting spot:', error);
        res.status(500).json({ error: 'Failed to delete spot' });
      }
    });


    app.get('/userSpots', async (req, res) => {
      try {
        const userEmail = req.query.userEmail; // Retrieve user email from query parameters
        const query = { userEmail: userEmail }; // Filter spots by user email
        const userSpots = await collection.find(query).toArray();
        res.json(userSpots);
      } catch (error) {
        console.error('Error fetching user spots:', error);
        res.status(500).json({ error: 'Failed to fetch user spots' });
      }
    });


    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get('/user', async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
