var express = require("express");
const db = require("./routes/utils/db");
const formRouter = require("./routes/form")
var cors = require('cors')

// Creation of the express server (app)
var app = express();
app.use(express.json()); // parse application/json


const corsConfig = {
  origin: true,
  credentials: true
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// Definition of a local server port (HTTP_PORT)
var port = 3000 || "80";; //local=3000 remote=80

// ----> For cheking that our server is alive
app.get("/alive", (req, res) => res.send("I'm alive"));

// Routings
app.use("/form", formRouter);

// Default router
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
  });
  
  process.on("SIGINT", function () {
    if (server) {
      server.close(() => console.log("server closed"));
    }
    process.exit();
  });
  
