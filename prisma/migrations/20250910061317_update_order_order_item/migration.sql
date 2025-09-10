/*
  Warnings:

  - You are about to drop the column `unit_price` on the `order_items` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - Added the required column `price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverAddress` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverPhone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `unit_price`,
    ADD COLUMN `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiverAddress` VARCHAR(255) NOT NULL,
    ADD COLUMN `receiverName` VARCHAR(255) NOT NULL,
    ADD COLUMN `receiverPhone` VARCHAR(255) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'CANCELED', 'COMPLETE') NOT NULL DEFAULT 'PENDING';
