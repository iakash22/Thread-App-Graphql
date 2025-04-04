import { prismaClient } from "../../lib/db";
import UserService, { createUserPayload, getUserTokenPayload } from "../../services/user";

const queries = {
    getUserToken: async (_: any, payload: getUserTokenPayload) => {
        const token = UserService.getUserToken(payload);
        return token;
    },
    getCurrentLoggedInUser: async (_: any, parameter: any, context: any) => {
        // console.log(context.user);
        if (context && context.user) {
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }

        throw new Error("Unauthorized User");
    }
};

const mutations = {
    createUser: async (_: any, payload: createUserPayload) => {
        const data = await UserService.createUser(payload);
        return data.id;
    }
};

export const resolvers = { queries, mutations };