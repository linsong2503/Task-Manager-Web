import { Form, Input } from "antd";

const FormInput = ({
  name,
  label,
  placeholder,
  type = "text",
  rules = [],
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      layout="vertical"
    >
      <Input
        type={type}
        placeholder={placeholder}
        size="large"
        className="text-base"
      />
    </Form.Item>
  );
};

export default FormInput;