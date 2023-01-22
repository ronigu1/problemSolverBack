var express = require("express");
const db = require("./routes/utils/db");
const formRouter = require("./routes/form")
var cors = require('cors')

// Creation of the express server (app)
var app = express();
app.use(express.json()); // parse application/json

//cors - cross origin resurce sharing
const corsConfig = {
  origin: true,
  credentials: true
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// Definition of a local server port (HTTP_PORT)
let port = process.env.PORT || 3000 ; //local=3000 remote=80-http 443-https

// ----> For cheking that our server is alive
app.get("/alive", (req, res) => res.send("I'm alive"));

// Routings
app.use("/form", formRouter);

// Default router
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message, success: false });
});

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
  });
  //SIGIT == ctrl+c -> if the server got " sigint" we want to close the server.
  process.on("SIGINT", function () {
    if (server) {
      server.close(() => console.log("server closed"));
    }
    process.exit();
  });
  
