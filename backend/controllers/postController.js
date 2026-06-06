import jwt from "jsonwebtoken";

import Post from "../models/Post.js";
import redis from "../config/redis.js";

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("Image file is required");
    }

    const coverUrl = req.file.path;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "No user id found in token" });
    }

    const { title, summary, content } = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: coverUrl,
      author: userId,
    });

    await redis.del("posts:all");
    console.log("Redis cache invalidated ✅ posts:all");

    res.json(postDoc);
  } catch (error) {
    console.error("createPost error FULL:", JSON.stringify(error, null, 2));
console.error("createPost error MESSAGE:", error.message);
console.error("createPost error STACK:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    let coverUrl = null;

    if (req.file) {
      // Cloudinary path is already a URL
      coverUrl = req.file.path;
    }

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json("No token provided");
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json(err);
      }

      const { id, title, summary, content } = req.body;

      if (!id) {
        return res.status(400).json("Post id is required");
      }

      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json("Post not found");
      }

      const isAuthor = postDoc.author.equals(info.id);

      if (!isAuthor) {
        return res.status(403).json("You are not the author");
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;

      if (coverUrl) {
        postDoc.cover = coverUrl;
      }

      await postDoc.save();

      /*
      |--------------------------------------------------------------------------
      | CACHE INVALIDATION
      |--------------------------------------------------------------------------
      */

      // Remove single post cache
      await redis.del(`post:${id}`);

      // Remove feed cache
      await redis.del("posts:all");

      console.log(`Redis cache invalidated ✅ post:${id}`);
      console.log("Redis cache invalidated ✅ posts:all");

      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);

    res.status(500).json("Internal server error");
  }
};

export const deletePost = async (req, res) => {
  try {
    const postDoc = await Post.findById(req.params.id);

    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postDoc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not the author" });
    }

    await Post.deleteOne({ _id: req.params.id });

    await redis.del(`post:${req.params.id}`);
    await redis.del("posts:all");

    console.log(`Redis cache invalidated ✅ post:${req.params.id}`);
    console.log("Redis cache invalidated ✅ posts:all");

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  const start = Date.now();

  // Redis cache key
  const cacheKey = "posts:all";

  try {
    /*
    |--------------------------------------------------------------------------
    | 1. CHECK REDIS CACHE
    |--------------------------------------------------------------------------
    */
    const cachedPosts = await redis.get(cacheKey);

    // CACHE HIT
    if (cachedPosts) {
      console.log("Cache HIT ✅", cacheKey);

      // Custom headers visible in Chrome DevTools
      res.set("X-Cache", "HIT");
      res.set("X-Response-Time", `${Date.now() - start}ms`);

      const cachedValue =
        typeof cachedPosts === "string"
          ? cachedPosts
          : JSON.stringify(cachedPosts);

      try {
        return res.json(JSON.parse(cachedValue));
      } catch (parseError) {
        console.warn(
          "Invalid cache format for posts:all, skipping cache",
          parseError.message,
        );
      }
    }

    console.log("Cache MISS ❌", cacheKey);

    /*
    |--------------------------------------------------------------------------
    | 2. FETCH FROM MONGODB
    |--------------------------------------------------------------------------
    */
    const posts = await Post.find()
      .populate("author")
      .populate("repostedBy")
      .populate("originalPost")
      .sort({ createdAt: -1 })
      .limit(20);

    /*
    |--------------------------------------------------------------------------
    | 3. STORE IN REDIS
    |--------------------------------------------------------------------------
    */

    // Cache for 1 hour
    await redis.set(cacheKey, JSON.stringify(posts), { ex: 3600 });

    /*
    |--------------------------------------------------------------------------
    | 4. SEND RESPONSE HEADERS
    |--------------------------------------------------------------------------
    */

    res.set("X-Cache", "MISS");
    res.set("X-Response-Time", `${Date.now() - start}ms`);

    res.json(posts);
  } catch (err) {
    console.error("getPosts error:", err.message); // check terminal
    res.status(500).json({ message: err.message }); // see it in browser too
  }
};

export const getSinglePost = async (req, res) => {
  const start = Date.now();

  const { id } = req.params;

  // Unique cache key for every post
  const cacheKey = `post:${id}`;

  try {
    /*
    |--------------------------------------------------------------------------
    | 1. CHECK CACHE
    |--------------------------------------------------------------------------
    */
    const cachedPost = await redis.get(cacheKey);

    // CACHE HIT
    if (cachedPost) {
      console.log("Cache HIT ✅", cacheKey);

      res.set("X-Cache", "HIT");
      res.set("X-Response-Time", `${Date.now() - start}ms`);

      const cachedValue =
        typeof cachedPost === "string"
          ? cachedPost
          : JSON.stringify(cachedPost);

      try {
        return res.json(JSON.parse(cachedValue));
      } catch (parseError) {
        console.warn(
          `Invalid cache format for ${cacheKey}, skipping cache`,
          parseError.message,
        );
      }
    }

    console.log("Cache MISS ❌", cacheKey);

    /*
    |--------------------------------------------------------------------------
    | 2. FETCH FROM DB
    |--------------------------------------------------------------------------
    */
    const postDoc = await Post.findById(id).populate("author", ["username"]);

    if (!postDoc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. STORE IN REDIS
    |--------------------------------------------------------------------------
    */
    await redis.set(cacheKey, JSON.stringify(postDoc), { ex: 3600 });
    /*
    |--------------------------------------------------------------------------
    | 4. RESPONSE HEADERS
    |--------------------------------------------------------------------------
    */
    res.set("X-Cache", "MISS");
    res.set("X-Response-Time", `${Date.now() - start}ms`);

    res.json(postDoc);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const clapPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.id;

    // how many claps this click adds (1–10)
    const { count = 1 } = req.body;

    const existing = post.clappedBy.find((c) => c.user.toString() === userId);

    if (existing) {
      // Max 50 claps per user
      const newCount = Math.min(existing.count + count, 50);

      const added = newCount - existing.count;

      existing.count = newCount;

      post.claps += added;
    } else {
      post.clappedBy.push({
        user: userId,
        count: Math.min(count, 50),
      });

      post.claps += Math.min(count, 50);
    }

    await post.save();

    /*
    |--------------------------------------------------------------------------
    | CACHE INVALIDATION
    |--------------------------------------------------------------------------
    */

    // Remove single post cache
    await redis.del(`post:${req.params.id}`);

    // Remove feed cache because clap count changes there too
    await redis.del("posts:all");

    console.log(`Redis cache invalidated ✅ post:${req.params.id}`);

    console.log("Redis cache invalidated ✅ posts:all");

    // Return user's personal clap count + total
    const userClaps =
      post.clappedBy.find((c) => c.user.toString() === userId)?.count || 0;

    res.json({
      totalClaps: post.claps,
      userClaps,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const repostPost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // Check if user already reposted
    const alreadyReposted = originalPost.reposts.some(
      (id) => id.toString() === userId,
    );

    if (alreadyReposted) {
      // Undo repost
      originalPost.reposts = originalPost.reposts.filter(
        (id) => id.toString() !== userId,
      );
      originalPost.repostCount = Math.max(0, originalPost.repostCount - 1);
      await originalPost.save();

      // Remove the repost document
      await Post.deleteOne({
        originalPost: req.params.id,
        repostedBy: userId,
      });

      return res.json({
        reposted: false,
        repostCount: originalPost.repostCount,
      });
    }

    // Add repost
    originalPost.reposts.push(userId);
    originalPost.repostCount += 1;
    await originalPost.save();

    // Create a new Post that is a repost
    const repost = new Post({
      title: originalPost.title,
      content: originalPost.content,
      author: originalPost.author,
      cover: originalPost.cover, // or `image` if you named it that
      claps: 0,
      reposts: [],
      repostCount: 0,
      isRepost: true,
      originalPost: originalPost._id,
      repostedBy: userId,
    });

    await repost.save();

    res.json({ reposted: true, repostCount: originalPost.repostCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
