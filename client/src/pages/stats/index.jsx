import { useEffect, useMemo, useState } from "react";
import { Card, Empty, Spin, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import * as _api from "../../api/index.js";

const statusLabels = {
  todo: "Todo",
  doing: "In Progress",
  completed: "Completed",
};

const priorityColors = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

const Statistics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const res = await _api.taskApi.getTasks({
        page: 1,
        limit: 1000,
      });

      if (res?.code === 1) {
        setTasks(res.results?.results || []);
      }
    } catch (error) {
      console.log("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const statistics = useMemo(() => {
    const now = new Date();

    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    const doing = tasks.filter((task) => task.status === "doing").length;

    const todo = tasks.filter((task) => task.status === "todo").length;

    const overdue = tasks.filter(
      (task) => task.status !== "completed" && new Date(task.dueDate) < now,
    ).length;

    const high = tasks.filter((task) => task.priority === "high").length;

    const medium = tasks.filter((task) => task.priority === "medium").length;

    const low = tasks.filter((task) => task.priority === "low").length;

    return {
      total: tasks.length,
      completed,
      doing,
      todo,
      overdue,
      high,
      medium,
      low,
    };
  }, [tasks]);

  const statusData = [
    {
      name: "Todo",
      value: statistics.todo,
    },
    {
      name: "In Progress",
      value: statistics.doing,
    },
    {
      name: "Completed",
      value: statistics.completed,
    },
  ];

  const priorityData = [
    {
      name: "High",
      value: statistics.high,
    },
    {
      name: "Medium",
      value: statistics.medium,
    },
    {
      name: "Low",
      value: statistics.low,
    },
  ];

  const completionData = useMemo(() => {
    const grouped = {};

    tasks
      .filter((task) => task.status === "completed")
      .forEach((task) => {
        const date = new Date(task.updatedAt);

        const key = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });

        grouped[key] = (grouped[key] || 0) + 1;
      });

    return Object.entries(grouped).map(([date, completed]) => ({
      date,
      completed,
    }));
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();

    return [...tasks]
      .filter(
        (task) => task.status !== "completed" && new Date(task.dueDate) >= now,
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  const todoTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.status === "todo")
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  const statCards = [
    {
      title: "Total Tasks",
      value: statistics.total,
      icon: <FolderOutlined />,
      iconClass: "bg-blue-100 text-blue-500",
    },
    {
      title: "Completed",
      value: statistics.completed,
      icon: <CheckCircleOutlined />,
      iconClass: "bg-green-100 text-green-500",
    },
    {
      title: "In Progress",
      value: statistics.doing,
      icon: <ClockCircleOutlined />,
      iconClass: "bg-yellow-100 text-yellow-500",
    },
    {
      title: "Todo",
      value: statistics.todo,
      icon: <ExclamationCircleOutlined />,
      iconClass: "bg-gray-100 text-gray-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-0 pb-1 md:px-5 py-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Statistics</h1>

        <p className="text-gray-500 mt-1">
          Track your task progress and productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} bordered>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>

                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {card.value}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.iconClass}`}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Card title="Task Status">
          {tasks.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <Empty description="No tasks" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={3}
                  >
                    <Cell fill="#94a3b8" />
                    <Cell fill="#eab308" />
                    <Cell fill="#22c55e" />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Priority Distribution">
          {tasks.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <Empty description="No tasks" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={3}
                  >
                    <Cell fill={priorityColors.high} />
                    <Cell fill={priorityColors.medium} />
                    <Cell fill={priorityColors.low} />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card title="Completed Tasks Over Time" className="mt-5">
        {completionData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <Empty description="No completed tasks yet" />
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <Card title="Upcoming Tasks">
          {upcomingTasks.length === 0 ? (
            <Empty description="No upcoming tasks" />
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="border rounded-lg p-3 flex justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {task.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Due {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <Tag
                    color={
                      task.priority === "high"
                        ? "red"
                        : task.priority === "medium"
                          ? "gold"
                          : "green"
                    }
                  >
                    {task.priority}
                  </Tag>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Todo Tasks">
          {todoTasks.length === 0 ? (
            <Empty description="No todo tasks" />
          ) : (
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-gray-200 rounded-lg p-3 flex justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {task.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Due {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  <Tag color="default">Todo</Tag>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
