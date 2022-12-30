const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8000;
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ifta3d6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const taskCollection = client.db('taskManager').collection('allAddedTask');

        app.get('/addedTask', async (req, res) => {
            const query = {};
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/addedTask/completed', async (req, res) => {
            const query = { status: 'completed' };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/addedTask', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.put('/addedTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'completed'
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.delete('/addedTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);

        })
    }

    finally { }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('task manager running');
})

app.listen(port, () => {
    console.log(`task manager running ${port}`);
});