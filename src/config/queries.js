import { VehicleCheck } from "../models/vehicleCheck.js";
// Create
// export const createUser = async (data) => {
//   const user = new User(data);
//   return await user.save();
// };

// Get by ID
// export const getUserById = async (id) => {
//   return await User.findOne({ id });
// };

// Update
// export const updateUser = async (id, data) => {
//   const user = await User.findOneAndUpdate({ id }, data, { new: true });
//   if (!user) throw new Error(`User with id ${id} not found`);
//   return user;
// };

// Upsert
// export const upsertUser = async (data) => {
//   return await User.findOneAndUpdate(
//     { id: data.id },
//     data,
//     { upsert: true, new: true }
//   );
// };



// Create
export const createVehicleCheck = async (data) => {
  const vehicleCheck = new VehicleCheck(data);
  return await vehicleCheck.save();
};

// Get all (latest first, with user populated)
export const getAllVehicleChecks = async () => {
  return await VehicleCheck.find()
    .populate("userId")
    .sort({ createdAt: -1 });
};

// Get by ID (with user + comments populated)
export const getVehicleCheckById = async (id) => {
  return await VehicleCheck.findOne({ id })
    .populate("userId")
    .populate({
      path: "comments",
      populate: { path: "userId" },
      options: { sort: { createdAt: -1 } },
    });
};

// Get by User ID
export const getVehicleChecksByUserId = async (userId) => {
  return await VehicleCheck.find({ userId })
    .populate("userId")
    .sort({ createdAt: -1 });
};

// Update
export const updateVehicleCheck = async (id, data) => {
  const vehicleCheck = await VehicleCheck.findOneAndUpdate({ id }, data, { new: true });
  if (!vehicleCheck) throw new Error(`Vehicle check with id ${id} not found`);
  return vehicleCheck;
};

// Delete
export const deleteVehicleCheck = async (id) => {
  const vehicleCheck = await VehicleCheck.findOneAndDelete({ id });
  if (!vehicleCheck) throw new Error(`Vehicle check with id ${id} not found`);
  return vehicleCheck;
};


import { Comment } from "./models/comment.js";

// Create
export const createComment = async (data) => {
  const comment = new Comment(data);
  return await comment.save();
};

// Get by ID (with user populated)
export const getCommentById = async (id) => {
  return await Comment.findOne({ id }).populate("userId");
};

// Delete
export const deleteComment = async (id) => {
  const comment = await Comment.findOneAndDelete({ id });
  if (!comment) throw new Error(`Comment with id ${id} not found`);
  return comment;
};
