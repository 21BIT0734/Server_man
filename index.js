const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')

// middle ware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello World!')
})

//mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://merninventory:1234@cluster0.jyjxmfl.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection

    const store = client.db("Inventory").collection("gadgets");

    //CREATE(UPLOADING PRODUCTS)
    app.post("/upload-product",async(req,res)=>{
        const data = req.body;
        const result = await store.insertOne(data);
        res.send(result);
    })

    //READ (VIEW PRODUCTS)
    app.get("/view-product",async(req,res)=>{
        const gadgets =  store.find();
        const result = await gadgets.toArray();
        res.send(result);
    })

    //UPDATE (UPDATE PRODUCTS)
    app.patch("/update-product/:id",async(req,res)=>{
        const id =req.params.id;
        const updateProductData = req.body;
        const filter ={_id: new ObjectId(id)};
        const updateDoc = {
            $set: {
                ...updateProductData
            }}
        const options ={upsert : true};
    const result = await store.updateOne(filter,updateDoc,options);
    res.send(result);
    })
    //DELETE (DELETE PRODUCTS)
    app.delete("/delete-product/:id",async(req,res)=>{
        const id =req.params.id;
        const filter ={_id: new ObjectId(id)};
        const result = await store.deleteOne(filter);
        res.send(result);
    })
     //find by Brand 
     app.get('/searchByBrand', async (req, res) => {
        let query = {};
        if(req.query?.brand){
            query={brand: req.query.brand}
        }
        const result = await store.find(query).toArray();
        res.send(result);
    })

    //find by category 
    app.get('/searchByCategory', async (req, res) => {
        let query = {};
        if(req.query?.brand){
            query={category: req.query.category}
        }
        const result = await store.find(query).toArray();
        res.send(result);
    })

    //find by product name 
    app.get('/searchByPName', async (req, res) => {
        let query = {};
        if(req.query?.productName){
            query={productName: req.query.productName}
        }
        const result = await store.find(query).toArray();
        res.send(result);
    })

    //Search By Product Id
    app.get("/Product/:id",async(req,res)=>{
      const id =req.params.id;
      const filter={_id: new ObjectId(id)};
      const result =await store.findOne(filter);
      res.send(result);

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})