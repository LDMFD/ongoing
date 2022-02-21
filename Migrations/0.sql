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

INSERT INTO users ("type", "email", "uid") VALUES ('admin',   'darren@tp1.org',           '5f781892e3594e2b9578171de55c18c6');
INSERT INTO users ("type", "email", "uid") VALUES ('advisor', 'company@tp1.org',          'bcc64c156d5f49df98c249909cd49a42');

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
    "name"                    text not null unique,          -- e.g. SIPP (a pension), PP (personal pension), Equity ISA
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE policy_providers (
    "id"                      int primary key generated always as identity,
    "name"                    text not null unique,          -- e.g. Aviva
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
    "name"                    text not null unique,          -- e.g. Tatton, LGT Vestra, IBOSS
    "fee"                     decimal not null,
    "timestamp"               timestamp default current_timestamp
);

CREATE TABLE models (
    "id"                      int primary key generated always as identity,
    "name"                    text not null unique,    -- e.g. "IBOSS MPS PORTFOLIO 2"
    "operator_id"             int not null,     -- (MPS is run by a DIM, etc.)
    "weighted_ocf_fee"        decimal not null,
    "weighted_ex_ante_fee"    decimal not null,
    "file_id"                 int,              -- factsheet
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_operator FOREIGN KEY(operator_id) REFERENCES operators(id) ON DELETE RESTRICT,
    CONSTRAINT fk_file FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

-- For individually managed policy funds (no model)
CREATE TABLE funds (
    "id"                      int primary key generated always as identity,
    "name"                    text not null unique,          -- e.g. Tatton, LGT Vestra, IBOSS
    "ocf_fee"                 decimal not null,
    "ex_ante_fee"             decimal not null,
    "sedol_code"              text,
    "isin_number"             text,
    "citicode"                text,
    "file_id"                 int,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_file FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE RESTRICT
);

-- Attitude To Risk Questionnaire

-- TODO
CREATE TABLE risk_providers (
    "id"                      int primary key generated always as identity,
    "name"                    text not null unique          -- "Dynamic Planner", "FE Analytics", "Finimetrica"
);

-- TODO
CREATE TABLE risk_levels (
    "id"                      int primary key generated always as identity,
    "risk_provider_id"        int,
    "level"                   int,
    "label"                   text,
    "desc"                    text,
    CONSTRAINT fk_risk_provider FOREIGN KEY(risk_provider_id) REFERENCES risk_providers(id) ON DELETE RESTRICT
);

-- client-related:

-- TODO
CREATE TABLE risk_assessment (
    "id"                      int primary key generated always as identity,
    "client_id"               int not null,
    "risk_provider_id"        int not null,
    "risk_level_id"           int not null,
    "questionnaire_file_id"   int not null,
    "fact_find_file_id"       int not null,
    "completed"               timestamp default null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_risk_provider FOREIGN KEY(risk_provider_id) REFERENCES risk_providers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_risk_level FOREIGN KEY(risk_level_id) REFERENCES risk_levels(id) ON DELETE RESTRICT,
    CONSTRAINT fk_questionnaire FOREIGN KEY(questionnaire_file_id) REFERENCES files(id) ON DELETE RESTRICT,
    CONSTRAINT fk_fact_find FOREIGN KEY(fact_find_file_id) REFERENCES files(id) ON DELETE RESTRICT
);

CREATE TABLE clients (
    "id"                      int primary key generated always as identity,
    "user_id"                 int not null unique,
    "forenames"               text not null,
    "fee"                     decimal not null default 0.75,
    "surname"                 text not null,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE policies (
    "id"                      int primary key generated always as identity,
    "external_id"             text not null unique,         -- Policy number, e.g., AV1234-001
    "platform_discount"       decimal default null,
    "client_id"               int not null,
    "policy_type_id"          int not null,
    "policy_provider_id"      int not null,
    "monthly_contributions"   int not null,    -- 0 for none, null for no data
    "start_value"             int,
    "end_value"               int,
    "timestamp"               timestamp default current_timestamp,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy_type FOREIGN KEY(policy_type_id) REFERENCES policy_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy_provider FOREIGN KEY(policy_provider_id) REFERENCES policy_providers(id) ON DELETE RESTRICT
);

-- Funds attached to a policy, no model
CREATE TABLE policy_funds (
    "id"                      int primary key generated always as identity,
    "client_id"               int not null,
    "policy_id"               int not null,
    "fund_id"                 int not null,
    "proportion"              decimal not null,
    "timestamp"               timestamp default current_timestamp,
    UNIQUE ("client_id", "policy_id", "fund_id"),
    CONSTRAINT fk_fund FOREIGN KEY(fund_id) REFERENCES funds(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy FOREIGN KEY(policy_id) REFERENCES policies(id) ON DELETE RESTRICT
);

-- Policy + model
CREATE TABLE portfolios (
    "id"                      int primary key generated always as identity,
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
    'intro',                -- "Introduction"; preset intro, valuation
    
    -- "Fact find, Risk profile & Objectives"
    'profile',              -- preset intro
        'fact-find',            -- preset intro + file
        'risk',                 -- preset intro, risk assessment (level, name, desc, file)
        'objectives',           -- preset intro, text with button to populate from prevous
    
    -- "Policy Valuations"
    'policies',             -- preset intro. Joined to policy with review_policies
        'valuation',            -- (for each policy): preset intro, start + end values, text
        'policy-funds',         -- (for each policy): preset intro, funds file, ocf, ex ante, weighted averages
        'contributions',        -- (for each policy): preset intro, policy.monthly_contributions, text

    -- "Portfolios"
    'portfolios',           -- preset intro
        'portfolio',            -- (for each portfolio): preset intro, ocf + ex ante, model.file, text, weighted averages

    -- "Fees"
    'fees',                 -- preset intro
        'advice-fee',            -- text, policy_providers.Pricing, Policy.platform_discount (if not null) embedded in Text from DB
        'policy-fund-fees',      -- text, file - from policy_funds
        'model-fund-fees',       -- text, file - from models
        'dim-fee',               -- text (from operators table if type DIM)

    -- "Suitability and Advice"
    'advice-given',         -- text
    'due-digilence',        -- text (dynamic presets from diligence_templates)
    'ongoing-suitability',  -- text
    'action-points'         -- text
);

CREATE TABLE module_presets (
    "id"                      int primary key generated always as identity,
    "module_type"             module_type not null,
    "text"                    text,
    "timestamp"               timestamp default current_timestamp
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
    "started"                 timestamp default current_timestamp,
    "finalized"               timestamp default null,
    CONSTRAINT fk_client FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE RESTRICT
);

CREATE TABLE review_modules (
    "id"                      int primary key generated always as identity,
    "review_id"               int not null,
    "type"                    module_type not null,
    "intro"                   text not null,
    "text"                    text not null,
    UNIQUE ("review_id", "type"),
    CONSTRAINT fk_review FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE  -- TODO check deletion behaviour here
);

CREATE TABLE review_policies (
    "id"                      int primary key generated always as identity,
    "module_id"               int not null,
    "policy_id"               int not null,
    CONSTRAINT fk_module FOREIGN KEY(module_id) REFERENCES review_modules(id) ON DELETE RESTRICT,
    CONSTRAINT fk_policy FOREIGN KEY(policy_id) REFERENCES policies(id) ON DELETE RESTRICT
);

CREATE TABLE review_portfolios (
    "id"                      int primary key generated always as identity,
    "module_id"               int not null,
    "portfolio_id"            int not null,
    CONSTRAINT fk_module FOREIGN KEY(module_id) REFERENCES review_modules(id) ON DELETE RESTRICT,
    CONSTRAINT fk_portfolio FOREIGN KEY(portfolio_id) REFERENCES portfolios(id) ON DELETE RESTRICT
);
