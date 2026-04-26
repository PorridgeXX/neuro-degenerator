CREATE TABLE "mediaMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"file_id" text NOT NULL,
	"file_unique_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messagesCounter" (
	"chat_id" integer NOT NULL,
	"count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "textMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"text" text NOT NULL
);
