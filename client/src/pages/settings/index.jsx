import {
  Card,
  Select,
  Switch,
  Divider,
  Button,
  message,
} from "antd";
import {
  SettingOutlined,
  BgColorsOutlined,
  BellOutlined,
  CheckSquareOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { STORAGE_KEY } from "../../utils/constant.js";
import * as _api from "../../api/index.js";
import useSettings from "../../contexts/settingsContext.jsx";

const Settings = () => {
  const navigate = useNavigate();

  const {
    settings,
    updateSetting,
    resetSettings,
  } = useSettings();

  const handleReset = () => {
    resetSettings();
    message.success("Settings reset successfully");
  };

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
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEY.TOKEN);
      localStorage.removeItem(
        STORAGE_KEY.REFRESH_TOKEN,
      );

      navigate("/login");
    }
  };

  return (
    <div className="px-3 pb-5 sm:px-5 md:px-7">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <SettingOutlined className="text-2xl text-blue-500" />

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Settings
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your application preferences
            </p>
          </div>
        </div>
      </div>

      <div className="flex max-w-4xl flex-col gap-8">
       
        <Card
          title={
            <div className="flex items-center gap-2">
              <CheckSquareOutlined className="text-green-500" />
              <span>Task Preferences</span>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-800">
                  Default priority
                </p>

                <p className="text-sm text-gray-500">
                  Priority used when creating a new task
                </p>
              </div>

              <Select
                value={settings.defaultPriority}
                onChange={(value) =>
                  updateSetting(
                    "defaultPriority",
                    value,
                  )
                }
                className="w-32"
                options={[
                  {
                    label: "Low",
                    value: "low",
                  },
                  {
                    label: "Medium",
                    value: "medium",
                  },
                  {
                    label: "High",
                    value: "high",
                  },
                ]}
              />
            </div>

            <Divider />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-800">
                  Default sorting
                </p>

                <p className="text-sm text-gray-500">
                  How tasks are sorted by default
                </p>
              </div>

              <Select
                value={settings.defaultSort}
                onChange={(value) =>
                  updateSetting(
                    "defaultSort",
                    value,
                  )
                }
                className="w-40"
                options={[
                  {
                    label: "Due date",
                    value: "dueDate",
                  },
                  {
                    label: "Created date",
                    value: "createdAt",
                  },
                ]}
              />
            </div>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-purple-500" />
              <span>Account</span>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <Link to="/profile">
              <Button
                block
                className="h-10 text-left"
              >
                Manage Profile
              </Button>
            </Link>

            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="h-10"
            >
              Logout
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleReset}>
            Reset Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;