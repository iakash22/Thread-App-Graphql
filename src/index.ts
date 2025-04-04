import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import graphqlServer from './graphql';
import UserService from './services/user';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send("Hello From Server.");
    });

    app.use(
        "/graphql",
        expressMiddleware(
            await graphqlServer(),
            {
                context: async ({ req }) => {
                    const token = req.headers['authorization'];
                    try {
                        const user = UserService.decodeJWTToken(token as string);
                        return { user };
                    } catch (error) {
                        return {};
                    }
            } }));

    app.listen(PORT, () => {
        console.log(`Listen on Port ${PORT}`);
    })
}

init();