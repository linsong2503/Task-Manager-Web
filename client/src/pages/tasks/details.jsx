import { Modal, Tag } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const TaskDetails = ({ open, onClose, task }) => {
    
  return (
    <Modal
      title={
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Task Details
          </h2>
          <p className="text-sm font-normal text-gray-500">
            View the details and information of this task.
          </p>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
      <div className="mt-6 space-y-6">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Title
          </p>

          <h1 className="text-xl font-semibold text-gray-900">
            {task?.title || ""}
          </h1>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Description
          </p>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm leading-6 text-gray-600">
              {task?.content ||
                ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <ClockCircleOutlined />
              <span className="text-sm">Status</span>
            </div>

            <Tag color="blue">
              {task?.status === "doing"
                ? "In Progress"
                : task?.status === "completed"
                  ? "Completed"
                  : "To Do"}
            </Tag>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <span className="text-sm">Priority</span>
            </div>

            <Tag
              color={
                task?.priority === "high"
                  ? "red"
                  : task?.priority === "medium"
                    ? "gold"
                    : "green"
              }
            >
              {task?.priority || ""}
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <CalendarOutlined />
              <span className="text-sm">Due Date</span>
            </div>

            <p className="font-medium text-gray-900">
              {task?.dueDate
                ? new Date(task.dueDate).toLocaleDateString("en-GB")
                : ""}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-500">
              <UserOutlined />
              <span className="text-sm">Created By</span>
            </div>

            <p className="font-medium text-gray-900">
              {task?.creator?.name || ""}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {task?.creator?.email|| ""}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:justify-between">
            <span>
              Created:{" "}
              {task?.createdAt
                ? new Date(task.createdAt).toLocaleString("en-GB")
                : ""}
            </span>

            <span>
              Updated:{" "}
              {task?.updatedAt
                ? new Date(task.updatedAt).toLocaleString("en-GB")
                : ""}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetails;