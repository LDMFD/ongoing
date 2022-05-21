Legacy - do not use

CREATE TYPE user_type AS ENUM (
    'admin',
    'advisor',
    'client'
);

CREATE TABLE users (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "email"                   text not null unique,
    "verified"                bool not null default false,
    "type"                    user_type not null,
    "timestamp"               timestamp default current_timestamp
);

-- fund-related:

CREATE TABLE files (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "filename"                text not null,
    "size"                    int not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE policy_types (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "name"                    text not null unique,          -- e.g. SIPP (a pension), PP (personal pension), Equity ISA
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE policy_providers (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "name"                    text not null unique,          -- e.g. Aviva
    "pricing"                 text not null,
    "custom_pricing"          text not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE provider_charges (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "policy_provider_id"      int not null,
    "desc"                    text not null,
    "charge"                  decimal not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_policy_provider FOREIGN KEY(policy_provider_id) REFERENCES policy_providers(id) ON DELETE RESTRICT
);

CREATE TYPE operator_type AS ENUM (
    'dim',
    'firm',
    'individual',
    'none'          -- then Operator.Name should default to the policy number
);

CREATE TABLE operators (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "type"                    operator_type not null,
    "name"                    text not null unique,          -- e.g. Tatton, LGT Vestra, IBOSS
    "fee"                     decimal not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE models (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "name"                    text not null unique,    -- e.g. "IBOSS MPS PORTFOLIO 2"
    "operator_id"             int not null,     -- (MPS is run by a DIM, etc.)
    "weighted_ocf_fee"        decimal not null,
    "weighted_ex_ante_fee"    decimal not null,
    "file_id"                 int,              -- factsheet
    "modified"                timestamp,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_operator FOREIGN KEY(operator_id) REFERENCES operators(id) ON DELETE RESTRICT,
    CONSTRAINT fk_file FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

-- For individually managed policy funds (no model)
CREATE TABLE funds (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "name"                    text not null unique,          -- e.g. Tatton, LGT Vestra, IBOSS
    "ocf_fee"                 decimal not null,
    "ex_ante_fee"             decimal not null,
    "sedol_code"              text,
    "isin_number"             text,
    "citicode"                text,
    "file_id"                 int,
    "modified"                timestamp,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_file FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

-- Attitude To Risk Questionnaire

CREATE TABLE risk_providers (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "name"                    text not null unique,          -- "Dynamic Planner", "FE Analytics", "Finimetrica"
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE risk_levels (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "risk_provider_id"        int,
    "level"                   int,
    "label"                   text,
    "desc"                    text,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_risk_provider FOREIGN KEY(risk_provider_id) REFERENCES risk_providers(id) ON DELETE RESTRICT
);

-- client-related:

CREATE TABLE clients (
    "id"                      int primary key generated always as identity,
    "user_id"                 int not null unique,
    "forenames"               text not null,
    "fee"                     decimal not null default 0.75,
    "surname"                 text not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE risk_assessments (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "risk_level_id"           int not null,
    "questionnaire_file_id"   int not null,
    "completed"               timestamp default null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_risk_level FOREIGN KEY(risk_level_id) REFERENCES risk_levels(id) ON DELETE RESTRICT,
    CONSTRAINT fk_questionnaire FOREIGN KEY(questionnaire_file_id) REFERENCES files(id) ON DELETE RESTRICT
);

CREATE TABLE fact_finds (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "file_id"                 int not null,
    "submitted"               timestamp default null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fact_find FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

CREATE TABLE fees_reports (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "file_id"                 int not null,
    "submitted"               timestamp default null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fees_report FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

CREATE TABLE provider_discounts (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "policy_provider_id"      int not null,
    "discount"                decimal default null,
    "timestamp"               timestamp default current_timestamp,
    UNIQUE ("client_id", "policy_provider_id"),
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy_provider FOREIGN KEY(policy_provider_id) REFERENCES policy_providers(id) ON DELETE RESTRICT
);

CREATE TABLE policies (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "external_id"             text not null unique,         -- Policy number, e.g., AV1234-001
    "client_id"               int not null,
    "policy_type_id"          int not null,
    "policy_provider_id"      int not null,
    "monthly_contributions"   int,    -- 0 for none, null for no data
    "start_value"             int,
    "end_value"               int,
    "start_date"              timestamp default null,
    "end_date"                timestamp default null,
    "notes"                   text not null,
    "file_id"                 int,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy_type FOREIGN KEY(policy_type_id) REFERENCES policy_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy_provider FOREIGN KEY(policy_provider_id) REFERENCES policy_providers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_file FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

-- Funds attached to a policy, no model
CREATE TABLE policy_funds (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "policy_id"               int not null,
    "fund_id"                 int not null,
    "proportion"              decimal not null,
    "timestamp"               timestamp default current_timestamp,
    UNIQUE ("client_id", "policy_id", "fund_id"),
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fund FOREIGN KEY(fund_id) REFERENCES funds(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy FOREIGN KEY(policy_id) REFERENCES policies(id) ON DELETE RESTRICT
);

-- Policy + model
CREATE TABLE portfolios (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "policy_id"               int not null,
    "model_id"                int not null,
    "proportion"              decimal not null,
    "timestamp"               timestamp default current_timestamp,
    UNIQUE ("client_id", "policy_id", "model_id"),
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy FOREIGN KEY(policy_id) REFERENCES policies(id) ON DELETE RESTRICT,
    CONSTRAINT fk_model FOREIGN KEY(model_id) REFERENCES models(id) ON DELETE RESTRICT
);

-- review-related:

-- This list also found in ReviewModule.go and ModuleTypes.js
CREATE TYPE module_type AS ENUM (
    'introduction',         -- "Introduction"; preset, rich text, valuation
    
    -- "Fact find, Risk profile & Objectives"
    'profile',                              -- preset
        'profile:fact-find',                    -- preset + file "Fact find"
        'profile:risk',                         -- preset, risk assessment (level, name, desc, file)
        'profile:objectives',                   -- preset, text with button to populate from prevous
    
    -- "Policy Valuations"
    'policy-valuations',                    -- preset, file "Policy document"
        'policy-valuations:valuation',          -- (for each policy): preset, start + end values, text
        'policy-valuations:contributions',      -- (for each policy): preset, policy.monthly_contributions, text

    -- "Fees"
    'fees',                                 -- preset
        'fees:advice-fee',                      -- preset, client.advice_fee, calculations, file "Fees report"
        'fees:policy-fees',                     -- preset, for-each policy
        'fees:fund-level',                      -- preset, file - from models
        'fees:portfolio-level',                 -- preset, file - from models
        'fees:dim',                         -- preset

    -- "Suitability and Advice"
    'conclusions',
        'conclusions:advice-given',         -- text
        'conclusions:due-diligence',        -- text
        'conclusions:ongoing-suitability',  -- text
        'conclusions:action-points'         -- text
);

CREATE TABLE module_presets (
    "id"                      int primary key generated always as identity,
    "module_type"             module_type not null,
    "text"                    text,
    "timestamp"               timestamp default current_timestamp,
    UNIQUE ("module_type")
);

-- TODO
CREATE TABLE riskassessment_templates (
    "id"                      int primary key generated always as identity,
    "label"                   text not null,
    "text"                    text not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TYPE review_state AS ENUM (
   'draft',
   'final'
);

CREATE TABLE reviews (
    "id"                      int primary key generated always as identity,
    "uid"                     text not null unique,
    "client_id"               int not null,
    "state"                   review_state default 'draft' not null,
    "report"                  json default null,
    "start_date"              timestamp default null,
    "end_date"                timestamp default null,
    "finalized_date"          timestamp default null,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT
);

CREATE TABLE modules (
    "id"                      int primary key generated always as identity,
    "client_id"               int not null,
    "type"                    module_type not null,
    "intro"                   text not null,
    "text"                    text not null,
    UNIQUE ("client_id", "type"),
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT
);
