const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const schema = require("./schemas/schema");

const app = express();

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("listening to the port 4000");
});
