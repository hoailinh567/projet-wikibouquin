import { client } from "../utils/db.ts";

type Collection = {
    id: number;
    userId: number;
    books?: BookInCollection[];
}

type BookInCollection = {
    isbn: string;
    collection_id: number;
    is_visible: boolean;
}

const collectionDataMapper = {
    async create(userId: number): Promise<Collection> {
        const { rows } = await client.query(
            `
            INSERT into "collection" (user_id)
            VALUES ($1)
            RETURNING id, user_id
            `,
            [userId]
        )

        return rows[0];
    },

    async getCollectionsIdByUserId(userId: number): Promise<number[]> {
        const { rows } = await client.query(
            `
            SELECT id
            FROM "collection"
            WHERE user_id = $1
            `,
            [userId]
        )

        return rows.map(row => row.id);
    },

    async getCollectionByUserId(userId: number): Promise<Collection | null> {
        const { rows } = await client.query(
            `
            SELECT
                c.id,
                c.user_id,
                b.isbn,
                b.collection_id,
                b.is_visible
            FROM "collection" c
            LEFT JOIN "book" b ON c.id = b.collection_id
            WHERE c.user_id = $1
            AND b.is_visible = true
            `,
            [userId]
        )

        if (rows.length === 0) {
            return null;
        }

        const collection: Collection = {
            id: rows[0].id,
            userId: rows[0].user_id,
            books: rows[0].isbn ? rows.map(row => ({
                isbn: row.isbn,
                collection_id: row.collection_id,
                is_visible: row.is_visible
            })) : []
        };

        return collection;
    },

    async getPrivateCollectionByUserId(userId: number): Promise<Collection | null> {
        const { rows } = await client.query(
            `
            SELECT
                c.id,
                c.user_id,
                b.isbn,
                b.collection_id,
                b.is_visible
            FROM "collection" c
            LEFT JOIN "book" b ON c.id = b.collection_id
            WHERE c.user_id = $1
            `,
            [userId]
        )

        if (rows.length === 0) {
            return null;
        }

        const collection: Collection = {
            id: rows[0].id,
            userId: rows[0].user_id,
            books: rows[0].isbn ? rows.map(row => ({
                isbn: row.isbn,
                collection_id: row.collection_id,
                is_visible: row.is_visible
            })) : []
        };

        return collection;
    },

    async addBook(isbn: string, collectionId: number): Promise<BookInCollection> {
        const { rows } = await client.query(
            `
            INSERT INTO "book" (isbn, collection_id)
            VALUES ($1, $2)
            RETURNING isbn, collection_id
            `,
            [isbn, collectionId]
        )

        return rows[0];
    },

    async deleteBook(isbn: string, collectionId: number): Promise<Boolean> {
        const { rows } = await client.query(
            `
            DELETE FROM "book"
            WHERE isbn=$1 AND collection_id=$2
            `,
            [isbn, collectionId]
        )

        return rows[0];
    },

    // Vérifie si un livre est dans une collection de l'utilisateur
    async hasBookInUserCollection(isbn: string, collectionId: number): Promise<boolean> {
        const { rows } = await client.query(
            `
            SELECT COUNT(*) AS count
            FROM "book"
            WHERE isbn=$1 AND collection_id=$2
            `,
            [isbn, collectionId]
        )

        return parseInt(rows[0].count, 10) > 0;
    },

    async toggleBookVisility(isbn: string, collection_id: number, is_visible: boolean): Promise<BookInCollection> {
        const { rows } = await client.query(
            `
            UPDATE "book"
            SET is_visible = $3
            WHERE isbn = $1 AND collection_id = $2
            RETURNING isbn, collection_id, is_visible
            `,
            [isbn, collection_id, is_visible]
        );

        return rows[0] ?? null;
    }
}

export default collectionDataMapper;