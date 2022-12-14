const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 5000;
require('dotenv').config();


//middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.memgfjc.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run(){
    try{
        const serviceCollection =client.db('goship').collection('services');
        const reviewCollection =client.db('goship').collection('review');

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await (await cursor.toArray()).slice(0,3);
            res.send(services);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id:ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(result);
        });

    // review api
        app.get('/reviews', async (req, res) => {


            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });


    app.post('/reviews',async(req, res)=>{
        const review =req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    });

    app.get('/reviews',async(req,res) =>{
        console.log(req.query.review_id)
        let query ={};
        if (req.query.review_id){
            query = {
                review_id: req.query.review_id
            }
        }
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });
    app.delete('/reviews/:id',  async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
      });
        app.patch('/reviews/:id',  async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
    
        
    

        
    }
    finally{

    }

}
run().catch(err=>console.error(err));



app.get('/', (req, res)=>{
    res.send('server ids running');
});


app.listen(port, ()=>{
    console.log(`goship server running on ${port}`);
})