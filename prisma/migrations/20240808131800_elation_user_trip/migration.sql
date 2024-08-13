/*
  Warnings:

  - You are about to alter the column `id_user` on the `trips` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `id_user` on table `trips` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" INTEGER NOT NULL,
    "destination" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trips_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trips" ("created_at", "destination", "ends_at", "id", "id_user", "is_confirmed", "starts_at") SELECT "created_at", "destination", "ends_at", "id", "id_user", "is_confirmed", "starts_at" FROM "trips";
DROP TABLE "trips";
ALTER TABLE "new_trips" RENAME TO "trips";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
