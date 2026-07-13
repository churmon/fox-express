import { uploadImages } from "../config/cloudinary.js";
import { VehicleCheck } from "../models/vehicleCheck.js";
import { vehicleCheckSchema } from "../validations/zod.js";

export const getAllVehicleChecks = async (req, res) => {
  try {
    const user = req.user; // Assuming user is attached to req.user by requireAuth middleware
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const vehicleChecks = await VehicleCheck.find()
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json(vehicleChecks);
  } catch (error) {
    console.error("Error getting vehicle checks:", error);
    res.status(500).json({ message: "Failed to get vehicle checks" });
  }
};


export const createVehicleChecks = async (req, res) => {
  try {
    // const { userId } = getAuth(req);
    // if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.user; // Assuming user is attached to req.user by requireAuth middleware
    const images = await uploadImages(req.files);
    const result = vehicleCheckSchema.safeParse(req.body);
    const images = req.files.map(file => file.path);
     if (!result.success) {
      return res.status(400).json({ message: result.error.flatten() });
    }

    if (!user) {
      console.error("Unauthorized access attempt");
      return res.status(401).json({ message: "Unauthorized" });
    }
    

    const result = vehicleCheckSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.flatten() });
    }

    const vehicleCheck = new VehicleCheck({ ...result.data, images, userId: user.id });
    await vehicleCheck.save();

    res.status(201).json(vehicleCheck);
  } catch (error) {
    console.error("Error creating vehicle check:", error);
    res.status(500).json({ message: "Failed to create vehicle check" });
  }
};


export const updateVehicleChecks = async (req, res) => {
  try {
    // const { userId } = getAuth(req);
    // if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.user; // Assuming user is attached to req.user by requireAuth middleware
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    // const { title, description, imageUrl } = req.body;
    const result = vehicleCheckSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.flatten() });
    }

    const existingProduct = await VehicleCheck.findOne({ id });
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    if (existingProduct.userId.toString() !== user.id) {
      return res.status(403).json({ message: "You can only update your own products" });
    }

    existingProduct.driverName = result.data.driverName;
    existingProduct.details = result.data.details;
    existingProduct.regNumber = result.data.regNumber;
    await existingProduct.save();

    res.status(200).json(existingProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};


export const deleteVehicleChecks = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const existingProduct = await Product.findOne({ id });
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    if (existingProduct.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    await Product.deleteOne({ id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
