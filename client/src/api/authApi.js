import * as restApi from "./restApi.js";

export const register = (payload) => {
  return restApi.post("auth/users", payload);
};

export const login = (payload) => {
  return restApi.post("auth/login", payload);
};

export const logout = (payload) => {
  return restApi.post("/auth/logout", payload);
};

export const forgotPassword = (payload) =>{
  return restApi.post("/auth/forgot-password",payload)
}

export const resetPassword = (payload) => {
  return restApi.post("/auth/reset-password", payload);
};