import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import * as _api from "../../api/index.js";

const ForgotPassword = () => {
  const [form] = Form.useForm();

  const onFinish = async (vals) => {
  try {
    await _api.authApi.forgotPassword({
      email: vals.email,
    });

    message.success("Reset password link has been sent to your email.");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input
              type="email"
              size="large"
              maxLength={100}
              placeholder="Enter your email"
              className="text-base"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="mb-5"
          >
            Send Reset Link
          </Button>

          <Link
            to="/login"
            className="block text-center text-gray-600 hover:text-blue-500"
          >
            Back to login
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;