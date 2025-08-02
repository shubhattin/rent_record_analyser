DROP INDEX "rent_data_date_index";--> statement-breakpoint
ALTER TABLE "rent_data" ALTER COLUMN "month" SET DATA TYPE char(7);--> statement-breakpoint
ALTER TABLE "rent_data" ADD COLUMN "timestamp" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "rent_data_timestamp_index" ON "rent_data" USING btree ("timestamp");--> statement-breakpoint
ALTER TABLE "rent_data" DROP COLUMN "date";