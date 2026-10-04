import { lazy } from "react";
import {
  DashboardOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const staticPath = {
  dashboard: "/",
  tasks: "/tasks",
  statistics:"/statistics",
  profile:"/profile",
  settings: "/settings",
  login: "/login",
  register: "/register",
  forgotPassword:"/forgot-password"
};

export const routes = [
  {
    path: staticPath.dashboard,
    key: staticPath.dashboard,
    show_menu: true,
    private: true,
    component: lazy(() => import("../pages/dashboard/Dashboard.jsx")),
  },

  {
    path: staticPath.tasks,
    key: staticPath.tasks,
    private: true,
    component: lazy(() => import("../pages/tasks/index")),
  },
  {
    path: staticPath.statistics,
    key: staticPath.statistics,
    private: true,
    component: lazy(() => import("../pages/stats/index")),
  },
  {
    path: staticPath.profile,
    key: staticPath.profile,
    show_menu: true,
    private: true,
    component: lazy(() => import("../pages/profile/index")),
  },

  {
    path: staticPath.settings,
    key: staticPath.settings,
    icon: <SettingOutlined />,
    label: "Settings",
    show_menu: true,
    private: true,
    component: lazy(() => import("../pages/settings/index")),
  },

  {
    path: staticPath.login,
    key: staticPath.login,
    private: false,
    component: lazy(() => import("../pages/auth/Login.jsx")),
  },

  {
    path: staticPath.register,
    key: staticPath.register,
    show_menu: false,
    private: false,
    component: lazy(() => import("../pages/auth/Register.jsx")),
  },
];