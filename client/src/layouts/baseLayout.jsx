// import Navbar from "../components/layouts/Navbar";
// import Sidebar from "../components/layouts/Sidebar";
// import { Outlet } from "react-router-dom";
// const BaseLayout = () => {
//   const isSidebarCollapsed = false;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Sidebar />

//       <main
//         className={`min-h-screen transition-all duration-300 ${
//           isSidebarCollapsed ? "md:ml-16" : "md:ml-59"
//         }`}
//       >
//         <Navbar />

//         <div className="p-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BaseLayout;

import { useState } from "react";
import Navbar from "../components/layouts/Navbar.jsx";
import Sidebar from "../components/layouts/Sidebar.jsx";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      <main
        className={`
    min-h-screen
    transition-all
    duration-300
    ${isSidebarCollapsed ? "md:ml-16" : "md:ml-59"}
  `}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        <div className="px-3 py-4 sm:px-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;
