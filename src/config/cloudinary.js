// config/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary;

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "vehicle-checks",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// // export default cloudinary;


// // services/cloudinary.service.js

// // const cloudinary = require("../config/cloudinary");

// export async function uploadImages(files) {

//     const uploads = files.map((file) => {

//         return new Promise((resolve, reject) => {

//             cloudinary.uploader
//                 .upload_stream(
//                     {
//                         folder: "vehicle-checks",
//                     },
//                     (error, result) => {

//                         if (error) return reject(error);

//                         resolve(result.secure_url);
//                     }
//                 )
//                 .end(file.buffer);

//         });

//     });

//     return Promise.all(uploads);
// }


