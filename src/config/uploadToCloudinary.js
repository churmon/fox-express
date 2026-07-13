import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";
// import cloudinary from "./cloudinary.js";

/**
 * Uploads a single in-memory file buffer (from Multer's memoryStorage) to
 * Cloudinary using an upload stream, so nothing is written to local disk.
 */
export const uploadBufferToCloudinary = (buffer, folder = "posts") =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

/**
 * Uploads up to 10 image buffers in parallel and returns just the secure URLs,
 * matching the `images: [String]` shape on the Post schema.
 */
export const uploadManyToCloudinary = async (files, folder = "posts") => {
  const results = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, folder))
  );
  return results.map((result) => result.secure_url);
};

/**
 * Cloudinary needs a public_id to delete an asset, but the Post schema only
 * stores the secure_url string. This derives the public_id (including
 * folder) back out of a Cloudinary URL so deletes still work.
 * e.g. https://res.cloudinary.com/<cloud>/image/upload/v168/posts/abc123.jpg
 *   -> posts/abc123
 */
export const extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/upload/")[1]; // v168/posts/abc123.jpg
    if (!parts) return null;

    const withoutVersion = parts.replace(/^v\d+\//, ""); // posts/abc123.jpg
    const lastDot = withoutVersion.lastIndexOf(".");
    return lastDot === -1 ? withoutVersion : withoutVersion.slice(0, lastDot);
  } catch {
    return null;
  }
};

/**
 * Deletes an asset from Cloudinary by secure_url.
 */
export const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
