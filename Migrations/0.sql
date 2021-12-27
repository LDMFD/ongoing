CREATE TABLE clients (
    "id"            int primary key generated always as identity,
    "uid"           text,
    "forenames"     text,
    "surname"       text,
    "timestamp"     timestamp default current_timestamp
);

CREATE TYPE review_state AS ENUM (
    'DRAFT',
    'SENT',
    'ACCEPTED'
);

CREATE TABLE reviews (
    "id"            int primary key generated always as identity,
    "uid"           text,
    "client_id"     int,
    "state"         review_state default 'DRAFT',
    "timestamp"     timestamp default current_timestamp,
    CONSTRAINT      fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE files (
    "id"            int primary key generated always as identity,
    "uid"           text,
    "filename"      text,
    "size"          int,
    "review_id"     int,
    "timestamp"     timestamp default current_timestamp,
    CONSTRAINT      fk_review FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE
)
