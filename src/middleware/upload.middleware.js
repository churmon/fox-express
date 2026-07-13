// // import multer from "multer";

import multer from "multer";

// Memory storage keeps files as buffers (req.files[i].buffer) instead of
// writing to disk, since we stream them straight to Cloudinary.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
    files: 10, // hard cap of 10 images per request
  },
});






// // const storage = multer.memoryStorage();

// // export const upload = multer({
// //     storage,
// //     limits: {
// //         files: 10,
// //         fileSize: 10 * 1024 * 1024,
// //     },
// // });

// import express from "express";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { VehicleCheck } from "./models/vehicleCheck.js"; // your Mongoose/Drizzle model
// import { getAuth } from "better-auth/express"; // authentication helper

// const router = express.Router();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Multer storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "vehicle-checks",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// export const upload = multer({ storage });
