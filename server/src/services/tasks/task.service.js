import { TaskModel } from "../../models/index.js";
import ApiError from "../../utils/apiError.js";
import httpStatus from "http-status";

export const getTasks = async (filter, options, user) => {
  const finalFilter = {
    ...filter,
    isDeleted: false,
  };

  if (user.role !== "admin") {
    finalFilter.creator = user._id;
  }

  return TaskModel.paginate(finalFilter, {
    ...options,
    populate: {
      path: "creator",
      select: "username name email role",
    },
  });
};

export const getTaskById = async (id, user) => {
  const task = await TaskModel.findOne({
    _id: id,
    isDeleted: false,
  }).populate("creator", "username name email role");

  if (!task) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Task not found"
    );
  }

  const userId = String(user._id);
  const creatorId = String(task.creator._id);


  if (user.role !== "admin" && userId !== creatorId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have permission to access this task"
    );
  }

  return task;
};

export const createTask = async (data, user) => {
  const { creator, ...taskData } = data;

  return TaskModel.create({
    ...taskData,
    creator: user._id,
  });
};

export const updateTaskById = async (id, data, user) => {
  const task = await TaskModel.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Task not found"
    );
  }

  if (
    user.role !== "admin" &&
    task.creator.toString() !== user._id.toString()
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have permission to update this task"
    );
  }

  const { creator, ...updateData } = data;

  Object.assign(task, updateData);

  await task.save();

  return task;
};

export const deleteTaskById = async (id, user) => {
  const task = await TaskModel.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!task) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Task not found"
    );
  }

  if (
    user.role !== "admin" &&
    task.creator.toString() !== user._id.toString()
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You do not have permission to delete this task"
    );
  }

  task.isDeleted = true;

  await task.save();

  return task;
};