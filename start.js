const { graphql, buildSchema } = require("graphql");

//Query 생성
//Query인 hello 생성 .. 이에 대한 응답은 String이다.
//Query문이 그대로 express 서버로 request 전달.
const schema = buildSchema(`
    type Query{
        hello : String,
        today : Int
    }
`);

//hello에 대한 Query를 받아 문자열을 response로 보내준다
const root = {
  hello: () => "Nice to meet you",
  today: () => 0608,
};

//Query를 받아 응답해주는 로직
//root 구성을 통해 hello에 대한 응답을 문자열로 선언
//그 문자열이 response에 담겨져 출력됨
graphql(schema, "{today}", root).then((response) => {
  console.log(response);
});
