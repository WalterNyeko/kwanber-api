const  path = require("path");
const { ApolloServer, makeExecutableSchema } = require("apollo-server");
const  resolvers  =  require("./graphql/resolvers/index");
const { importSchema } = require("graphql-import");
const db = require("./database/index");

const typeDefs = importSchema(path.join(__dirname, '/graphql/schema/schema.graphql'));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  schema,
  context:{ db }
});

server.listen().then(({url})=>{
  console.log(`server started on ${url}`);
});