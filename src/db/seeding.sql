-- Inserts initial roles into the database

INSERT INTO role (name) VALUES ('user')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role (name) VALUES ('admin')
ON CONFLICT (name) DO NOTHING;
