export interface PublicUser {
    id: number;
    username: string;
    email: string;
    role_id: number;
    collection_ids: number[];
    books: { isbn: string, collection_id: number }[];
}
