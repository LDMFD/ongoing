DELETE FROM module_presets;

INSERT INTO module_presets ("module_type", "text") VALUES ('introduction',        'This dashboard consists of a high-level overview of your situation and the policies and investments which are under the care of Integral Advice. It is designed to complement any discussions given in person, over the phone or by email, but doesn’t cover any specific advice points. These are covered by individualised suitability reports issued at the appropriate times.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile',             'The ongoing suitability of the assets and policies which are under Integral Advice’s advice is based upon a thorough understanding of your situation at all times. This section includes a consideration of your current personal and financial circumstances, your attitude to investment risk and your objectives.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile:fact-find',   'Please click the link to view the latest Personal & Financial Review document.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile:risk',        'Your attitude to risk has been judged to be…XXXX. This is based on the outcome of a questionnaire and discussion, which are linked below.');
INSERT INTO module_presets ("module_type", "text") VALUES ('profile:objectives',  'We have identified some overall aims and objectives for your financial planning. The details of these are listed below.');
INSERT INTO module_presets ("module_type", "text") VALUES ('policy-valuations',   'The value of your assets and policies may have changed since the last time we reviewed your situation. The following table should give you an indication of your progress in this regard. A change in value can either arise as a result of market movement or as a result of contributions and withdrawals made. Contributions and withdrawals are listed in the second table.');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees',                'Any Pension, ISA and Investment (or General Investment Account) funds which are the subject of our ongoing advice will incur fees from several parties:');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:advice-fee',     'Advice fees.');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:policy-fees',    'Platform fee(s).');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:fund-fees',      'Each of the funds you are investing in has an Ongoing Charges Figure attached to it. There are also transactional fees which are incurred in the fund’s operation. The transactional fees shown are the “ex ante” fees. This means they are anticipated fees which may differ slightly from those which are actually incurred (the “ex post” fees). The fees do change over time. The following table summarises the current size of those fees, as disclosed by the fund managers.');
INSERT INTO module_presets ("module_type", "text") VALUES ('fees:fund-fees-else', 'As you are investing in a model portfolio, the charges shown are the weighted averages for the entire portfolio, rather than on a fund by fund basis.');

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

INSERT INTO policy_providers ("id", "name", "pricing")                                              OVERRIDING SYSTEM VALUE VALUES (1, 'Aviva Wrap', '<p>Aviva''s pricing notes.</p>');
INSERT INTO policy_types     ("id", "name")                                                         OVERRIDING SYSTEM VALUE VALUES (1, 'Pension');
INSERT INTO policy_types     ("id", "name")                                                         OVERRIDING SYSTEM VALUE VALUES (2, 'ISA');
INSERT INTO operators        ("id", "type","name","fee")                                            OVERRIDING SYSTEM VALUE VALUES (1, 'dim', 'LGT Vestra', 0.12);
INSERT INTO operators        ("id", "type","name","fee")                                            OVERRIDING SYSTEM VALUE VALUES (2, 'dim', 'Tatton',     0.15);
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee")                                 OVERRIDING SYSTEM VALUE VALUES (1, 'Jupiter Balanced',               0.76, 0.16);
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee")                                 OVERRIDING SYSTEM VALUE VALUES (2, 'Invesco High Income',            0.67, 0.11);
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee")                                 OVERRIDING SYSTEM VALUE VALUES (3, 'Fundsmith Equity',               0.81, 0.09);
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee")                                 OVERRIDING SYSTEM VALUE VALUES (4, 'Baillie Gifford Japan',          0.69, 0.08);
INSERT INTO funds            ("id", "name","ocf_fee","ex_ante_fee")                                 OVERRIDING SYSTEM VALUE VALUES (5, 'Threadneedle US Equity Tracker', 0.2,  0.12);
INSERT INTO models           ("id", "name","operator_id","weighted_ocf_fee","weighted_ex_ante_fee") OVERRIDING SYSTEM VALUE VALUES (1, 'LGT Vestra Balanced',    1, 0.58, 0.14);
INSERT INTO models           ("id", "name","operator_id","weighted_ocf_fee","weighted_ex_ante_fee") OVERRIDING SYSTEM VALUE VALUES (2, 'LGT Vestra Adventurous', 1, 0.73, 0.15);
INSERT INTO models           ("id", "name","operator_id","weighted_ocf_fee","weighted_ex_ante_fee") OVERRIDING SYSTEM VALUE VALUES (3, 'Tatton Core Active',     2, 0.55, 0.12);
INSERT INTO users            ("id", "type", "email", "uid")                                         OVERRIDING SYSTEM VALUE VALUES (1, 'admin',   'darren@tp1.org',  '5f781892e3594e2b9578171de55c18c6');
INSERT INTO users            ("id", "type", "email", "uid")                                         OVERRIDING SYSTEM VALUE VALUES (2, 'advisor', 'company@tp1.org', 'bcc64c156d5f49df98c249909cd49a42');
INSERT INTO users            ("id", "type", "email", "uid")                                         OVERRIDING SYSTEM VALUE VALUES (3, 'client',  'ac@tp1.org',      'e04357a2150c4671b57bcd98d4db6825');
INSERT INTO clients          ("id", "user_id","forenames","surname","fee")                          OVERRIDING SYSTEM VALUE VALUES (1, 3, 'Darren', 'Grant', 0.75);
INSERT INTO policies         ("id", "external_id","platform_discount","client_id","policy_type_id","policy_provider_id","monthly_contributions","start_value","end_value") OVERRIDING SYSTEM VALUE VALUES 
	 (1,'pol_a', 0.05, 1, 2, 1, 100, 120000, 150000),
	 (2,'pol_b', 0.04, 1, 1, 1, 100, 20000,  78216);
INSERT INTO portfolios       ("id", "client_id","policy_id","model_id","proportion")                OVERRIDING SYSTEM VALUE VALUES 
	 (1, 1, 1, 2, 0.6),
	 (2, 1, 1, 3, 0.4),
	 (3, 1, 2, 1, 1);
INSERT INTO policy_funds     ("id", "client_id","policy_id","fund_id","proportion")                 OVERRIDING SYSTEM VALUE VALUES
	 (1, 1, 1, 1, 0.15),
	 (2, 1, 1, 2, 0.13),
	 (3, 1, 1, 3, 0.25),
	 (4, 1, 1, 4, 0.32),
	 (5, 1, 1, 5, 0.15),
	 (6, 1, 2, 1, 0.15);
INSERT INTO reviews          ("id","uid","client_id","state")                                       OVERRIDING SYSTEM VALUE VALUES  (1, 'c272f827bd2d4efe9e7d22982412a77f',1,'draft');
