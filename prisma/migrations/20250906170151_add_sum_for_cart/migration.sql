/*
  Warnings:

  - Added the required column `sum` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `sum` INTEGER NOT NULL;
