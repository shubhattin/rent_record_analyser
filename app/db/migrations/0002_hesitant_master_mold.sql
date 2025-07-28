DO $$ BEGIN
 CREATE TYPE "rent_type" AS ENUM('rent', 'electricity');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('admin', 'non-admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "rent_data" ADD COLUMN "rent_type" "rent_type" DEFAULT 'rent' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_type" "user_type" DEFAULT 'non-admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "is_admin";