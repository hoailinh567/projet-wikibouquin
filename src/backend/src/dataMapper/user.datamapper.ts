import { client } from "../utils/db.ts";

interface NewUser {
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
}

interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
}

const userDataMapper = {
    async isEmailAlreadyUsed(email: string): Promise<boolean> {
        const { rows } = await client.query(
            `SELECT COUNT(id)::int AS count FROM "user" WHERE email = $1`,
            [email]
        );

        return Boolean(rows?.[0]?.count);
    },

    async isUsernameAlreadyUsed(username: string): Promise<boolean> {
        const { rows } = await client.query(
            `SELECT COUNT(id)::int AS used FROM "user" WHERE username = $1`,
            [username]
        );
        return (rows[0]?.used ?? 0) > 0;
    },

    async create({ username, email, password_hash, role_id }: NewUser): Promise<User> {
        const { rows } = await client.query(
            `
            INSERT INTO "user" (username, email, password_hash, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, role_id
            `,
            [username, email, password_hash, role_id]
        );
        return rows[0];
    },
    
    // get user by email for login
    async getUserByEmail(email: string): Promise<User> {
        const { rows } = await client.query(
            `
            SELECT * FROM "user"
            WHERE email = $1;
            `,
            [email]
        );

        return rows[0];
    },

    // pour avoir le profil public d'un utilisateur via son username
    async getUserByUsername(username: string): Promise<User> {
        const { rows } = await client.query(
            `
            SELECT * FROM "user"
            WHERE username = $1;
            `,
            [username]
        );

        return rows[0];
    },
};

export default userDataMapper;
