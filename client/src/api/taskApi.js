import * as restApi from "./restApi.js";

export const getTasks = async (payload) => {
  return restApi.get("tasks/", payload);
};
export const getTaskById = async (id) => {
  return restApi.get(`tasks/${id}`);
};
export const createTask = async (payload) => {
  return restApi.post("tasks/", { ...payload });
};

export const updatedTask = async (id,payload) =>{
  return restApi.patch(`tasks/${id}`,{...payload})
}

export const deleteTask = async (id) => {
  return restApi.deleteRequest(`tasks/${id}`);
};
