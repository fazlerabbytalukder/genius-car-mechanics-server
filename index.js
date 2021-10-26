const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id',id);
            const query = { _id: ObjectId(id) };
            const serivce = await servicesCollection.findOne(query);
            res.json(serivce);
        })
        //POST API
        app.post('/services', async (req, res) => {
            // console.log('hit the post api');
            // res.send('post hitted');
            const service = req.body;
            console.log('hitted the api',service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('i am from genius server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})