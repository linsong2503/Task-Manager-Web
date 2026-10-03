import httpStatus from "http-status";
import { Types } from "mongoose";
import pick from "../../utils/pick.js";
import ApiError from "../../utils/apiError.js";
import catchAsync from "../../utils/catchAsync.js";
import userService from "../../services/auth/user.service.js";

const createUser = catchAsync(async (req, res) => {
  req.body = {
    ...req.body,
    _id: new Types.ObjectId(req.body.id),
  };
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Get users list.
 * @type {(function(*, *, *): void)|*}
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["username", "name", "email", "searchText"]);

  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const result = await userService.queryUsers(filter, options);

  result.results = result.results.map((user) => user.toJSON());

  res.send({
    ...result,
    code: 1,
  });
});

/**
 * Get user by id.
 * @type {(function(*, *, *): void)|*}
 */
const getUserById = catchAsync(async (req, res) => {
  const User = await userService.getUserById(req.params.userId);
  if (!User) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({ User, code: 1 });
});

/**
 * Update user by id.
 * @type {(function(*, *, *): void)|*}
 */
const updateUser = catchAsync(async (req, res) => {
  req.body = {
    ...req.body,
    updatedBy: req.user?.id,
  };
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

/**
 * Delete user by id.
 * @type {(function(*, *, *): void)|*}
 */

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.send({ code: 1, data: users });
});

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
