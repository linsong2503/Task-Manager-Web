import { message, notification } from "antd";
import axios from "axios";
import { STORAGE_KEY } from "../utils/constant.js";
import { baseURL } from "./config.js";
import { useState, useEffect } from "react";

const key_message = "open_api_message";

export const getToken = () => {
  const token = localStorage.getItem(STORAGE_KEY.TOKEN);

  if (!token) return null;

  return `Bearer ${token}`;
};

export const HTTP = axios.create({
  baseURL,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});

HTTP.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

HTTP.interceptors.response.use(
  (response) => response,
  (error) => {
    catchError(error);
    return Promise.reject(error);
  },
);

export const get = async (url, params = {}) => {
  message.loading({
    content: "Loading data",
    duration: 100000,
    top: 0,
    key: key_message,
    className: "message-loading-api",
  });

  try {
    const response = await HTTP.get(url, { params });

    message.destroy(key_message);

    return response.data;
  } catch (error) {
    message.destroy(key_message);
    throw error;
  }
};

export const post = async (url, payload = {}) => {
  message.loading({
    content: "Loading data",
    duration: 100000,
    top: 0,
    key: key_message,
    className: "message-loading-api",
  });

  try {
    const response = await HTTP.post(url, payload);

    message.destroy(key_message);

    return response.data;
  } catch (error) {
    message.destroy(key_message);
    throw error;
  }
};

export const patch = async (url, payload = {}) => {
  message.loading({
    content: "Loading data",
    duration: 100000,
    top: 0,
    key: key_message,
    className: "message-loading-api",
  });

  try {
    const response = await HTTP.patch(url, payload);

    message.destroy(key_message);

    return response.data;
  } catch (error) {
    message.destroy(key_message);
    throw error;
  }
};

export const put = async (url, payload = {}) => {
  message.loading({
    content: "Loading data",
    duration: 100000,
    top: 0,
    key: key_message,
    className: "message-loading-api",
  });

  try {
    const response = await HTTP.put(url, payload);

    message.destroy(key_message);

    return response.data;
  } catch (error) {
    message.destroy(key_message);
    throw error;
  }
};

export const deleteRequest = async (url, params = {}) => {
  message.loading({
    content: "Loading data",
    duration: 100000,
    top: 0,
    key: key_message,
    className: "message-loading-api",
  });

  try {
    const response = await HTTP.delete(url, { params });

    message.destroy(key_message);

    return response.data;
  } catch (error) {
    message.destroy(key_message);
    throw error;
  }
};

function catchError(error) {
  const response = error?.response;
  const data = response?.data;

  const message =
    data?.message ||
    data?.error?.message ||
    data?.error ||
    error?.message ||
    "Something went wrong";

  notification.error({
    message: "Error",
    description: message,
  });

  if (response?.status === 401) {
    localStorage.removeItem(STORAGE_KEY.TOKEN);
    localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}
export const useAxiosLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResponse = (response) => (setLoading(false), response);
    const handleRequest = (config) => (setLoading(true), config);
    const handleError = (error) => (setLoading(false), Promise.reject(error));
    const reqInterceptor = HTTP.interceptors.request.use(
      handleRequest,
      handleError,
    );
    // add response interceptors
    const resInterceptor = HTTP.interceptors.response.use(
      handleResponse,
      async (error) => {
        const originalRequest = error.config;
        setLoading(false);
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return axios(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }
          originalRequest._retry = true;
        }
        return Promise.reject(error);
      },
    );
    return () => {
      HTTP.interceptors.request.eject(reqInterceptor);
      HTTP.interceptors.response.eject(resInterceptor);
    };
  }, []);
  return loading;
};
