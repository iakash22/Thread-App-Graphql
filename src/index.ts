import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello : String
                say(name :String) : String 
            }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello from GraphQL!",
                say : (_, {name} : {name : String}) => `Hey ${name}, How are you.`
            }
        }
    });

    await server.start();

    app.get('/', (req, res) => {
        res.send("Hello From Server.");
    });

    app.use("/graphql", expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`Listen on Port ${PORT}`);
    })
}

init();