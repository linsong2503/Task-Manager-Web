import "dotenv/config";
import mongoose from "mongoose";
import { UserModel } from "../models/index.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await UserModel.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
      return;
    }

    const password = process.env.ADMIN_PASSWORD;

    const admin = await UserModel.create({
      username: process.env.ADMIN_USERNAME,
      name: "System Admin",
      email: process.env.ADMIN_EMAIL,
      password,
      role: "admin",
      active: true,
    });

    console.log(`Admin created: ${admin.email}`);
  } catch (error) {
    console.error("Failed to create admin:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();