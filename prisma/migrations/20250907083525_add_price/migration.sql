/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart_items` ADD COLUMN `price` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cart_user_id_key` ON `cart`(`user_id`);
