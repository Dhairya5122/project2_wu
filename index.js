// Importing required modules
require("dotenv").config();
const mongoose = require("mongoose");
require("./models/registration");
const app = require("./app");
const fs = require('fs');
const https = require('https');

// const PORT = 3001;


// Connecting to the MongoDB database
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Certificate
// const privateKey = fs.readFileSync('./server.key', 'utf8');
// const certificate = fs.readFileSync('./server.cert', 'utf8');
// const credentials = { key: privateKey, cert: certificate };
const privateKey = fs.readFileSync('serverp.pem', 'utf8'); // Update the path to match your directory structure
const certificate = fs.readFileSync('serverp.pem', 'utf8'); // Update the path to match your directory structure
const credentials = { key: privateKey, cert: certificate };

// Handling MongoDB connection events
mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.error(`Connection error: ${err.message}`);
  });
// Starting the HTTPS server
const httpsServer = https.createServer(credentials, app);


// // Starting the Express server
// const server = app.listen(3001, () => {
//   console.log(`Express is running on port ${server.address().port}`);
// });

httpsServer.listen(3001, () => {
  console.log(`Express is running on port 3001`);
});
