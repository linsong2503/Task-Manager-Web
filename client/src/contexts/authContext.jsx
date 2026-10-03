import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { STORAGE_KEY } from "../utils/constant.js";
import * as authApi from "../api/authApi.js";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const login = async (data) => {
    try {
      const accessToken = data.tokens.access.token;
      const refreshToken = data.tokens.refresh.token;

      setToken(accessToken);
      setUser(data.user);

      localStorage.setItem(
        STORAGE_KEY.TOKEN,
        accessToken,
      );

      localStorage.setItem(
        STORAGE_KEY.REFRESH_TOKEN,
        refreshToken,
      );

      localStorage.setItem(
        STORAGE_KEY.USER,
        JSON.stringify(data.user),
      );
    } catch (error) {
      setErrMsg(error);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(
        STORAGE_KEY.REFRESH_TOKEN,
      );

      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setToken(null);
      setUser(null);

      localStorage.removeItem(STORAGE_KEY.TOKEN);
      localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEY.USER);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(
      STORAGE_KEY.TOKEN,
    );

    const storedUser = localStorage.getItem(
      STORAGE_KEY.USER,
    );

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY.USER);
      }
    }

    setToken(storedToken);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated:
          loading
            ? undefined
            : !!token,
        user,
        loading,
        token,
        setUser,
        login,
        logout,
        errMsg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}