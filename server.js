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

const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});
  
const People = mongoose.model("People", PeopleSchema);
  
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
  
app.get("/", (req, res) => {
    res.send("hello world");
});
  
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
  }
});
  
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.put("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // PEOPLE DELETE ROUTE
  app.delete("/people/:id", async (req, res) => {
    try {
      // send all people
      res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));