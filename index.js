const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

//mongodb connection start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3krokas.mongodb.net/?retryWrites=true&w=majority`;

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
        //await client.connect();
        const serviceCollection = client.db('healthcare').collection('service');
        const userCollection = client.db('healthcare').collection('user');

        app.get('/service', async (req, res) => {
            const result = await serviceCollection.find().toArray()
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const userInfo = req.body;
            const result = await userCollection.insertOne(userInfo)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const queryEmail = req.query.email;
            const query = { userEmail: queryEmail }
            const result = await userCollection.findOne(query)
            if (result) {
                return res.send({ 'isExisted': true })
            }
            res.send({ 'isExisted': false })
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





app.get('/', (req, res) => {
    res.send('Healthcare server is running')
})

app.listen(port, () => {
    console.log(`Healthcare server is running on port:${port}`);
})