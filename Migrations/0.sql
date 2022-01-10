-- fund-related:

CREATE TABLE files (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null,
    "filename"                text not null,
    "size"                    int not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TYPE operator_type AS ENUM (
    'dim',
    'firm',
    'individual',
    'none'
);

CREATE TABLE operators (
    "id"                      int primary key generated always as identity,
    "type"                    operator_type not null,
    "name"                    text not null,          -- e.g. Tatton, LGT Vestra, IBOSS
    "fee"                     decimal not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE portfolios (
    "id"                      int primary key generated always as identity,
    "name"                    text not null,    -- e.g. "IBOSS MPS PORTFOLIO 2"
    "operator_id"             int not null,     -- (MPS is run by a DIM, etc.)
    "weighted_ocf"            decimal not null,
    "ex_ante_fee"             decimal not null,
    "file_id"                 int,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_operator          FOREIGN KEY(operator_id)       REFERENCES operators(id)          ON DELETE CASCADE,
    CONSTRAINT fk_file              FOREIGN KEY(file_id)           REFERENCES files(id)              ON DELETE CASCADE
);

-- CREATE TABLE portfolio_factsheets (
--     "id"                      int primary key generated always as identity,
--     "portfolio_id"            int not null,
--     "file_id"                 int not null,
--     "timestamp"               timestamp default current_timestamp,
--     CONSTRAINT fk_portfolio         FOREIGN KEY(portfolio_id) REFERENCES portfolios(id)     ON DELETE CASCADE,
--     CONSTRAINT fk_file              FOREIGN KEY(file_id)      REFERENCES files(id)          ON DELETE CASCADE
-- );

CREATE TABLE policy_types (
    "id"                      int primary key generated always as identity,
    "name"                    text not null,          -- e.g. SIPP (a pension), PP (personal pension), Equity ISA
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE policy_providers (
    "id"                      int primary key generated always as identity,
    "name"                    text not null,          -- e.g. Aviva
    "pricing"                 text not null,
    "timestamp"               timestamp default current_timestamp
);

-- client-related:

CREATE TABLE clients (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null,
    "forenames"               text not null,
    "surname"                 text not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE policies (
    "id"                      int primary key generated always as identity,
    "client_id"               int not null,
    "policy_type_id"          int not null,
    "policy_provider_id"      int not null,
    "external_id"             text not null,         -- e.g., AV1234-001
    "platform_discount"       decimal not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client            FOREIGN KEY(client_id)          REFERENCES clients(id)          ON DELETE CASCADE,
    CONSTRAINT fk_policy_type       FOREIGN KEY(policy_type_id)     REFERENCES policy_types(id)     ON DELETE CASCADE,
    CONSTRAINT fk_policy_provider   FOREIGN KEY(policy_provider_id) REFERENCES policy_providers(id) ON DELETE CASCADE
);

-- Inside the Client page, add a new row, choosing the policy, portfolio & split (split required if a policy has > 1 portfolios ?)
CREATE TABLE holdings (
    "id"                      int primary key generated always as identity,
    "client_id"               int not null,
    "policy_id"               int not null,
    "portfolio_id"            int not null,
    "proportion"              decimal not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client            FOREIGN KEY(client_id)           REFERENCES clients(id)           ON DELETE CASCADE,
    CONSTRAINT fk_policy            FOREIGN KEY(policy_id)           REFERENCES policies(id)          ON DELETE CASCADE,
    CONSTRAINT fk_portfolio         FOREIGN KEY(portfolio_id)        REFERENCES portfolios(id)        ON DELETE CASCADE
);

CREATE TYPE review_state AS ENUM (
    'DRAFT',
    'SENT',
    'ACCEPTED'
);

CREATE TABLE reviews (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null,
    "client_id"               int not null,
    "state"                   review_state default 'DRAFT' not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client            FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);
