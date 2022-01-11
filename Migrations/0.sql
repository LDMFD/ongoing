-- fund-related:

CREATE TABLE files (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null,
    "filename"                text not null,
    "size"                    int not null,
    "timestamp"               timestamp default current_timestamp
);

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

CREATE TYPE operator_type AS ENUM (
    'dim',
    'firm',
    'individual',
    'none'          -- then Operator.Name should default to the policy number
);

CREATE TABLE operators (
    "id"                      int primary key generated always as identity,
    "type"                    operator_type not null,
    "name"                    text not null,          -- e.g. Tatton, LGT Vestra, IBOSS
    "fee"                     decimal not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE models (   -- was "Portfolios"
    "id"                      int primary key generated always as identity,
    "name"                    text not null,    -- e.g. "IBOSS MPS PORTFOLIO 2"
    "operator_id"             int not null,     -- (MPS is run by a DIM, etc.)
    "weighted_ocf"            decimal not null,
    "ex_ante_fee"             decimal not null,
    "file_id"                 int,              -- factsheet
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_operator          FOREIGN KEY(operator_id)       REFERENCES operators(id)          ON DELETE CASCADE,
    CONSTRAINT fk_file              FOREIGN KEY(file_id)           REFERENCES files(id)              ON DELETE CASCADE
);

-- For individually managed policy funds (no model)
CREATE TABLE funds (
    "id"                      int primary key generated always as identity,
    "name"                    text not null,          -- e.g. Tatton, LGT Vestra, IBOSS
    "proportion"              decimal not null,
    "weighted_ocf"            decimal not null,
    "ex_ante_fee"             decimal not null,
    "sedol_code"              text,
    "isin_number"             text,
    "citicode"                text
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
    "external_id"             text not null,         -- Policy number, e.g., AV1234-001
    "platform_discount"       decimal not null,
    "client_id"               int not null,
    "policy_type_id"          int not null,
    "policy_provider_id"      int not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client            FOREIGN KEY(client_id)          REFERENCES clients(id)          ON DELETE CASCADE,
    CONSTRAINT fk_policy_type       FOREIGN KEY(policy_type_id)     REFERENCES policy_types(id)     ON DELETE CASCADE,
    CONSTRAINT fk_policy_provider   FOREIGN KEY(policy_provider_id) REFERENCES policy_providers(id) ON DELETE CASCADE
);

-- Funds attached to a policy but no model
CREATE TABLE policy_funds (
    "id"                      int primary key generated always as identity,
    "fund_id"                 int not null,
    "policy_id"               int not null,
    CONSTRAINT fk_fund              FOREIGN KEY(fund_id)             REFERENCES funds(id)             ON DELETE CASCADE,
    CONSTRAINT fk_policy            FOREIGN KEY(policy_id)           REFERENCES policies(id)          ON DELETE CASCADE
);

-- Policy + Model
CREATE TABLE portfolios (   -- was "Holdings"
    "id"                      int primary key generated always as identity,
    "client_id"               int not null,
    "policy_id"               int not null,
    "model_id"                int not null,
    "proportion"              decimal not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client            FOREIGN KEY(client_id)           REFERENCES clients(id)           ON DELETE CASCADE,
    CONSTRAINT fk_policy            FOREIGN KEY(policy_id)           REFERENCES policies(id)          ON DELETE CASCADE,
    CONSTRAINT fk_model             FOREIGN KEY(model_id)            REFERENCES models(id)            ON DELETE CASCADE
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
    "report"                  json not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client            FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);
