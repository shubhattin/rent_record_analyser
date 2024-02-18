CREATE TABLE IF NOT EXISTS "others" (
	"key" varchar(20) PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rent_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"date" date NOT NULL,
	"month" date NOT NULL
);
