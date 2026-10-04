import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as _api from "../../api/index.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const onFinish = async (values) => {
    try {
      await _api.authApi.resetPassword({
        token,
        password: values.password,
      });

      message.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below.
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="New password"
            name="password"
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
          >
            <Input.Password
              size="large"
              placeholder="Enter new password"
              className="text-base"
            />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
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
              className="text-base"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            disabled={!token}
          >
            Reset Password
          </Button>

          <Link
            to="/login"
            className="block text-center mt-5 text-gray-600 hover:text-blue-500"
          >
            Back to login
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;