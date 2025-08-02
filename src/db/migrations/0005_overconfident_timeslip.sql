ALTER TABLE "rent_data" ALTER COLUMN "month" SET DATA TYPE char(7);--> statement-breakpoint
ALTER TABLE "rent_data" ADD COLUMN "timestamp" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_data" ADD CONSTRAINT "rent_data_month_format_check" CHECK ("rent_data"."month" ~ '^[0-9]{4}-[0-9]{2}$');