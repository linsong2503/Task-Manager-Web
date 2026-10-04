import NewButton from "../../components/buttons/create.jsx";
import UserCard from "../../components/cards/userCard.jsx";
import OverViewCard from "../../components/cards/overViewCard.jsx";
import RightCard from "../../components/cards/rightCard.jsx";
import { useState, useEffect } from "react";
import * as _api from "../../api/index.js";
import useSettings from "../../contexts/settingsContext.jsx";
import TaskModal from "../../components/modals/taskModal.jsx";
import {
  FolderOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import useAuth from "../../contexts/authContext.jsx";
export default function HomePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [doingTasks, setDoingTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [todo, setTodo] = useState(0);

  const params = {
    limit: 3,
    page: 1,
  };

  const fetchTasks = async (params = {}) => {
    try {
      const res = await _api.taskApi.getTasks(params);

      if (res.code === 1) {
        return res.results?.results || [];
      }

      return [];
    } catch (error) {
      console.log("Error loading tasks:", error);
      return [];
    }
  };

  const fetchDoingTasks = async () => {
    const params = {
      status: "doing",
      limit: 2,
      page: 1,
      sortBy: "dueDate",
      sortOrder: "asc",
    };

    const doingTasks = await fetchTasks(params);

    setDoingTasks(doingTasks);
  };

  const fetchTodoTasks = async () => {
    const params = {
      limit: 2,
      page: 1,
      sortBy: "dueDate",
      sortOrder: "asc",
      status: "todo",
    };

    const todoTasks = await fetchTasks(params);

    setTodoTasks(todoTasks);
  };

  const getCounts = async (status) => {
    try {
      const countParams = {
        limit: 1,
        page: 1,
      };

      if (status) {
        countParams.status = status;
      }

      const res = await _api.taskApi.getTasks(countParams);

      if (res.code === 1) {
        return res.results?.totalResults || 0;
      }

      return 0;
    } catch (error) {
      console.log("Error loading task count:", error);
      return 0;
    }
  };

  const loadCounts = async () => {
    const total = await getCounts();
    const inProgress = await getCounts("doing");
    const completed = await getCounts("completed");
    const todo = await getCounts("todo");

    setTotalTasks(total);
    setInProgress(inProgress);
    setCompleted(completed);
    setTodo(todo);
  };

  const handleCreateSuccess = async () => {
    await loadCounts();
    await fetchTasks(params);
    await fetchDoingTasks();
    await fetchTodoTasks();
  };
  useEffect(() => {
    loadCounts();
    fetchDoingTasks();
    fetchTodoTasks();
  }, []);
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);

        const data = await fetchTasks(params);

        setTasks(data);
      } catch (error) {
        console.log("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-black text-xl sm:text-2xl">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Here's what's happening with your tasks today
          </p>
        </div>

        <div className="shrink-0">
          <NewButton onClick={() => setIsOpen(true)} />

          <TaskModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
      </div>
      {/* Content */}
      <div className="w-full flex flex-col gap-8 mt-5">
        {/* Cards */}
        <div className="flex gap-4 flex-col lg:flex-row ">
          <UserCard
            title="Total Tasks"
            nums={totalTasks}
            icon={<FolderOutlined />}
            bgColor="bg-blue-100"
            iconColor={"text-blue-500"}
          />

          <UserCard
            title="In Progress"
            nums={inProgress}
            icon={<FieldTimeOutlined />}
            bgColor="bg-purple-100"
            iconColor={"text-purple-500"}
          />

          <UserCard
            title="Completed"
            nums={completed}
            icon={<CheckCircleOutlined />}
            bgColor="bg-green-100"
            iconColor={"text-green-500"}
          />

          <UserCard
            title="To Do"
            nums={todo}
            icon={<WarningOutlined />}
            bgColor="bg-yellow-100"
            iconColor={"text-yellow-500"}
          />
        </div>
        <div className="flex w-full flex-col gap-8 lg:flex-row ">
          <div className="w-full lg:w-2/3">
            <OverViewCard data={tasks} />
          </div>
          <div className="w-full lg:w-1/3">
            <RightCard
              progressData={doingTasks}
              todoData={todoTasks}
              in_progress={inProgress}
              todo={todo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
