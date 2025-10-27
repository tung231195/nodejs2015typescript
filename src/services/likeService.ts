// services/likeService.ts

import { ILikeDoc, LikeModel } from "../models/likeModel.js";
import { createClient } from "redis";

export const likePost = async (data: Partial<ILikeDoc>): Promise<ILikeDoc | null> => {
  try {
    // ✅ Kiểm tra xem user đã like chưa
    const likeAlready = await LikeModel.findOne({
      post: data.post,
      user: data.user,
    });

    let result: ILikeDoc | null = null;
    let eventType = "";

    if (likeAlready) {
      // ✅ Nếu đã like → bỏ like
      await LikeModel.findByIdAndDelete(likeAlready._id);
      result = likeAlready;
      eventType = "post.unliked";
    } else {
      // ✅ Nếu chưa like → tạo mới
      const like = new LikeModel(data);
      await like.save();
      result = like;
      eventType = "post.liked";
    }
    const publisher = createClient();
    await publisher.connect();
    // ✅ Gửi event qua Redis pub/sub
    await publisher.publish(
      "events",
      JSON.stringify({
        type: eventType,
        data: {
          _id: result._id,
          post: result.post,
          user: {
            _id: result.user,
          },
        },
      }),
    );

    return result;
  } catch (error: any) {
    console.error("❌ Error in likePost:", error.message);
    throw new Error("Failed to like post");
  }
};

export const getLikesByPost = async (postId: string): Promise<ILikeDoc[]> => {
  try {
    return await LikeModel.find({ post: postId }).populate("user");
  } catch (error: any) {
    console.error("Error in getLikesByPost:", error.message);
    throw new Error("Failed to fetch likes");
  }
};
