const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //export a middleware function
const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  //Middleware to allow cross-origin requests
  // Every client can send request to the server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

// use graphQL middleware, one endpoint for all APIs
app.use(
  "/graphql",
  graphqlHTTP({
    //object for configuriing graphql (real endpoints/ query)
    // '!': non null
    // input type: used in argument input
    schema: graphqlSchema, // query: fetching data, mutation: changing data, names should be unique
    rootValue: graphqlResolvers, //all resolver functions that match names schema
    graphiql: true, // for query testing UI, visit at http://localhost:5000/graphql
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pmplg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
