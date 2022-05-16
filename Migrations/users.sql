INSERT INTO users            ("id", "type", "email", "uid")                OVERRIDING SYSTEM VALUE VALUES (1, 'admin',   'darren@tp1.org',  '5f781892e3594e2b9578171de55c18c6');
INSERT INTO users            ("id", "type", "email", "uid")                OVERRIDING SYSTEM VALUE VALUES (2, 'advisor', 'company@tp1.org', 'bcc64c156d5f49df98c249909cd49a42');
INSERT INTO users            ("id", "type", "email", "uid")                OVERRIDING SYSTEM VALUE VALUES (3, 'client',  'ac@tp1.org',      'e04357a2150c4671b57bcd98d4db6825');
INSERT INTO clients          ("id", "user_id","forenames","surname","fee") OVERRIDING SYSTEM VALUE VALUES (1, 3, 'Darren', 'Grant', 0.75);

SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"clients"', 'id')), (SELECT (MAX("id") + 1) FROM "clients"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"users"',   'id')), (SELECT (MAX("id") + 1) FROM "users"),   FALSE);
