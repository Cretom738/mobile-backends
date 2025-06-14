/*
  Warnings:

  - A unique constraint covering the columns `[order_id,product_id]` on the table `order_product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `order_product_order_id_product_id_key` ON `order_product`(`order_id`, `product_id`);
