import FormInput from "../../components/common/FormInput.jsx";
import { Form, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import * as _api from "../../api/index.js";

export default function Register() {
  const navigate = useNavigate();

  const onFinish = async (vals) => {
    const res = await _api.authApi.register({
      name: vals.name,
      username: vals.username,
      email: vals.email,
      password: vals.password,
    });

    if (res?.tokens) {
      navigate("/login");
    }
  };

  return (
    <div className="bg-[url(/bgimg.png)] bg-center bg-cover min-h-screen flex items-center justify-center px-4 py-6">
      <div className="p-5 sm:p-6 rounded-xl w-full max-w-md bg-transparent outline-solid">
        <div className="mb-4 text-center">
          <h1 className="text-black text-2xl sm:text-3xl">
            Sign Up
          </h1>
        </div>

        <Form
          labelWrap
          name="signup"
          autoComplete="off"
          onFinish={onFinish}
          layout="vertical"
        >
          <FormInput
            name="name"
            label="Full name"
            placeholder="Your fullname"
            rules={[
              {
                required: true,
                message: "Please enter your fullname",
              },
            ]}
          />

          <FormInput
            name="username"
            label="Username"
            placeholder="Enter username"
            rules={[
              {
                required: true,
                message: "Please enter your username",
              },
            ]}
          />

          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
            ]}
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          />

          <div className="flex w-full mb-4">
            <Button
              type="default"
              htmlType="submit"
              className="w-full h-10! bg-green-500! border-gray-300! text-gray-800! hover:bg-gray-200!"
            >
              Sign Up
            </Button>
          </div>

          <Link to="/login" className="block text-center">
            <p className="text-black text-sm sm:text-base hover:text-blue-500">
              Already have an account? Sign in
            </p>
          </Link>
        </Form>
      </div>
    </div>
  );
}