// services/slideshowService.ts

import { SlideshowModel } from "../models/slideshowModel.js";
import { ISlideshowDoc } from "../types/index.js";
import { saveBase64Image } from "../upload/index.js";

export const createSlideshow = async (data: Partial<ISlideshowDoc>): Promise<ISlideshowDoc> => {
  try {
    if (data.image && data.image.length > 0) {
      const newImages = (
        await Promise.all(
          data.image.map(async (image) => {
            if (image?.startsWith("data:")) {
              const filename = `slideshow_${Date.now()}`;
              const filePath = await saveBase64Image(image, filename);
              return filePath;
            }
            return image;
          }),
        )
      ).filter((img): img is string => Boolean(img)); // ✅ lọc bỏ null hoặc undefined
      // 🔹 Gán lại mảng ảnh đã xử lý
      data.image = newImages;
    } else {
      data.image = [];
    }

    const slideshow = new SlideshowModel(data);
    return await slideshow.save();
  } catch (error: any) {
    console.error("Error in createSlideshow:", error.message);
    throw new Error("Failed to create slideshow");
  }
};

export const updateSlideshow = async (
  data: { _id: string } & Partial<Omit<ISlideshowDoc, "_id">>,
): Promise<ISlideshowDoc> => {
  try {
    if (data.image && data.image.length > 0) {
      const newImages = (
        await Promise.all(
          data.image.map(async (image) => {
            if (image?.startsWith("data:")) {
              const filename = `slideshow_${Date.now()}`;
              const filePath = await saveBase64Image(image, filename);
              return filePath;
            }
            return image;
          }),
        )
      ).filter((img): img is string => Boolean(img)); // ✅ lọc bỏ null hoặc undefined
      // 🔹 Gán lại mảng ảnh đã xử lý
      data.image = newImages;
    } else {
      data.image = [];
    }
    // const { id, title, content } = data;
    const updatedSlideshow = await SlideshowModel.findByIdAndUpdate(
      data._id,
      { $set: data },
      { new: true, runValidators: true },
    );
    if (!updatedSlideshow) throw new Error("The update slideshow not exist");
    return updatedSlideshow;
  } catch (error: any) {
    console.error("Error in createSlideshow:", error.message);
    throw new Error("Failed to create slideshow");
  }
};

export const getSlideshowById = async (id: string): Promise<ISlideshowDoc | null> => {
  try {
    return await SlideshowModel.findById(id);
  } catch (error: any) {
    console.error("Error in getSlideshowById:", error.message);
    throw new Error("Failed to fetch slideshow");
  }
};

export const getAllSlideshows = async (): Promise<ISlideshowDoc[]> => {
  try {
    const slideshows = await SlideshowModel.find({});
    return slideshows;
  } catch (error: any) {
    console.error("Error in getAllSlideshows:", error.message);
    throw new Error("Failed to fetch slideshows");
  }
};

/**
 * Delete  Slideshow theo ID
 */
export const deleteSlideshowById = async (id: string) => {
  try {
    const deleteSlideshow = await SlideshowModel.findByIdAndDelete(id);

    if (!deleteSlideshow) {
      throw new Error("slideshow not found");
    }

    return {
      success: true,
      message: "slideshow deleted successfully",
      data: deleteSlideshow,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete slideshow");
  }
};
