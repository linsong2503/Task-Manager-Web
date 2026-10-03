import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Loader from "./components/loading/Loader.jsx";
import BaseLayout from "./layouts/baseLayout.jsx";
import useAuth from "./contexts/authContext.jsx";
import { routes, staticPath } from "./routes/routeConfig.jsx";

const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading || isAuthenticated === undefined) {
    return <Loader />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path={staticPath.login} element={<Login />} />
          <Route path={staticPath.register} element={<Register />} />

          <Route
            path="*"
            element={<Navigate to={staticPath.login} replace />}
          />
        </Routes>
      </Suspense>
    );
  }

  // Authenticated
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Base Layout */}
        <Route element={<BaseLayout />}>
          {routes
            .filter((route) => route.private)
            .map((route) => {
              const Component = route.component;

              return (
                <Route
                  key={route.key}
                  path={route.path}
                  element={<Component />}
                />
              );
            })}
        </Route>

        <Route
          path="*"
          element={<Navigate to={staticPath.dashboard} replace />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;