// services/postService.ts

import mongoose from "mongoose";
import { CategoryModel } from "../models/categoryModel.js";
import { ProductModel } from "../models/productModel.js";
import { ICategoryDoc, IProductDoc } from "../types/index.js";

export const createCategory = async (data: Partial<ICategoryDoc>): Promise<ICategoryDoc> => {
  try {
    const category = new CategoryModel(data);
    return await category.save();
  } catch (error: any) {
    console.error("Error in Categories:", error.message);
    throw new Error("Failed to create post");
  }
};

export const getCategoryById = async (id: string): Promise<ICategoryDoc | null> => {
  try {
    return await CategoryModel.findById(id);
  } catch (error: any) {
    console.error("Error in getCategoriesById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const getCategoryProducts = async (params: {
  slug: string;
  minPrice?: number;
  maxPrice?: number;
  variantFilters?: { attributeId?: string; valueString?: string }[];
  page: number;
  limit: number;
}) => {
  console.log("get params", params);
  let {
    slug,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
    variantFilters = [],
    page,
    limit,
  } = params;

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  const skip = (page - 1) * limit;

  // NOTE: Thay bằng ObjectId thực sự của color/size attribute trong DB
  const ATTRIBUTE_COLOR_ID = "68e63089de8746d605fde99d"; // example
  const ATTRIBUTE_SIZE_ID = "68e7c88af04ba84b032132e7"; // example
  try {
    // 1️⃣ Lấy category theo slug
    const category = await CategoryModel.findOne({ slug }).lean();
    if (!category) throw new Error("Category not found");

    const matchProductStage: any = {
      category: category._id,
      price: { $gte: minPrice, $lte: maxPrice },
    };

    // 2️⃣ Pipeline lọc variants
    const pipeline: any[] = [
      { $match: matchProductStage },
      { $unwind: "$variants" }, // mỗi variant thành 1 document
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      // { $match: { "variants.stock": { $gt: 0 } } }, // chỉ lấy variants còn hàng
    ];

    // 3️⃣ Thêm filter theo variant attributes nếu có và hợp lệ
    if (variantFilters.length > 0) {
      const grouped = variantFilters.reduce(
        (acc, f) => {
          if (!mongoose.Types.ObjectId.isValid(f.attributeId as string)) return acc;
          if (!acc[f.attributeId!]) acc[f.attributeId!] = [];
          acc[f.attributeId!].push(f.valueString as string);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      const allElemMatches = Object.entries(grouped)
        .filter(([attrId]) => mongoose.Types.ObjectId.isValid(attrId))
        .map(([attrId, values]) => ({
          $elemMatch: {
            attribute: new mongoose.Types.ObjectId(attrId as string),
            valueString: { $in: values },
          },
        }));
      console.log("allElemMatches", allElemMatches);
      if (allElemMatches.length > 0) {
        pipeline.push({
          $match: {
            "variants.attributes": { $all: allElemMatches },
          },
        });
      }
    }

    // 4️⃣ Group lại product với các variant phù hợp
    pipeline.push({
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        slug: { $first: "$slug" },
        category: {
          $first: {
            slug: { $arrayElemAt: ["$categoryInfo.slug", 0] },
            _id: { $arrayElemAt: ["$categoryInfo._id", 0] },
          },
        },
        variants: { $push: "$variants" },
        price: { $first: "$price" },
        finalPrice: { $first: "$finalPrice" },
        images: { $first: "$images" },
      },
    });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    // 5️⃣ Facets cho sidebar filter từ variants

    const facetsPipeline = [
      {
        $addFields: {
          effectivePrices: {
            $cond: {
              if: { $gt: [{ $size: "$variants" }, 0] },
              then: "$variants.price",
              else: ["$price"], // simple product -> đặt trong mảng để $min/$max xử lý
            },
          },
        },
      },
      { $unwind: { path: "$variants", preserveNullAndEmptyArrays: true } }, // variants có thể rỗng
      { $unwind: { path: "$variants.attributes", preserveNullAndEmptyArrays: true } },

      {
        $facet: {
          totalItems: [
            { $match: matchProductStage },
            { $group: { _id: "$_id" } }, // loại duplicate
            { $count: "count" },
          ],
          attributes: [
            // Bước 1: chỉ lấy mảng attributes
            { $unwind: "$attributes" },

            // Bước 2: nhóm theo attribute + value
            {
              $group: {
                _id: {
                  attribute: "$attributes.attribute",
                  value: {
                    $ifNull: [
                      "$attributes.valueString",
                      {
                        $ifNull: ["$attributes.valueNumber", "$attributes.valueBoolean"],
                      },
                    ],
                  },
                },
                count: { $sum: 1 },
              },
            },

            // Bước 3: nhóm lại theo attribute để gom values
            {
              $group: {
                _id: "$_id.attribute",
                values: {
                  $push: {
                    value: "$_id.value",
                    count: "$count",
                  },
                },
              },
            },

            // Bước 4: join với bảng attributes để lấy tên thuộc tính
            {
              $lookup: {
                from: "attributes", // collection chứa thông tin thuộc tính
                localField: "_id",
                foreignField: "_id",
                as: "attributeInfo",
              },
            },
            { $unwind: "$attributeInfo" },

            // Bước 5: format kết quả
            {
              $project: {
                _id: 0,
                attributeId: "$_id",
                attributeName: "$attributeInfo.name",
                values: 1,
              },
            },
          ],
          colors: [
            {
              $match: {
                "variants.attributes.attribute": new mongoose.Types.ObjectId(ATTRIBUTE_COLOR_ID),
              },
            },
            {
              $group: {
                _id: "$variants.attributes.valueString",
                count: { $sum: 1 },
              },
            },
            { $match: { _id: { $ne: null } } },
          ],
          sizes: [
            {
              $match: {
                "variants.attributes.attribute": new mongoose.Types.ObjectId(ATTRIBUTE_SIZE_ID),
              },
            },
            {
              $group: {
                _id: "$variants.attributes.valueString",
                count: { $sum: 1 },
              },
            },
            { $match: { _id: { $ne: null } } },
          ],
          priceRange: [
            { $unwind: "$effectivePrices" }, // mở mảng effectivePrices
            {
              $group: {
                _id: null,
                min: { $min: "$effectivePrices" },
                max: { $max: "$effectivePrices" },
              },
            },
          ],
        },
      },
    ];

    // 6️⃣ Chạy aggregation song song
    const [products, facetsResult] = await Promise.all([
      ProductModel.aggregate(pipeline),
      ProductModel.aggregate(facetsPipeline),
    ]);

    const facets = facetsResult[0] || { colors: [], sizes: [], priceRange: [] };

    return { products, facets };
  } catch (error: any) {
    console.error("Error in getCategoryProductsWithVariantFilter:", error.message);
    throw new Error("Failed to fetch products with variant filter");
  }
};
export const updateCategoryById = async (data: ICategoryDoc): Promise<ICategoryDoc | null> => {
  try {
    return await CategoryModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
  } catch (error: any) {
    console.error("Error in getCategoriesById:", error.message);
    throw new Error("Failed to fetch post");
  }
};

export const getAllCategories = async (): Promise<ICategoryDoc[]> => {
  try {
    return await CategoryModel.find();
  } catch (error: any) {
    console.error("Error in getAllCategoriess:", error.message);
    throw new Error("Failed to fetch posts");
  }
};

export const deleteCategoryById = async (id: string): Promise<ICategoryDoc | null> => {
  try {
    return await CategoryModel.findByIdAndDelete(id);
  } catch (error: any) {
    console.error("Error in getPostById:", error.message);
    throw new Error("Failed to fetch post");
  }
};
