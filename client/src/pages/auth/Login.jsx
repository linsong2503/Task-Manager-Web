import FormInput from "../../components/common/FormInput.jsx";
import { Form, Button } from "antd";
import useAuth from "../../contexts/authContext.jsx";
import { Link } from "react-router-dom";
import * as restApi from "../../api/index.js";

export default function Login() {
  const { login } = useAuth();

  const onFinish = async (vals) => {
    const res = await restApi.authApi.login({
      username: vals.username,
      password: vals.password,
    });

    if (res?.tokens) {
      login(res);
    }
  };

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] bg-center bg-cover flex items-center justify-center px-4">
      <div className="w-full max-w-md p-5 sm:p-6 rounded-xl bg-white/30 backdrop-blur-sm outline-solid">
        <div className="mb-5 text-center">
          <h1 className="text-black text-2xl sm:text-3xl">TMS</h1>
          <p className="text-sm sm:text-base text-black">
            Welcome back, please log in first
          </p>
        </div>

        <Form
          labelWrap
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
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

          <div>
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

            <Link to="/forgot-password">
              <p className="-mt-3 mb-4 text-right text-sm text-black cursor-pointer hover:text-blue-400">
                Forgot password?
              </p>
            </Link>
          </div>

          <div className="flex w-full gap-3 sm:gap-5">
            <Button
              type="default"
              className="
                flex-1
                bg-green-500!
                border-gray-300!
                text-gray-800!
                hover:bg-gray-200!
              "
              htmlType="submit"
            >
              Login
            </Button>

            <Link to="/register" className="flex-1">
              <Button
                type="default"
                className="
                  w-full
                  bg-gray-100!
                  border-gray-200!
                  text-gray-800!
                  hover:bg-green-500/90!
                "
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}