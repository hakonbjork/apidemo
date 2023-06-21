const { ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");

  const { MONGO_URI } = process.env;
  
  exports.connect = () => {
    // Connecting to the database
    mongoose
      .connect(MONGO_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }})
      .then(() => {
        console.log("Successfully connected to database");
      })
      .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
      });
  };