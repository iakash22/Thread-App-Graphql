import { ApolloServer } from '@apollo/server';
import User from './user';

const graphqlServer = async () => {
    const server = new ApolloServer({
        typeDefs: `
                ${User.typeDefs}
                type Query {
                    hello : String
                    ${User.queries}
                }
                type Mutation {
                    ${User.mutations}
                }
            `,
        resolvers: {
            Query: {
                hello: () => "Hello From GraphQL!",
                ...User.resolvers.queries
                
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    });

    await server.start();

    return server;
}

export default graphqlServer;