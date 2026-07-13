import mongoose from "mongoose";

const vehicleCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Better Auth manages the User collection
    required: true,
  },
  driverName: { type: String },
  regNumber: { type: String, required: true },
  details: { type: String },
  images: { type: [String], default: [] }, // Cloudinary URLs
  checklist: { type: [String], default: [] }, // JSON strings
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// const postchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Better Auth manages the User collection
//     required: true,
//   },
//   driverName: { type: String },
//   regNumber: { type: String, required: true },
//   details: { type: String },
//   images: { type: [String], default: [] }, // Cloudinary URLs
//   checklist: { type: [String], default: [] }, // JSON strings
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt fields
// });

// Index for userId (like vehicle_check_userId_idx)
// vehicleCheckSchema.index({ userId: 1 });

export const VehicleCheck = mongoose.model("VehicleCheck", vehicleCheckSchema);
