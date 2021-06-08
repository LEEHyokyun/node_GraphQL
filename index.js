const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

//Query 작성
const schema = buildSchema(`
    type Query{
        hello : String,
        today : Int
    }
`);

//response
const root = {
  hello: () => "hello world",
  today: () => 0609,
};

//express server 작동
const app = express();
//url은 /graphql로 통일
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema, //schema
    rootValue: root, //rootValue
    graphiql: true, //GUI(postman)
  })
);

app.listen(4000, () => {
  console.log("Run Server");
});
