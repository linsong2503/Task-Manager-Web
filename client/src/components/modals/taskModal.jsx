import { Button, DatePicker, Form, Input, Modal, Select, message } from "antd";
import dayjs from "dayjs";
import * as _api from "../../api/index.js";
import useSettings from "../../contexts/settingsContext.jsx";
import { useEffect,useState } from "react";
const TaskModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { settings } = useSettings();
const [modalWidth, setModalWidth] = useState(
    window.innerWidth < 768 ? "90%" : 450,
  );

  useEffect(() => {
    const handleResize = () => {
      setModalWidth(
        window.innerWidth < 768 ? "90%" : 450,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        priority: settings.defaultPriority,
        status: "todo",
      });
    }
  }, [open, settings.defaultPriority, form]);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      dueDate: values.dueDate.toISOString(),
    };
    const res = await _api.taskApi.createTask(payload);
    if (res.code === 1) {
      message.success("Task created successfully");
      form.resetFields();
      await onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      title={
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">
            Create New Task
          </span>

          <span className="text-sm font-normal text-gray-500">
            Fill in the details below to create a new task.
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={modalWidth}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: settings.defaultPriority,
          status: "todo",
        }}
        className="mt-5"
      >
        {/* Title */}
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter a task title",
            },
            {
              min: 3,
              message: "Title must be at least 3 characters",
            },
            {
              max: 100,
              message: "Title cannot exceed 100 characters",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter task title"
            maxLength={100}
            showCount
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="content"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter a task description",
            },
            {
              min: 10,
              message: "Description must be at least 10 characters",
            },
            {
              max: 500,
              message: "Description cannot exceed 500 characters",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Describe your task..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* Priority + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            label="Priority"
            name="priority"
            rules={[
              {
                required: true,
                message: "Please select a priority",
              },
            ]}
            initialValue="medium"
          >
            <Select
              size="large"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please select a status",
              },
            ]}
            initialValue="todo"
          >
            <Select
              size="large"
              options={[
                { value: "todo", label: "To Do" },
                { value: "doing", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ]}
            />
          </Form.Item>
        </div>

        {/* Due Date */}
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[
            {
              required: true,
              message: "Please select a due date",
            },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }

                if (value.isBefore(dayjs(), "day")) {
                  return Promise.reject(
                    new Error("Due date cannot be in the past"),
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            size="large"
            className="w-full"
            placeholder="Select due date"
            disabledDate={(current) =>
              current && current.isBefore(dayjs(), "day")
            }
          />
        </Form.Item>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button size="large" onClick={onClose}>
            Cancel
          </Button>

          <Button type="primary" size="large" htmlType="submit">
            Create Task
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskModal;
