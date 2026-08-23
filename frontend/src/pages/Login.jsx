import { useState } from "react";
import { loginAdmin } from "../services/authService";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      // Backend login + JWT save
      await loginAdmin(trimmedEmail, password);

      // Login successful
      onLogin?.();
    } catch (error) {
      console.error("Login failed:", error);

      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl text-cyan-400">
            🚀
          </div>

          <h1 className="mt-4 text-2xl font-bold">TechFlow</h1>

          <p className="mt-1 text-sm text-slate-500">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Authentication
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">Welcome back</h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your TechFlow admin panel.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="admin@techflow.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 pr-20 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 transition hover:text-white disabled:opacity-40"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium text-slate-400">
              Demo credentials
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Email: <span className="text-slate-300">admin@techflow.com</span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Password: <span className="text-slate-300">admin123</span>
            </p>

            <p className="mt-3 text-[11px] text-slate-600">
              Login is verified securely by the TechFlow backend.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          TechFlow v1.0.0
        </p>
      </div>
    </div>
  );
}

export default Login;
