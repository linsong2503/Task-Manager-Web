import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Tag,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import useAuth from "../../contexts/authContext.jsx";
import * as _api from "../../api/index.js";

const Profile = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async (values) => {
    // try {
    //   setIsChangingPassword(true);

    //   const res = await _api.authApi.changePassword({
    //     oldPassword: values.oldPassword,
    //     newPassword: values.newPassword,
    //   });

    //   if (res?.code === 1) {
    //     message.success("Password changed successfully");
    //     form.resetFields();
    //   }
    // } catch (error) {
    //   console.log("Change password error:", error);
    // } finally {
    //   setIsChangingPassword(false);
    // }
  };

  return (
    <div className="px-3 pb-5 sm:px-5 md:px-7">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your profile and account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profile Information">
          <div className="flex flex-col items-center mb-8">
            <Avatar
              size={96}
              icon={<UserOutlined />}
              className="bg-blue-500"
            />

            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              {user?.name || "User"}
            </h2>

            <p className="text-gray-500">
              @{user?.username || "username"}
            </p>

            {user?.role && (
              <Tag color="blue" className="mt-2">
                {user.role}
              </Tag>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <UserOutlined className="text-blue-500" />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Full name
                </p>
                <p className="font-medium text-gray-800">
                  {user?.name || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <IdcardOutlined className="text-gray-500" />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Username
                </p>
                <p className="font-medium text-gray-800">
                  {user?.username || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <MailOutlined className="text-green-500" />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Email
                </p>
                <p className="font-medium text-gray-800">
                  {user?.email || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <UserOutlined className="text-purple-500" />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Role
                </p>
                <p className="font-medium text-gray-800 capitalize">
                  {user?.role || "-"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-2">
              <LockOutlined />
              <span>Change Password</span>
            </div>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label="Current Password"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter current password"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your new password",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                size="large"
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("newPassword") === value
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Passwords do not match"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Confirm new password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isChangingPassword}
              block
              size="large"
            >
              Change Password
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;