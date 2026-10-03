import httpStatus from "http-status";
import {
  authService,
  userService,
  tokenService,
  emailService,
} from "../../services/index.js";
import catchAsync from "../../utils/catchAsync.js";

export const register = catchAsync(async (req, res) => {
  const newUser = await userService.default.createUser({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const tokens = await tokenService.default.generateAuthTokens(newUser);
  res.status(httpStatus.CREATED).send({ newUser, tokens });
});

export const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.default.loginUserWithUsernameAndPassword(
    username,
    password,
  );
  const tokens = await tokenService.default.generateAuthTokens(user);
  res.send({ user, tokens, code: 1 });
});

export const logout = catchAsync(async (req, res) => {
  await authService.default.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.default.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens, code: 1 });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken =
    await tokenService.default.generateResetPasswordToken(req.body.email);
  await emailService.default.sendResetPasswordEmail(
    req.body.email,
    resetPasswordToken,
  );
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req, res) => {
  await authService.default.resetPassword(
    req.body.token,
    req.body.password
  );
  res.status(httpStatus.NO_CONTENT).send();
});


export const changePassword = catchAsync(async (req, res) => {
  await authService.default.changePassword(
    req.user._id,
    req.body.oldPassword,
    req.body.newPassword,
  );
  res.send({ code: 1 });
});

export const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.default.generateVerifyEmailToken(req.user);
    await emailService.default.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req, res) => {
    await authService.default.verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
});

