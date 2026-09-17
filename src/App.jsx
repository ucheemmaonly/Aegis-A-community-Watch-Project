import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Layout from "./layouts/Layout.jsx";

import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Incidents from "./pages/Incidents.jsx";
import IncidentDetail from "./pages/IncidentDetail.jsx";
import ReportIncident from "./pages/ReportIncident.jsx";
import Patrols from "./pages/Patrols.jsx";
import Alerts from "./pages/Alerts.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "home", element: <Home /> },
          { path: "profile", element: <Profile /> },
          { path: "incidents", element: <Incidents /> },
          { path: "incidents/:id", element: <IncidentDetail /> },
          { path: "report", element: <ReportIncident /> },
          { path: "alerts", element: <Alerts /> },
        ],
      },

      {
        element: <ProtectedRoute roles={["patrol_officer", "admin"]} />,
        children: [{ path: "patrols", element: <Patrols /> }],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
