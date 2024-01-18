const graphql = require("graphql");
const axios = require("axios");


const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

const CompagnyType = new GraphQLObjectType({
  name: "Compagny",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/compagnies/${parentValue.id}/users`)
          .then((response) => response.data);
      },
    },
  }),
});
/* The code is defining a GraphQL object type called "User". This object type represents the structure
of a user in the GraphQL schema. It has three fields: "id" of type GraphQLString, "firstName" of
type GraphQLString, and "age" of type GraphQLInt. These fields define the properties that can be
queried for a user in the GraphQL API. */
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    compagny: {
      type: CompagnyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/compagnies/${parentValue.compagnyId}`)
          .then((response) => response.data);
      },
    },
  }),
});

/* The `RootQuery` is a GraphQL object type that represents the root query of the GraphQL schema. It
defines the available queries that can be made to retrieve data from the schema. */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data);
      },
    },
    compagny: {
      type: CompagnyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/compagnies/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        compagnyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        return axios
          .post(`http://localhost:3000/users`, { firstName, age })
          .then((response) => response.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((response) => response.data);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        compagnyId: { type: GraphQLString },
      },
      resolve(parentValue, { id, firstName, age, compagnyId }) {
        return axios
          .patch(`http://localhost:3000/users/${id}`, {
            firstName,
            age,
            compagnyId,
          })
          .then((response) => response.data);
      },
    },
  },
});
module.exports = new GraphQLSchema({ query: RootQuery, mutation });
