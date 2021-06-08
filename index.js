const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

//Query 작성
//schema를 구성하는 data 요소들을 작성해준다
//type Query data 이름{data}
//! = 필수필드
const schema = buildSchema(`

    type Product{
        id : ID!
        name : String
        price : Int
        description : String
    }

    type Query{
        getProduct (id : ID! ) : Product
    }
`);

//임의의 data
const products = [
  {
    id: 1,
    name: "첫번째 제품",
    price: 2000,
    description: "포도",
  },
  {
    id: 2,
    name: "두번째 제품",
    price: 4000,
    description: "사과",
  },
];

//response
const root = {
  //getProduct, 인자를 id로 받아온다
  //해당 인자와 id값이 일치하는 product data 응답
  getProduct: ({ id }) =>
    products.find((product) => product.id === parseInt(id)),
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
