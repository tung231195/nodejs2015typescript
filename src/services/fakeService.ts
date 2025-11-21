// services/postService.ts
import mongoose from "mongoose";
import { IProductDoc } from "../types";
import { ProductModel } from "../models/productModel.js";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

const NUM_PRODUCTS = 5;

// ----- Fake Category Id -----
const fakeCategoryId = new mongoose.Types.ObjectId();

const fashionImages = [
  "https://source.unsplash.com/random/800X800/?fashion",
  "https://source.unsplash.com/random/800X800/?clothes",
  "https://source.unsplash.com/random/800X800/?outfit",
  "https://source.unsplash.com/random/800X800/?streetwear",
  "https://source.unsplash.com/random/800X800/?menswear",
  "https://source.unsplash.com/random/800X800/?womenswear",
];

function fakeFashionImage() {
  return faker.helpers.arrayElement(fashionImages);
}

// ----- Main function -----
export const generateProducts = async (): Promise<IProductDoc[]> => {
  try {
    const products = productDatas();
    const result = await ProductModel.insertMany(products);
    return result;
  } catch (error: any) {
    console.error("Error in generateProducts:", error.message);
    throw new Error("Failed to generate products");
  }
};

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
      images: [fakeFashionImage(), fakeFashionImage()],
      attributes: generateAttributes(),
    },
  ];
}

// ----- Generate product data -----
const productDatas = (): IProductDoc[] => {
  const products: IProductDoc[] = Array.from({ length: NUM_PRODUCTS }, () => {
    const price = faker.number.int({ min: 100, max: 1000 });
    const discount = generateDiscount();
    let finalPrice = price;
    if (discount.type === "percent") {
      finalPrice = Math.max(0, price - (price * discount.value) / 100);
    } else if (discount.type === "amount") {
      finalPrice = Math.max(0, price - discount.value);
    }
    const name = faker.commerce.productName();
    return new ProductModel({
      name: name,
      slug: slugify(name, { lower: true, strict: true }),
      type: faker.helpers.arrayElement(["simple"]),
      price,
      finalPrice,
      discount,
      stock: faker.number.int({ min: 0, max: 100 }),
      category: fakeCategoryId,
      images: ["/uploads/product_1763518402984.jpeg", "/uploads/product_1763518402984.jpeg"],
      description: faker.commerce.productDescription(),
    });
  });

  return products;
};
