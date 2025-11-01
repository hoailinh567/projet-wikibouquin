import { client } from "../utils/db.ts";

interface NewUser {
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
}

interface CreatedUser {
    id: number;
    username: string;
    email: string;
    role_id: number;
}

const userDataMapper = {
    async isEmailAlreadyUsed(email: string): Promise<boolean> {
        const { rows } = await client.query(
            `SELECT COUNT(id)::int AS used FROM "user" WHERE email = $1`,
            [email]
        );
        return (rows[0]?.used ?? 0) > 0;
    },

    async isUsernameAlreadyUsed(username: string): Promise<boolean> {
        const { rows } = await client.query(
            `SELECT COUNT(id)::int AS used FROM "user" WHERE username = $1`,
            [username]
        );
        return (rows[0]?.used ?? 0) > 0;
    },

    async create({ username, email, password_hash, role_id }: NewUser): Promise<CreatedUser> {
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
};

export default userDataMapper;
