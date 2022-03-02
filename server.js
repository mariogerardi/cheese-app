require("dotenv").config();

const { PORT = 3500, MONGODB_URL } = process.env;

const express = require("express");
const morgan = require("morgan")
const cors = require("cors")
const app = express();

const mongoose = require("mongoose");

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
});
  
const Cheese = mongoose.model("Cheese", CheeseSchema);
  
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
  
app.get("/", (req, res) => {
    res.send("hello world");
});
  
app.get("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});
  
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    }
});
  
app.delete("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
});

app.listen(process.env.PORT || 3500, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});