import { Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import * as _api from "../../api/index.js";

const { TextArea } = Input;

const TaskEditModal = ({ open, onClose, task, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOpen = () => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        content: task.content,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate.toISOString(),
      };

      const res = await _api.taskApi.updatedTask(task._id,payload);

      if (res?.code === 1) {
        message.success("Task updated successfully");
        await onSuccess();
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  return (
    <Modal
      title={
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Task
          </h2>
          <p className="text-sm font-normal text-gray-500">
            Update the details of this task.
          </p>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      afterOpenChange={(visible) => {
        if (visible) {
          handleOpen();
        }
      }}
      footer={null}
      width={650}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a task title",
            },
          ]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="content"
          rules={[
            {
              required: true,
              message: "Please enter a task description",
            },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Enter task description"
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            label="Priority"
            name="priority"
            rules={[
              {
                required: true,
                message: "Please select priority",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "low",
                  label: "Low",
                },
                {
                  value: "medium",
                  label: "Medium",
                },
                {
                  value: "high",
                  label: "High",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please select status",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "todo",
                  label: "To Do",
                },
                {
                  value: "doing",
                  label: "In Progress",
                },
                {
                  value: "completed",
                  label: "Completed",
                },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[
            {
              required: true,
              message: "Please select due date",
            },
          ]}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Cancel
          </Button>

          <Button type="primary" htmlType="submit">
            Update Task
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskEditModal;