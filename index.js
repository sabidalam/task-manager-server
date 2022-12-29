const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ifta3d6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const taskCollection = client.db('taskManager').collection('allAddedTask');


        app.post('/addedTask', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
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