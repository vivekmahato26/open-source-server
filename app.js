const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const auth = require("./middleware/auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);
mongoose.set("useUnifiedTopology", true);
mongoose.set("debug", true);
mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ogjsn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    app.listen(process.env.PORT || 8000);
  })
  .catch(err => {
    console.log(err);
  });
