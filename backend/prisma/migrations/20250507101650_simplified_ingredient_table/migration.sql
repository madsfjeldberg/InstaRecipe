/*
  Warnings:

  - You are about to drop the column `amount` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `fiber` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `saturatedFat` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `sugar` on the `Ingredient` table. All the data in the column will be lost.
  - Added the required column `servingSize` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredients` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "amount",
DROP COLUMN "fiber",
DROP COLUMN "saturatedFat",
DROP COLUMN "sugar",
ADD COLUMN     "servingSize" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "ingredients" TEXT NOT NULL;
