-- BEGIN
CREATE TABLE IF NOT EXISTS "Files" (
	"Url"	VARCHAR,
	PRIMARY KEY (Url)
);

CREATE TABLE IF NOT EXISTS "Tickets" (
  "Street" VARCHAR,
  "Latitude" FLOAT,
  "Longitude" FLOAT,
  "Year" DATE,
  PRIMARY KEY (Street)
);
-- COMMIT