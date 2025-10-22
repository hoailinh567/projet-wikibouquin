BEGIN;

-- Table: role
CREATE TABLE IF NOT EXISTS "role" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL UNIQUE,
	"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NULL
);

-- Table: user
CREATE TABLE IF NOT EXISTS "user" (
	"id" SERIAL PRIMARY KEY,
	"email" VARCHAR(255) NOT NULL UNIQUE,
	"password_hash" VARCHAR(255) NOT NULL,
	"display_name" VARCHAR(50) NOT NULL UNIQUE,
    "role_id" INT NOT NULL REFERENCES "role"("id") ON DELETE RESTRICT,
	"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMPTZ NULL
);

-- Table: collection
CREATE TABLE IF NOT EXISTS "collection" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NULL
);

-- Table: book
-- Composite primary key: (isbn, collection_id)
CREATE TABLE IF NOT EXISTS "book" (
	"isbn" VARCHAR(17) NOT NULL,
	"collection_id" INT NOT NULL REFERENCES "collection"("id") ON DELETE CASCADE,
	"added_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"is_visible" BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY ("isbn", "collection_id"),
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"("email");
CREATE INDEX IF NOT EXISTS idx_user_display_name ON "user"("display_name");
CREATE INDEX IF NOT EXISTS idx_user_role_id ON "user"("role_id");

CREATE INDEX IF NOT EXISTS idx_collection_user_id ON "collection"("user_id");
CREATE INDEX IF NOT EXISTS idx_collection_created_at ON "collection"("created_at");

CREATE INDEX IF NOT EXISTS idx_book_collection_id ON "book"("collection_id");

CREATE UNIQUE INDEX IF NOT EXISTS uq_role_name ON "role"("name");


COMMIT;