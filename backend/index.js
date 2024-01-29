const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Connecting MongoDB
async function mongoDbConnection() {
  await mongoose.connect(
    "mongodb+srv://alexandredefreitas:aAVtpdxIr80heVjq@cluster0.hjwerir.mongodb.net/?retryWrites=true&w=majority",
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // },
    // 6000,
  );
}
mongoDbConnection().then(() => {
  console.log("MongoDB successfully connected.");
}),
  (err) => {
    console.log("Could not connected to database : " + err);
  };


const studentRoute = require("./routes/student.route");
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors());
// API
app.use("/api", studentRoute);
// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});
// Find 404
app.use((req, res, next) => {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
