import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../lib/db";
import jwt from 'jsonwebtoken';

export interface createUserPayload {
    email: string,
    password: string,
    firstName: string,
    lastName?: string,
};

export interface getUserTokenPayload {
    email: string,
    password: string,
}

export interface tokenPayload {
    email: string,
    id : string,
}

const JWT_SECRET = process.env.JWT_SECERT || "$Akash@022#"

class UserService {
    private static generateHash(salt: string, password: string) {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    private static generateToken(payload: tokenPayload, JWT_SECRET: string) {
        return jwt.sign(payload, JWT_SECRET);
    }

    public static createUser(payload: createUserPayload) {
        const { firstName, email, password, lastName } = payload;
        const salt = randomBytes(32).toString('hex');
        const hashPassword = this.generateHash(salt, password);
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashPassword,
                salt: salt,
            }
        })
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } });
    }

    public static getUserById(id: string) {
        return prismaClient.user.findUnique({ where: { id } });
    }

    public static async getUserToken(payload: getUserTokenPayload) {
        const { email, password } = payload;
        const user = await this.getUserByEmail(email);

        if (!user) throw new Error('User not found');

        const userSalt: string = user.salt || '';
        const hashPassword = this.generateHash(userSalt, password);

        if (hashPassword !== user.password) throw new Error("Wrong Password");
        const token = this.generateToken({ id: user.id, email: user.email || ""}, JWT_SECRET);
        return token;
    }

    public static decodeJWTToken(token: string) {
        return jwt.verify(token, JWT_SECRET);
    }
};


export default UserService;