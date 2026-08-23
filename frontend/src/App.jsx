import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
              <div className="text-center">
                <p className="text-6xl font-bold text-cyan-400">404</p>

                <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>

                <p className="mt-2 text-sm text-slate-500">
                  The page you're looking for doesn't exist.
                </p>

                <a
                  href="/"
                  className="mt-6 inline-flex rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
