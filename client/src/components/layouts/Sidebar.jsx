import viteLogo from "../../assets/vite.svg";
import { Image } from "antd";
import {
  DashboardOutlined,
  OrderedListOutlined,
  LineChartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { STORAGE_KEY } from "../../utils/constant.js";
import * as _api from "../../api/index.js";

const Sidebar = ({
  isSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(
        STORAGE_KEY.REFRESH_TOKEN,
      );

      if (refreshToken) {
        await _api.authApi.logout({
          refreshToken,
        });
      }

      localStorage.removeItem(STORAGE_KEY.TOKEN);
      localStorage.removeItem(
        STORAGE_KEY.REFRESH_TOKEN,
      );

      navigate("/auth/login");
    } catch (error) {
      console.log("Logout error:", error);

      localStorage.removeItem(STORAGE_KEY.TOKEN);
      localStorage.removeItem(
        STORAGE_KEY.REFRESH_TOKEN,
      );

      navigate("/auth/login");
    }
  };

  const SidebarItems = [
    {
      id: "main",
      items: [
        {
          icon: <DashboardOutlined />,
          label: "Dashboard",
          href: "/",
        },
        {
          icon: <OrderedListOutlined />,
          label: "Tasks",
          href: "/tasks",
        },
        {
          icon: <LineChartOutlined />,
          label: "Statistics",
          href: "/statistics",
        },
      ],
    },
    {
      id: "account",
      items: [
        {
          icon: <UserOutlined />,
          label: "Profile",
          href: "/profile",
        },
        {
          icon: <SettingOutlined />,
          label: "Settings",
          href: "/settings",
        },
        {
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const sidebarClassName = `
    fixed
    flex
    flex-col
    top-0
    left-0
    h-full
    bg-white
    transition-all
    duration-300
    overflow-y-auto
    shadow-md
    z-50

    ${
      isSidebarCollapsed
        ? "md:w-16"
        : "md:w-[236px]"
    }

    w-[236px]

    ${
      isMobileSidebarOpen
        ? "translate-x-0"
        : "-translate-x-full md:translate-x-0"
    }
  `;

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() =>
            setIsMobileSidebarOpen(false)
          }
        />
      )}

      <div className={sidebarClassName}>
        <div
          className={`
            flex
            items-center
            gap-3
            pt-5
            ${
              isSidebarCollapsed
                ? "justify-center px-3"
                : "px-8"
            }
          `}
        >
          <Image
            src={viteLogo}
            alt=""
            width={45}
            height={45}
            preview={false}
            className="rounded w-10"
          />

          {!isSidebarCollapsed && (
            <h1 className="font-extrabold text-2xl">
              TMS
            </h1>
          )}

          <button
            type="button"
            className="ml-auto md:hidden px-3 py-2 rounded-full bg-gray-100 hover:bg-blue-100"
            onClick={() =>
              setIsMobileSidebarOpen(false)
            }
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="w-full border-t border-gray-300 mt-5" />

        <div className="grow mt-3">
          {SidebarItems.map((section) => (
            <div key={section.id}>
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href;

                const content = (
                  <div
                    onClick={item.onClick}
                    className={`
                      cursor-pointer
                      flex
                      items-center
                      gap-3
                      py-4
                      hover:bg-blue-100
                      transition-colors

                      ${
                        isSidebarCollapsed
                          ? "justify-center px-3"
                          : "justify-start px-8"
                      }

                      ${
                        isActive
                          ? "bg-blue-200"
                          : ""
                      }
                    `}
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-gray-700 shrink-0">
                      {item.icon}
                    </div>

                    {!isSidebarCollapsed && (
                      <span className="font-medium text-gray-700 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>
                );

                if (item.onClick) {
                  return (
                    <div key={item.label}>
                      {content}
                    </div>
                  );
                }

                return (
                  <Link
                    to={item.href}
                    key={item.label}
                    onClick={() =>
                      setIsMobileSidebarOpen(false)
                    }
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;