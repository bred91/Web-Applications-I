-- database: c:\Users\paner\Documents\GitHub\esame1-cmsmall-bred91\server\db.sqlite

BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"email"	TEXT,
	"name"	TEXT,
	"surname"	TEXT,
	"isAdmin"	INTEGER,
	"salt"	TEXT,
	"password"	TEXT
);

CREATE TABLE IF NOT EXISTS "pages" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"title"	TEXT,
	"authorId"	INTEGER,
	"creationDate"	DATE,
	"publicationDate"	DATE
);

CREATE TABLE IF NOT EXISTS "blocks" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,	
	"pageId"	INTEGER,
	"order"	INTEGER,
	"contentTypeId"	INTEGER,
	"content"	TEXT
);

CREATE TABLE IF NOT EXISTS "images" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT,
	"ref"	TEXT
);

CREATE TABLE IF NOT EXISTS "contentTypes" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"name"	TEXT
);

CREATE TABLE IF NOT EXISTS "config" (
	"key"	TEXT,
	"value"	TEXT
);

INSERT INTO "config" VALUES ('siteName','CMS');

INSERT INTO "users" VALUES (1,'enrico@test.com','Enrico', 'Rossi', 1, '123348dusd437840','bddfdc9b092918a7f65297b4ba534dfe306ed4d5d72708349ddadb99b1c526fb'); /* password='pwd' */
INSERT INTO "users" VALUES (2,'luigi@test.com','Luigi', 'Bianchi', 0, '7732qweydg3sd637','498a8d846eb4efebffc56fc0de16d18905714cf12edf548b8ed7a4afca0f7c1c');
INSERT INTO "users" VALUES (3,'alice@test.com','Alice', 'Salata', 0,'wgb32sge2sh7hse7','09a79c91c41073e7372774fcb114b492b2b42f5e948c61d775ad4f628df0e160');
INSERT INTO "users" VALUES (4,'harry@test.com','Harry', 'Potter', 0,'safd6523tdwt82et','330f9bd2d0472e3ca8f11d147d01ea210954425a17573d0f6b8240ed503959f8');
INSERT INTO "users" VALUES (5,'carol@test.com','Carol', 'Verdi', 0,'ad37JHUW38wj2833','bbbcbac88d988bce98cc13e4c9308306d621d9e278ca62aaee2d156f898a41dd');

INSERT INTO "contentTypes" VALUES (1,'Header');
INSERT INTO "contentTypes" VALUES (2,'Paragraph');
INSERT INTO "contentTypes" VALUES (3,'Image');

INSERT INTO "images" VALUES (1,'Astronomy','http://localhost:3001/images/astronomy.jpg');
INSERT INTO "images" VALUES (2,'Flowers','http://localhost:3001/images/flowers.jpg');
INSERT INTO "images" VALUES (3,'Lightbulb','http://localhost:3001/images/lightbulb.jpg');
INSERT INTO "images" VALUES (4,'Nature','http://localhost:3001/images/nature.jpg');

INSERT INTO "pages" VALUES (1,'Home',2,'2020-01-01','2022-01-01');
INSERT INTO "pages" VALUES (2,'About',2,'2020-01-01','2024-01-01');
INSERT INTO "pages" VALUES (3,'Contact',3,'2023-01-01','2023-01-01');


INSERT INTO "blocks" VALUES (1,1,1,1,'Welcome to my website!');
INSERT INTO "blocks" VALUES (2,1,2,2,'This is the first paragraph of my website.');
INSERT INTO "blocks" VALUES (3,1,3,2,'This is the second paragraph of my website.');
INSERT INTO "blocks" VALUES (4,1,4,3,'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
INSERT INTO "blocks" VALUES (5,2,1,1,'About');
INSERT INTO "blocks" VALUES (6,2,2,2,'This is the first paragraph of the about page.');
INSERT INTO "blocks" VALUES (7,2,4,2,'This is the second paragraph of the about page.');
INSERT INTO "blocks" VALUES (8,2,3,3,'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
INSERT INTO "blocks" VALUES (9,3,1,1,'Contact');
INSERT INTO "blocks" VALUES (10,3,2,2,'This is the first paragraph of the contact page.');
COMMIT;
