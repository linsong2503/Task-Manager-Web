import { Link } from "react-router-dom";
import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";

const priorityBg = {
  high: "bg-red-500 ",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const OverViewCard = ({ data = [] }) => {
  return (
    <div className="border mt-5 rounded-md bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-3">
        <p>Task Overview</p>

        <Link to="/tasks">
          <div className="flex gap-2 items-center">
            <p>View all</p>
            <ArrowRightOutlined />
          </div>
        </Link>
      </div>

      {/* Cards */}
      {data.length === 0 ? (
        <div className="border-t min-h-85 flex items-center justify-center">
          <p className="text-gray-400">No data</p>
        </div>
      ) : (
        data.map((d) => (
          <Link to={"/"}>
            <div key={d._id} className="border-t">
              <div className="p-4">
                <div className="flex justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-black font-semibold text-sm line-clamp-2">
                      {d.title}
                    </h1>

                    <p className="text-sm mt-2 line-clamp-2">{d.content}</p>

                    <div className="flex gap-2 mt-3 items-center">
                      <CalendarOutlined />
                      <p className="text-xs">
                        {new Date(d.dueDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div
                    className={`shrink-0 self-start text-xs px-2 py-0.5 rounded ${
                      priorityBg[d.priority]
                    } text-white`}
                  >
                    {d.priority}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default OverViewCard;
