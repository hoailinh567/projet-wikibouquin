import { client } from "../utils/db.ts";

type Role = {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

const roleDatamapper = {
    async findByName(name: string) {
        const result = await client.query<Role>({
            text: `
        SELECT * FROM role WHERE name = $1
      `,
            values: [name]
        });

        if (!result.rows[0]) {
            return null;
        }

        return result.rows[0];
    }
}

export default roleDatamapper;