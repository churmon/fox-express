import { deleteFromCloudinary, uploadManyToCloudinary } from "../config/uploadToCloudinary.js";
import { VehicleCheck } from "../models/vehicleCheck.js";

// Accepts `checklist` as either a real array (rare, with certain form-data
// encodings) or a JSON string (the common case when sending via multipart
// form-data, e.g. checklist='["Tyres", "Brakes"]').
const parseChecklist = (equipment) => {
  if (!equipment) return [];
  if (Array.isArray(equipment)) return equipment;
  try {
    const parsed = JSON.parse(equipment);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [equipment];
  }
};

// POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { driverName, regNumber, details, equipment } = req.body;
    console.log("Received data:", { driverName, regNumber, details, equipment });

    if (!regNumber) {
      return res.status(400).json({ message: "regNumber is required" });
    }

    let imageUrls = [];
    if (req.files?.length > 0) {
      imageUrls = await uploadManyToCloudinary(req.files, "vehicle-checks");
    }

    const post = await VehicleCheck.create({
      userId: req.user.id,
      driverName,
      regNumber,
      details,
      images: imageUrls,
      checklist: parseChecklist(equipment),
    });

    return res.status(201).json({ post });
  } catch (err) {
    console.error("createPost error:", err);
    return res.status(500).json({ message: "Failed to create post" });
  }
};

// GET /api/posts (only the current user's posts; paginated)
export const getPosts = async (req, res) => {
  try {


    const posts = await VehicleCheck.find().sort({ createdAt: -1 });
    return res.json(posts);
    // const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    // const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    // const [posts, total] = await Promise.all([
    //   VehicleCheck.find()
    //     .sort({ createdAt: -1 })
    //     .skip((page - 1) * limit)
    //     .limit(limit),
    //   VehicleCheck.countDocuments(),
    // ]);

    // return res.json({
    //   posts,
    //   pagination: {
    //     page,
    //     limit,
    //     total,
    //     totalPages: Math.ceil(total / limit),
    //   },
    // });
  } catch (err) {
    console.error("getPosts error:", err);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// GET /api/posts (only the current user's posts; paginated)
export const getUserPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    const [posts, total] = await Promise.all([
      VehicleCheck.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      VehicleCheck.countDocuments({ userId: req.user.id }),
    ]);

    return res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getUserPosts error:", err);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await VehicleCheck.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post });
  } catch (err) {
    console.error("getPostById error:", err);
    return res.status(500).json({ message: "Failed to fetch post" });
  }
};

// PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { driverName, regNumber, details, checklist, removeImages } = req.body;

    if (removeImages) {
      const toRemove = parseChecklist(removeImages);
      await Promise.all(toRemove.map((url) => deleteFromCloudinaryinary(url)));
      post.images = post.images.filter((url) => !toRemove.includes(url));
    }

    if (req.files?.length > 0) {
      const remainingSlots = 10 - post.images.length;
      if (remainingSlots <= 0) {
        return res
          .status(400)
          .json({ message: "A post can have at most 10 images" });
      }
      const filesToUpload = req.files.slice(0, remainingSlots);
      const newUrls = await uploadManyToCloudinary(filesToUpload, "posts");
      post.images = [...post.images, ...newUrls];
    }

    if (driverName !== undefined) post.driverName = driverName;
    if (regNumber !== undefined) post.regNumber = regNumber;
    if (details !== undefined) post.details = details;
    if (checklist !== undefined) post.checklist = parseChecklist(checklist);

    await post.save();

    return res.json({ post });
  } catch (err) {
    console.error("updatePost error:", err);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Promise.all(post.images.map((url) => deleteFromCloudinary(url)));
    await post.deleteOne();

    return res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("deletePost error:", err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
