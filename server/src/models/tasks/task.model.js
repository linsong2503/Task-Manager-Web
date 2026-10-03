import mongoose from "mongoose";
import toJson from "../plugins/toJson.plugin.js";
import paginate from "../plugins/pagination.plugin.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["todo", "doing", "completed"],
      default: "todo",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
taskSchema.plugin(toJson);
taskSchema.plugin(paginate)

const Task = mongoose.model("Task", taskSchema);

export default Task;
