DELETE FROM module_presets;

INSERT INTO module_presets ("module_type", "text") VALUES ('introduction',         'This dashboard consists of a high-level overview of your situation and the policies and investments which are under the care of Integral Advice. It is designed to complement any discussions given in person, over the phone or by email, but doesn’t cover any specific advice points. These are covered by individualised suitability reports issued at the appropriate times.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile',              'The ongoing suitability of the assets and policies which are under Integral Advice’s advice is based upon a thorough understanding of your situation at all times. This section includes a consideration of your current personal and financial circumstances, your attitude to investment risk and your objectives.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile:fact-find',    'Please click the link to view the latest Personal & Financial Review document.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile:risk',         'Your attitude to risk has been judged to be…XXXX. This is based on the outcome of a questionnaire and discussion, which are linked below.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile:objectives',   'We have identified some overall aims and objectives for your financial planning. The details of these are listed below.');
INSERT INTO module_presets ("module_type", "text") VALUES ('policy-valuations',    'The value of your assets and policies may have changed since the last time we reviewed your situation. The following table should give you an indication of your progress in this regard. A change in value can either arise as a result of market movement or as a result of contributions and withdrawals made. Contributions and withdrawals are listed in the second table.');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees',                 'Any Pension, ISA and Investment (or General Investment Account) funds which are the subject of our ongoing advice will incur fees from several parties:');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:advice-fee',      'Advice fees.');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:policy-fees',     'Platform fee(s).');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:fund-level',      'Each of the funds you are investing in has an Ongoing Charges Figure attached to it. There are also transactional fees which are incurred in the fund’s operation. The transactional fees shown are the “ex ante” fees. This means they are anticipated fees which may differ slightly from those which are actually incurred (the “ex post” fees). The fees do change over time. The following table summarises the current size of those fees, as disclosed by the fund managers.');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:portfolio-level', 'As you are investing in a model portfolio, the charges shown are the weighted averages for the entire portfolio, rather than on a fund by fund basis.');

DELETE FROM reviews;
DELETE FROM policy_funds;
DELETE FROM portfolios;
DELETE FROM policies;
DELETE FROM clients;
DELETE FROM users;
DELETE FROM models;
DELETE FROM funds;
DELETE FROM operators;
DELETE FROM policy_types;
DELETE FROM policy_providers;

INSERT INTO policy_providers ("id", "name", "pricing", "uid")                                       OVERRIDING SYSTEM VALUE VALUES (1, 'Aviva Wrap', '<p>Aviva charges on a tiered basis according to the following table:</p><p><br></p><p>{{ charges }}</p>', 'b7f8f4e5104043429c5993be7fdf930d');
INSERT INTO policy_types     ("id", "name","uid")                                                   OVERRIDING SYSTEM VALUE VALUES (1, 'Pension', '7ec08af90397470285aef69c5f5b6a86');
INSERT INTO policy_types     ("id", "name","uid")                                                   OVERRIDING SYSTEM VALUE VALUES (2, 'ISA', 'ae132a8a68c94f2a8a20cd2268592991');
INSERT INTO operators        ("id", "type","name","fee", "uid")                                     OVERRIDING SYSTEM VALUE VALUES (1, 'dim', 'LGT Vestra', 0.12, '598f683493e34cdbb0f786a06f2a92ea');
INSERT INTO operators        ("id", "type","name","fee", "uid")                                     OVERRIDING SYSTEM VALUE VALUES (2, 'dim', 'Tatton',     0.15, 'e1266d5122644b69899fe52cb9c8c0a0');
INSERT INTO operators        ("id", "type","name","fee", "uid")                                     OVERRIDING SYSTEM VALUE VALUES (3, 'firm', 'The Firm',  0.25, 'b02e6cc023e345b58e020137599118a9');
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee", "uid")                          OVERRIDING SYSTEM VALUE VALUES (1, 'Jupiter Balanced',               0.76, 0.16, '3faa08a399f64d4b9f869b24c42aa5a4');
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee", "uid")                          OVERRIDING SYSTEM VALUE VALUES (2, 'Invesco High Income',            0.67, 0.11, '4c6f2e04f4204cc484563b2ad30b5dd6');
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee", "uid")                          OVERRIDING SYSTEM VALUE VALUES (3, 'Fundsmith Equity',               0.81, 0.09, '338c91a2dcc943f29615148fc8734ff3');
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee", "uid")                          OVERRIDING SYSTEM VALUE VALUES (4, 'Baillie Gifford Japan',          0.69, 0.08, '3f6a15381afc4fee88dbbd0206eb3bdb');
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee", "uid")                          OVERRIDING SYSTEM VALUE VALUES (5, 'Threadneedle US Equity Tracker', 0.2,  0.12, '3e4bc95d83fa41b2861df9a4ec41a1bd');
INSERT INTO models           ("id", "name","operator_id","weighted_ocf_fee","weighted_ex_ante_fee", "uid") OVERRIDING SYSTEM VALUE VALUES (1, 'LGT Vestra Balanced',    1, 0.58, 0.14, '0');
INSERT INTO models           ("id", "name","operator_id","weighted_ocf_fee","weighted_ex_ante_fee", "uid") OVERRIDING SYSTEM VALUE VALUES (2, 'LGT Vestra Adventurous', 1, 0.73, 0.15, '1');
INSERT INTO models           ("id", "name","operator_id","weighted_ocf_fee","weighted_ex_ante_fee", "uid") OVERRIDING SYSTEM VALUE VALUES (3, 'Tatton Core Active',     2, 0.55, 0.12, '2');
INSERT INTO users            ("id", "type", "email", "uid")                                         OVERRIDING SYSTEM VALUE VALUES (1, 'admin',   'darren@tp1.org',  '5f781892e3594e2b9578171de55c18c6');
INSERT INTO users            ("id", "type", "email", "uid")                                         OVERRIDING SYSTEM VALUE VALUES (2, 'advisor', 'company@tp1.org', 'bcc64c156d5f49df98c249909cd49a42');
INSERT INTO users            ("id", "type", "email", "uid")                                         OVERRIDING SYSTEM VALUE VALUES (3, 'client',  'ac@tp1.org',      'e04357a2150c4671b57bcd98d4db6825');
INSERT INTO clients          ("id", "user_id","forenames","surname","fee")                          OVERRIDING SYSTEM VALUE VALUES (1, 3, 'Darren', 'Grant', 0.75);
INSERT INTO policies         ("id", "external_id","platform_discount","client_id","policy_type_id","policy_provider_id","monthly_contributions","start_value","end_value","notes","uid") OVERRIDING SYSTEM VALUE VALUES 
	 (1,'pol_a', 0.05, 1, 2, 1, 100, 120000, 150000, '', '432750f27b7343a0bccfbf19b50937a4'),
	 (2,'pol_b', 0.04, 1, 1, 1, 100, 20000,  78216, '', '1e328d3daa2844cfb8e61475e2b93e5d'),
	 (3,'pol_c', 0,    1, 2, 1, 100, 120000,  150000, '', '91bbbe4f242b48ed98fecd20acf48e63');
INSERT INTO portfolios       ("id", "client_id","policy_id","model_id","proportion", "uid")         OVERRIDING SYSTEM VALUE VALUES 
	 (1, 1, 1, 2, 0.6, 'd0ea24231c86494d880d38730e5a3f0a'),
	 (2, 1, 1, 3, 0.4, 'ee0e475ab10e466c9e2b20107e11c50a'),
	 (3, 1, 2, 1, 1, '761dcc9457c5418bace91821a4efeecb');
INSERT INTO policy_funds     ("id", "client_id","policy_id","fund_id","proportion","uid")           OVERRIDING SYSTEM VALUE VALUES
	 (1, 1, 1, 1, 0.15, '24583f5e324a4645869eb20fa31aafa8'),
	 (2, 1, 1, 2, 0.13, 'dad164746c5c490caf27c0bc9fc2b1f4'),
	 (3, 1, 1, 3, 0.25, '771067c051574a19b3c14c5c1cfef0ae'),
	 (4, 1, 1, 4, 0.32, '639c6191b08747b4a79fa92cd6724e67'),
	 (5, 1, 1, 5, 0.15, 'a79e65a532cf490689ff008ab13725f6'),
	 (6, 1, 2, 1, 0.15, '57083349d3404a02967c260a29f13abe');
INSERT INTO provider_charges ("uid","policy_provider_id","desc","charge") VALUES
	 ('fcf3111e932a4bde905454e3841355de', 1, '100,000+',  0.42),
	 ('78bcbb4251464ae5b991753a95440eab', 1, '0-100,000', 0.3);

SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"clients"',          'id')), (SELECT (MAX("id") + 1) FROM "clients"),          FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"funds"',            'id')), (SELECT (MAX("id") + 1) FROM "funds"),            FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"models"',           'id')), (SELECT (MAX("id") + 1) FROM "models"),           FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"operators"',        'id')), (SELECT (MAX("id") + 1) FROM "operators"),        FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"policies"',         'id')), (SELECT (MAX("id") + 1) FROM "policies"),         FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"policy_funds"',     'id')), (SELECT (MAX("id") + 1) FROM "policy_funds"),     FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"policy_providers"', 'id')), (SELECT (MAX("id") + 1) FROM "policy_providers"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"portfolios"',       'id')), (SELECT (MAX("id") + 1) FROM "portfolios"),       FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"reviews"',          'id')), (SELECT (MAX("id") + 1) FROM "reviews"),          FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"users"',            'id')), (SELECT (MAX("id") + 1) FROM "users"),            FALSE);
