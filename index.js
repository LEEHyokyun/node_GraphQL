const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

//Query 작성
//schema를 구성하는 data 요소들을 작성해준다
//type Query data 이름{data}
//! = 필수필드

//type인지 input인지 확인!

//Mutation : 입력을 받고, Product를 보여준다(return까지)
//Mutation으로 설언된 addProdct Query를, graphql query에 입력하여 그대로 데이터를 추가할 수 있는 것

//데이터추가시 이용하는 Query문(Mutation으로 선언된 addProduct Query 이용)
/*{
  "query" : "mutation addProduct($input:ProductInput) {addProduct(input : $input) {id} }",
  "variables" : { "input" : {"name" : "녹차", "price" : 3000, "description" : "롯데마트 녹차 3000원"}}
}
*/

//데이터업데이트시 이용하는 Query문(이 역시 Mutation을 통해 선언됨)
/*
{
    "query" : "mutation updateProduct( $id : ID!, $input : ProductInput!) {updateProduct(id : $id, input : $input) {id} }",
    "variables" : { "id" : 2, "input" : {"name" : "사과", "price" : 3500, "description" : "롯데마트 사과 3500원(수정)"}}
}
*/

//데이터삭제시 이용하는 Query문
/*
{
    "query" : "mutation deleteProduct( $id : ID!) {deleteProduct(id : $id)}",
    "variables" : { "id" : 2} 
}
*/

const schema = buildSchema(`

    input ProductInput{
      name : String
      price : Int
      description : String
    }

    type Product{
        id : ID!
        name : String
        price : Int
        description : String
    }

    type Query{
        getProduct (id : ID! ) : Product
      }

    type Mutation{
      addProduct( input : ProductInput ) : Product
      updateProduct( id: ID!, input : ProductInput! ) : Product
      deleteProduct( id: ID!) : String
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

//ProductInput data
const ProductInput = {
  name: "첫번째 제품",
  price: "2000",
  description: "참외",
};

//response
const root = {
  //getProduct, 인자를 id로 받아온다
  //해당 인자와 id값이 일치하는 product data 응답
  getProduct: ({ id }) =>
    products.find((product) => product.id === parseInt(id)),

  addProduct: ({ input }) => {
    //data를 추가하면서, input한 data 항목에 id 추가
    //현재 Product data(list)에 id를 추가하면서 data를 추가하는 과정임
    //현재 받은 길이에 + 1이 최초 입력(추가)하는 id가 된다.
    input.id = parseInt(products.length + 1);
    products.push(input);

    return root.getProduct({ id: input.id });
  },

  //id, input(data)를 인자로 받고,
  //먼저 인덱스를 찾는다(findIndex함수)
  //products(배열)의 인덱스를 통해 해당 vairable에 접근하여 update한다
  updateProduct: ({ id, input }) => {
    const index = products.findIndex((product) => product.id === parseInt(id));
    products[index] = {
      id: parseInt(id),
      ...input,
    };
    return products[index];
  },

  deleteProduct: ({ id }) => {
    const index = products.findIndex((product) => product.id === parseInt(id));
    //해당 인덱스를 받아 인덱스로부터 n번째의 항목을 삭제한다
    products.splice(index, 1);

    return "removed data";
  },
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

//graphql의 프론트앤드에서 사용하기 위한 static code
//static 폴더활용!
app.use("/static", express.static("static"));

app.listen(4000, () => {
  console.log("Run Server");
});
