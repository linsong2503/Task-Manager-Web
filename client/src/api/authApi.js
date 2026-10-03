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

