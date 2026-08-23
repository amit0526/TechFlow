import { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@techflow.com",
    role: "Administrator",
    phone: "",
    bio: "TechFlow system administrator.",
  });

  const [saved, setSaved] = useState(false);

  const updateProfile = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("techflowProfile", JSON.stringify(profile));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Admin Profile
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your administrator profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Profile Card */}
        <div className="h-fit rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-400/10 text-2xl font-bold text-cyan-400 ring-1 ring-cyan-400/20">
              {initials || "AD"}
            </div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              {profile.name || "Admin"}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {profile.email}
            </p>

            <span className="mt-4 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-400">
              {profile.role}
            </span>
          </div>

          {/* Status */}
          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Account Status</span>

              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">Role</span>

              <span className="text-sm text-white">{profile.role}</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-xl font-semibold text-white">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the information associated with your admin account.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="profile-phone"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Phone Number
              </label>

              <input
                id="profile-phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="profile-role"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Role
              </label>

              <select
                id="profile-role"
                value={profile.role}
                onChange={(e) => updateProfile("role", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              >
                <option>Administrator</option>
                <option>Manager</option>
                <option>Editor</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Bio
              </label>

              <textarea
                id="profile-bio"
                rows="4"
                value={profile.bio}
                onChange={(e) => updateProfile("bio", e.target.value)}
                placeholder="Write something about yourself..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
            </div>

            {/* Save */}
            <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-end">
              {saved && (
                <p className="text-sm text-emerald-400">
                  ✓ Profile saved successfully.
                </p>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
