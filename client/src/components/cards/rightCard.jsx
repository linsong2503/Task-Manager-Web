import {
  FieldTimeOutlined,
  WarningOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const priorityBg = {
  high: "bg-red-500 ",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const RightCard = ({ progressData = [], todoData = [], in_progress, todo }) => {
  return (
    <div className="mt-5 flex flex-col gap-2">
      {/* Inprogress */}
      <div className="border rounded-md bg-white">
        <Link to={"/tasks?status=doing"}>
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <div className="flex gap-2">
              <FieldTimeOutlined />
              <p>In Progress</p>
            </div>
            <div className="bg-purple-100 px-2 py-1 rounded-lg text-purple-500 font-semibold">
              {in_progress}
            </div>
          </div>
        </Link>
        {/* CARDS */}
        {progressData.length === 0 ? (
          <div className="border-t min-h-35 flex items-center justify-center">
            <p className="text-gray-400">No data</p>
          </div>
        ) : (
          progressData.map((data) => (
            <div className="p-2">
              <div className="px-2 ">
                <Link to={""}>
                  <div className=" bg-gray-100 rounded-md p-2">
                    <div className="" key={data._id}>
                      <h1 className="text-black font-semibold text-sm">
                        {data.title}
                      </h1>
                      <p
                        className={`shrink-0 self-start text-xs px-2 py-0.5 w-fit mt-2 rounded ${
                          priorityBg[data.priority]
                        } text-white`}
                      >
                        {data.priority}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Overdue */}
      <div className="border rounded-md bg-white">
        <Link to={"/tasks?status=todo"}>
          <div className="flex justify-between items-center px-3 py-2 border-b">
            <div className="flex gap-2">
              <WarningOutlined />
              <p>To do</p>
            </div>
            <div className="bg-yellow-100 px-2 py-1 rounded-lg text-yellow-500 font-semibold">
              {todo}
            </div>
          </div>
        </Link>
        {/* CARDS */}
        {todoData.length === 0 ? (
          <div className="border-t min-h-35 flex items-center justify-center">
            <p className="text-gray-400">No data</p>
          </div>
        ) : (
          todoData.map((data) => (
            <div className="p-2">
              <div className="px-2">
                <Link to={""}>
                  <div className="flex justify-between bg-gray-100 rounded-md p-2">
                    <div className="" key={data._id}>
                      <h1 className="text-black font-semibold text-sm">
                        {data.title}
                      </h1>
                      <p
                        className={`shrink-0 text-xs w-fit px-2 py-0.5 rounded mt-2  ${
                          priorityBg[data.priority]
                        } text-white`}
                      >
                        {data.priority}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RightCard;
