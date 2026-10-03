import { UserModel } from "../../models/index.js";
import ApiError from "../../utils/apiError.js";
import httpStatus from 'http-status'
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await UserModel.isUsernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  return UserModel.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const { searchText, ...otherFilters } = filter;
  let finalFilter = { ...otherFilters };
  if (searchText) {
    const searchRegex = new RegExp(searchText, "i");
    finalFilter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
  }
  const users = await UserModel.paginate(finalFilter, {
    ...options,
  });

  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return UserModel.findById(id);
};

/**
 * Get user by email
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return UserModel.findOne({ username });
};
const getUserByEmail = async (_email) => {
  return UserModel.findOne({ email: _email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    updateBody.username &&
    (await UserModel.isUsernameTaken(updateBody.username, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const updateStatus = async (id, updateBody) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const getAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByUsername,
  updateUserById,
  deleteUserById,
  updateStatus,
  getAllUsers,
  getUserByEmail,
};
