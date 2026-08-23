import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================
  // Change Password
  // =========================

  const handleChangePassword = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // Get Current Saved Password
    // =========================

    const savedPassword =
      localStorage.getItem("techflowPassword") || "admin123";

    // =========================
    // Current Password Required
    // =========================

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    // =========================
    // Verify Current Password
    // =========================

    if (currentPassword !== savedPassword) {
      setError("Current password is incorrect.");
      return;
    }

    // =========================
    // New Password Required
    // =========================

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    // =========================
    // Password Length
    // =========================

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    // =========================
    // Confirm Password
    // =========================

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    // =========================
    // Same Password Check
    // =========================

    if (newPassword === currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    // =========================
    // Save
    // =========================

    try {
      setSaving(true);

      localStorage.setItem("techflowPassword", newPassword);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Password changed successfully.");

      // Return to profile
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Failed to change password:", error);

      setError("Failed to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* =========================
          Header
      ========================= */}

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Security
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Change Password
        </h1>

        <p className="mt-2 text-slate-400">
          Update the password used to access your TechFlow admin account.
        </p>
      </div>

      {/* =========================
          Card
      ========================= */}

      <div className="rounded-xl border border-slate-800 bg-slate-900">
        {/* Card Header */}

        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">
            Password Security
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter your current password and choose a new secure password.
          </p>
        </div>

        {/* =========================
            Form
        ========================= */}

        <form onSubmit={handleChangePassword} className="space-y-6 p-6">
          {/* Error */}

          {error && (
            <div
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              role="status"
            >
              ✓ {success}
            </div>
          )}

          {/* Current Password */}

          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={(value) => {
              setCurrentPassword(value);
              setError("");
              setSuccess("");
            }}
            show={showCurrent}
            setShow={setShowCurrent}
            placeholder="Enter current password"
            disabled={saving}
          />

          {/* New Password */}

          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={(value) => {
              setNewPassword(value);
              setError("");
              setSuccess("");
            }}
            show={showNew}
            setShow={setShowNew}
            placeholder="Enter new password"
            disabled={saving}
          />

          {/* Confirm Password */}

          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              setError("");
              setSuccess("");
            }}
            show={showConfirm}
            setShow={setShowConfirm}
            placeholder="Confirm new password"
            disabled={saving}
          />

          {/* =========================
              Requirements
          ========================= */}

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium text-slate-300">
              Password requirements
            </p>

            <ul className="mt-3 space-y-2 text-xs">
              <li
                className={
                  newPassword.length >= 6
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              >
                {newPassword.length >= 6 ? "✓" : "•"} At least 6 characters
              </li>

              <li
                className={
                  newPassword && newPassword === confirmPassword
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              >
                {newPassword && newPassword === confirmPassword ? "✓" : "•"}{" "}
                Passwords must match
              </li>

              <li
                className={
                  newPassword && newPassword !== currentPassword
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              >
                {newPassword && newPassword !== currentPassword ? "✓" : "•"} New
                password must be different
              </li>
            </ul>
          </div>

          {/* =========================
              Actions
          ========================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              disabled={saving}
              className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   Password Field
========================= */

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="current-password"
          disabled={disabled}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 pr-20 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 transition hover:text-white disabled:opacity-40"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
