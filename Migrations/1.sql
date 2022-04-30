DELETE FROM module_presets;

INSERT INTO module_presets (module_type, "text") VALUES ('conclusions:action-points',       '<p>Your advice requirements are currently up to date, and there is nothing to action at this stage. Please get in touch if there is anything you are concerned about or if you have any questions on the contents of this report.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('conclusions:due-diligence',       '<p>Integral Advice conducts periodic due diligence on the platform and model service providers that you use. On the basis of this research, I am happy to continue to endorse your current arrangements.</p><p><br></p><p>Please refer to the original Suitability Report for the reasons for the initial recommendation of each policy.</p><p><br></p><p>Finally, I would like to draw your attention to the fact that my recommendations may change in the future and will be taken account of during future reviews.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('conclusions:ongoing-suitability', '<p><strong><em>Advisers should replace this text with the reasons they feel that the current policies are suitable to meet their own objectives and the reasons they are suitable for helping the client meet their goals.</em></strong></p>');
INSERT INTO module_presets (module_type, "text") VALUES ('fees:advice-fee',                 '<p>The Integral Advice Ongoing Service Charge is charged on the assets and polices we looked after. The fee is expressed in terms of an annual percentage although, in most cases, the policy providers levy the fee monthly.</p><p><br></p><p>The table shows an approximation of the fee in monetary terms, based on the current valuations of each of the policies and assets to which it applies.</p><p><br></p><p>Actual fees which have been received by Integral Advice during the review period can be seen by downloading the linked report. (Note that fees received within the last 4 to 6 weeks which haven’t been logged yet may not be included in the summary).</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('fees:dim',                        '<p>Discretionary Investment Managers (DIMs) levy a fee for operating their Model Portfolios Services. These are reported in the Portfolio-Level tab on a policy by policy basis. The table below aggregates these figures so that you can see each DIM in isolation. These charges are not, therefore, in addition to those disclosed on the Portfolio-Level tab. They are reported here for your convenience only.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('fees:fund-level',                 '<p>Each of the funds you are investing in has an Ongoing Charges Figure attached to it. This includes the fund manager''s fees and certain other costs, such as administration, marketing and regulation. There are also transactional fees which are incurred in the fund’s operation. The transactional fees shown are the “ex-ante” fees. This means they are anticipated fees, which may differ slightly from those which are actually incurred (the “ex-post” fees). Both OCF and transaction fees change over time. The following table summarises the current state of those fees, as disclosed by the fund managers.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('fees:policy-fees',                '<p>Each investment platform or policy provider has their own set of fees. These are detailed below.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('fees:portfolio-level',            '<p>As you are investing in a model portfolio, the charges shown are the weighted averages for the entire portfolio.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('fees',                            '<p>Any assets or policies which are the subject of our ongoing advice will incur fees from several parties. These are listed in the tabs within this section.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('introduction',                    'This dashboard consists of a high-level overview of your situation and the policies and investments which are under the care of Integral Advice. It is designed to complement any discussions given in person, over the phone or by email, but doesn’t cover any specific advice points. These are covered by individualised suitability reports issued at the appropriate times.');
INSERT INTO module_presets (module_type, "text") VALUES ('policy-valuations',               '<p>The value of your assets and policies may have changed since the last time we reviewed your situation. The following table should give you an indication of your progress in this regard. A change in value can either arise as a result of market movement or as a result of contributions and withdrawals made.</p>');
INSERT INTO module_presets (module_type, "text") VALUES ('profile:fact-find',               'Please click the link to view the latest Personal & Financial Review document.');
INSERT INTO module_presets (module_type, "text") VALUES ('profile:objectives',              'We have identified some overall aims and objectives for your financial planning. The details of these are listed below.');
INSERT INTO module_presets (module_type, "text") VALUES ('profile:risk',                    'Your attitude to risk has been judged to be…XXXX. This is based on the outcome of a questionnaire and discussion, which are linked below.');
INSERT INTO module_presets (module_type, "text") VALUES ('profile',                         'The ongoing suitability of the assets and policies which are under Integral Advice’s advice is based upon a thorough understanding of your situation at all times. This section includes a consideration of your current personal and financial circumstances, your attitude to investment risk and your objectives.');

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
DELETE FROM risk_assessments;
DELETE FROM risk_levels;
DELETE FROM risk_providers;

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
INSERT INTO provider_charges ("uid","policy_provider_id","desc","charge")                           OVERRIDING SYSTEM VALUE VALUES
	 ('fcf3111e932a4bde905454e3841355de', 1, '100,000+',  0.42),
	 ('78bcbb4251464ae5b991753a95440eab', 1, '0-100,000', 0.3);
INSERT INTO risk_providers ("id","uid","name","timestamp")                                          OVERRIDING SYSTEM VALUE VALUES
	 (1, '856a5d560b5849a98e682177ba22a24c','Provider One','2022-04-17 21:21:41.757'),
	 (2, 'ca1a7c11168a4918a08d0ad14ee89370','Provider Two','2022-04-17 21:21:46.326');
INSERT INTO risk_levels ("id","uid","risk_provider_id","level","label","desc","timestamp")          OVERRIDING SYSTEM VALUE VALUES
	 (1, 'b724eeb31a6b4045b3a268cc975e1d88',1,1,'One1','Easy money','2022-04-17 21:22:02.821'),
	 (2, 'ca242f73d2dd44099cf5be3c2267640f',1,2,'One2','Not so easy money','2022-04-17 21:25:11.882'),
	 (3, '37f0686ace8d4625ba456838c0035ba1',2,6,'Two6','The big two six','2022-04-17 21:25:40.101'),
	 (4, '2e990787d80a4c64929f975b0686c3f4',2,5,'Two5','The two five','2022-04-17 21:25:30.988');

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
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"risk_providers"',   'id')), (SELECT (MAX("id") + 1) FROM "risk_providers"),   FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"risk_levels"',      'id')), (SELECT (MAX("id") + 1) FROM "risk_levels"),      FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"risk_assessments"', 'id')), (SELECT (MAX("id") + 1) FROM "risk_assessments"), FALSE);
