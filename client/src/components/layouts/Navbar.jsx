import {
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = ({
  isSidebarCollapsed,
  toggleSidebar,
  toggleMobileSidebar,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("title") || "",
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/tasks");
      return;
    }

    navigate(
      `/tasks?title=${encodeURIComponent(value)}&page=1`,
    );
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2 mb-2 w-full">
        <div className="flex items-center gap-5 min-w-0">
          <button
            type="button"
            className="shrink-0 cursor-pointer px-4 py-3 rounded-full bg-gray-100 hover:bg-blue-100"
            onClick={() => {
              if (window.innerWidth < 768) {
                toggleMobileSidebar();
              } else {
                toggleSidebar();
              }
            }}
          >
            <MenuOutlined />
          </button>

          <form
            onSubmit={handleSubmit}
            className="relative flex-1 max-w-55 sm:max-w-none"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
            />

            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchOutlined className="text-gray-500" />
            </div>
          </form>
        </div>

        <div className="flex mr-5">
          <BellOutlined />
        </div>
      </div>

      <div className="w-full border-t border-gray-300" />
    </>
  );
};

export default Navbar;