projectData = {};

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.use(express.static("website"));

const port = 3030;
const server = app.listen(port, () => {
  console.log(`Server running on localhost ${port}`);
});

app.post("/add", async function (req, res) {
  const body = await req.body;
  projectData = body;
  res.status(200).send(projectData);
});

app.get("/all", async (req, res) => {
  console.log(projectData);
  res.send(projectData);
});
