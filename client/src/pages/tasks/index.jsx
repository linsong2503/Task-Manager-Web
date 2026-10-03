import NewButton from "../../components/buttons/create";
import UserCard from "../../components/cards/userCard";
import TaskModal from "../../components/modals/taskModal.jsx";
import TaskDetails from "./details.jsx";
import TaskEditModal from "./edit.jsx";
import * as _api from "../../api/index.js";
import useSettings from "../../contexts/settingsContext.jsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Space,
  Tooltip,
  Button,
  Table,
  Spin,
  Tag,
  Dropdown,
  Popconfirm,
  message,
} from "antd";

import {
  ThunderboltOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const statusItems = [
  { key: "all", label: "All Statuses" },
  { key: "todo", label: "To Do" },
  { key: "doing", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

const priorityItems = [
  { key: "all", label: "All Priorities" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

const sortItems = [
  {
    key: "dueDate",
    label: (
      <span className="flex items-center gap-2">
        Due Date
        <ArrowUpOutlined />
      </span>
    ),
  },
  {
    key: "-dueDate",
    label: (
      <span className="flex items-center gap-2">
        Due Date
        <ArrowDownOutlined />
      </span>
    ),
  },
];

const TaskPage = () => {
  const settings = useSettings();
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text) => (
        <span className="font-semibold text-black">{text}</span>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center",
      render: (priority) => {
        const colors = {
          high: "red",
          medium: "gold",
          low: "green",
        };

        return <Tag color={colors[priority]}>{priority}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => {
        const labels = {
          todo: "To Do",
          doing: "In Progress",
          completed: "Completed",
        };

        const colors = {
          todo: "default",
          doing: "blue",
          completed: "green",
        };

        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      align: "center",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Details">
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record._id)}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <Button
              type="default"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditDetails(record._id)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete this task?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState(searchParams.get("status") || "all");

  const [priority, setPriority] = useState(
    searchParams.get("priority") || "all",
  );

  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "asc");

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [totalTasks, setTotalTasks] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [todo, setTodo] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const getTaskParams = () => {
    const params = {
      page: Number(searchParams.get("page")) || 1,
      limit: 5,
      sortBy: searchParams.get("sortBy") || settings.defaultSort,
      sortOrder: "asc",
    };
    const title = searchParams.get("title");
    const urlStatus = searchParams.get("status");
    const urlPriority = searchParams.get("priority");
    const urlSortBy = searchParams.get("sortBy");

    if (title) {
      params.title = title;
    }

    if (urlStatus) {
      params.status = urlStatus;
    }

    if (urlPriority) {
      params.priority = urlPriority;
    }
    if (urlSortBy) {
      params.sortBy = urlSortBy;
    }

    return params;
  };

  const fetchTasks = async (params) => {
    try {
      setIsLoading(true);

      const res = await _api.taskApi.getTasks(params);

      if (res?.code === 1) {
        setTasks(res.results?.results || []);

        setPagination({
          current: res.results?.page || 1,
          pageSize: res.results?.limit || 5,
          total: res.results?.totalResults || 0,
        });
      }
    } catch (error) {
      console.log("Error loading tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCounts = async (taskStatus) => {
    try {
      const params = {
        page: 1,
        limit: 1,
      };

      if (taskStatus) {
        params.status = taskStatus;
      }

      const res = await _api.taskApi.getTasks(params);

      if (res?.code === 1) {
        return res.results?.totalResults || 0;
      }

      return 0;
    } catch (error) {
      console.log("Error loading task count:", error);
      return 0;
    }
  };

  const getTaskById = async (id) => {
    try {
      const res = await _api.taskApi.getTaskById(id);
      if (res.code === 1) {
        return res.task || null;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  };

  const loadCounts = async () => {
    const total = await getCounts();
    const inProgressCount = await getCounts("doing");
    const completedCount = await getCounts("completed");
    const todoCount = await getCounts("todo");

    setTotalTasks(total);
    setInProgress(inProgressCount);
    setCompleted(completedCount);
    setTodo(todoCount);
  };

  useEffect(() => {
    const urlStatus = searchParams.get("status") || "all";
    const urlPriority = searchParams.get("priority") || "all";
    const urlSortBy = searchParams.get("sortBy") || "dueDate";

    setStatus(urlStatus);
    setPriority(urlPriority);
    setSortBy(urlSortBy);

    fetchTasks(getTaskParams());
  }, [searchParams]);

  useEffect(() => {
    loadCounts();
  }, []);

  const handleStatusChange = ({ key }) => {
    const params = new URLSearchParams(searchParams);

    if (key === "all") {
      params.delete("status");
    } else {
      params.set("status", key);
    }

    params.set("page", "1");

    setSearchParams(params);
  };

  const handlePriorityChange = ({ key }) => {
    const params = new URLSearchParams(searchParams);

    if (key === "all") {
      params.delete("priority");
    } else {
      params.set("priority", key);
    }

    params.set("page", "1");

    setSearchParams(params);
  };

  const handleSortingChange = ({ key }) => {
    const params = new URLSearchParams(searchParams);
    if (key === "dueDate") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page);

    setSearchParams(params);
  };

  const handleCreateSuccess = async () => {
    await loadCounts();

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    setSearchParams(params);

    await fetchTasks({
      ...getTaskParams(),
      page: 1,
    });
  };

  const handleEditSuccess = async () => {
    await loadCounts();
    await fetchTasks(getTaskParams());
  };

  const selectedStatus =
    statusItems.find((item) => item.key === status)?.label || "All Statuses";

  const selectedPriority =
    priorityItems.find((item) => item.key === priority)?.label ||
    "All Priorities";

  const selectedSorting =
    sortItems.find((item) => item.key === sortBy)?.label || "";

  const handleViewDetails = async (id) => {
    const task = await getTaskById(id);
    console.log(task);
    if (task) {
      setSelectedTask(task);
      setDetailsOpen(true);
    }
  };
  const handleEditDetails = async (id) => {
    const task = await getTaskById(id);
    console.log(task);
    if (task) {
      setSelectedTask(task);
      setEditOpen(true);
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await _api.taskApi.deleteTask(id);

      if (res?.code === 1) {
        message.success("Task deleted successfully");

        await loadCounts();
        await fetchTasks(getTaskParams());
      }
    } catch (error) {
      console.log("Error deleting task:", error);
      message.error("Failed to delete task");
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex justify-end mb-4">
        <NewButton onClick={() => setOpen(true)} />

        <TaskModal
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={handleCreateSuccess}
        />
        <TaskDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          task={selectedTask}
        />
        <TaskEditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          task={selectedTask}
          onSuccess={handleEditSuccess}
        />
      </div>

      <div className="w-full flex flex-col gap-8 mt-5">
        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <UserCard
            title="Total Tasks"
            nums={totalTasks}
            icon={<ThunderboltOutlined />}
            iconColor="text-blue-500"
          />

          <UserCard
            title="In Progress"
            nums={inProgress}
            icon={<ThunderboltOutlined />}
            iconColor="text-purple-500"
          />

          <UserCard
            title="Completed"
            nums={completed}
            icon={<ThunderboltOutlined />}
            iconColor="text-green-500"
          />

          <UserCard
            title="To Do"
            nums={todo}
            icon={<ThunderboltOutlined />}
            iconColor="text-yellow-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Dropdown
            menu={{
              items: statusItems,
              onClick: handleStatusChange,
            }}
          >
            <Button>
              {selectedStatus}
              <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown
            menu={{
              items: priorityItems,
              onClick: handlePriorityChange,
            }}
          >
            <Button>
              {selectedPriority}
              <DownOutlined />
            </Button>
          </Dropdown>

          <Dropdown
            menu={{
              items: sortItems,
              onClick: handleSortingChange,
            }}
          >
            <Button>
              {selectedSorting}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        <Spin spinning={isLoading}>
          <div className="w-full overflow-x-auto">
            <Table
              bordered
              columns={columns}
              dataSource={tasks}
              rowKey={(record) => record._id || record.id}
              scroll={{ x: 900 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: false,
                onChange: handlePageChange,
              }}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default TaskPage;
