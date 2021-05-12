//dependencies

//get .env variables
require("dotenv").config()
//pull PORT from .env, defaulting the value to 3000
const { PORT = 3000, MONGODB_URL } = process.env

//bring in express

const express = require("express")

//our express app object

const app = express()

//import mongoose
const mongoose = require("mongoose")

//import middleware
const cors = require("cors")
const morgan = require("morgan")

//DATABASE CONNECTION
//Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
//connection events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", ()=> console.log("You are disconnected from mongo"))
.on("error", (error) => console.log(error))

///////////////////////////
//MIDDLEWARE/////
/////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


//ROUTES
app.get("/", (req, res) => {
    res.send("Hello World")
})

//PEOPLE INDEX ROUTE - displays all people
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}));

    } catch (error) {
        res.status(400).json(error);
    }
});
//People Create Route 
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});
//People Update Route
app.put("/people/:id", async (req, res) => {
    try {
       res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error){
        res.status(400).json(error)
    }
})
//People Delete Route
app.delete("/people/:id", async (req, res) => {
    try {
      res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error){
        res.status(400).json(error);
    }
});
//////////////////////
//MODELS
//////////////////////
const PeopleSchema = new mongoose.Schema ({
    name: String,
    image: String,
    title: String
})
const People = mongoose.model("people", PeopleSchema)


//lietener
app.listen(PORT, () => console.log(`listening on port ${PORT}`))