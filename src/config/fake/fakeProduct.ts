#!/usr/bin/env ts-node
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { ProductModel } from "../../models/productModel"; // đường dẫn tới ProductModel của bạn
import { VariantSchema } from "../../models/variantModel";
import { ProductAttributeValueDocSchema } from "../../models/productAttributeValueModel";

// ----- Config -----
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
const NUM_PRODUCTS = 5;

// ----- Fake Category Id -----
const fakeCategoryId = new mongoose.Types.ObjectId();

// ----- Helper -----
function generateDiscount() {
  const type = faker.helpers.arrayElement(["percent", "amount"]);
  const value =
    type === "percent"
      ? faker.number.int({ min: 5, max: 50 })
      : faker.number.int({ min: 10, max: 200 });
  return { type, value };
}

function generateAttributes() {
  // giả lập 1 attribute color + size
  return [
    {
      attributeId: new mongoose.Types.ObjectId(),
      attributeName: "Color",
      values: [{ value: faker.color.human(), valueId: faker.string.uuid() }],
    },
    {
      attributeId: new mongoose.Types.ObjectId(),
      attributeName: "Size",
      values: [
        { value: faker.helpers.arrayElement(["S", "M", "L", "XL"]), valueId: faker.string.uuid() },
      ],
    },
  ];
}

function generateVariants() {
  return [
    {
      sku: faker.string.alphanumeric({ length: 8 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      stock: faker.number.int({ min: 0, max: 50 }),
      images: [faker.image.url(), faker.image.url()],
      attributes: generateAttributes(),
    },
  ];
}

// ----- Main -----
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  try {
    const products = Array.from({ length: NUM_PRODUCTS }, () => {
      const price = faker.number.int({ min: 100, max: 1000 });
      const discount = generateDiscount();
      let finalPrice = price;
      if (discount.type === "percent") {
        finalPrice = Math.max(0, price - (price * discount.value) / 100);
      } else if (discount.type === "amount") {
        finalPrice = Math.max(0, price - discount.value);
      }

      return new ProductModel({
        name: faker.commerce.productName(),
        type: faker.helpers.arrayElement(["simple", "variant"]),
        price,
        finalPrice,
        discount,
        stock: faker.number.int({ min: 0, max: 100 }),
        category: fakeCategoryId,
        images: [faker.image.url(), faker.image.url()],
        attributes: generateAttributes(),
        variants: generateVariants(),
        description: faker.commerce.productDescription(),
      });
    });

    // const result = await ProductModel.insertMany(products);
    console.log(`✅ Inserted products fake products!`, products);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
