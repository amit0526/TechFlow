import { useEffect, useMemo, useState } from "react";


const DEFAULT_PROFILE = {
  name: "Admin",
  email: "admin@techflow.com",
  role: "Administrator",
  phone: "",
  bio: "TechFlow system administrator.",
};

function Profile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [savedProfile, setSavedProfile] = useState(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // Load Profile
  // =========================

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("techflowProfile");

      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);

        const mergedProfile = {
          ...DEFAULT_PROFILE,
          ...parsedProfile,
        };

        setProfile(mergedProfile);
        setSavedProfile(mergedProfile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // =========================
  // Check Changes
  // =========================

  const hasChanges = useMemo(
    () => JSON.stringify(profile) !== JSON.stringify(savedProfile),
    [profile, savedProfile],
  );

  // =========================
  // Update Profile
  // =========================

  const updateProfile = (key, value) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage("");
  };

  // =========================
  // Save Profile
  // =========================

  const handleSave = () => {
    const trimmedName = profile.name.trim();
    const trimmedEmail = profile.email.trim();

    if (!trimmedName || !trimmedEmail) {
      setMessage("Name and email are required.");
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = {
        ...profile,
        name: trimmedName,
        email: trimmedEmail,
        phone: profile.phone.trim(),
        bio: profile.bio.trim(),
      };

      localStorage.setItem("techflowProfile", JSON.stringify(updatedProfile));

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setMessage("Profile saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Discard Changes
  // =========================

  const discardChanges = () => {
    setProfile(savedProfile);
    setMessage("");
  };

  // =========================
  // Initials
  // =========================

  const initials =
    profile.name
      ?.trim()
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  // =========================
  // Loading
  // =========================

  if (!loaded) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
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
              {initials}
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
                onChange={(event) => updateProfile("name", event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                onChange={(event) => updateProfile("email", event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                onChange={(event) => updateProfile("phone", event.target.value)}
                placeholder="Enter phone number"
                autoComplete="tel"
                disabled={saving}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
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

              <input
                id="profile-role"
                type="text"
                value={profile.role}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-500 outline-none"
              />

              <p className="mt-1.5 text-xs text-slate-600">
                Your administrator role cannot be changed from this page.
              </p>
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
                onChange={(event) => updateProfile("bio", event.target.value)}
                placeholder="Write something about yourself..."
                disabled={saving}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Actions */}

            <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-end">
              {message && (
                <p
                  className={`mr-auto text-sm ${
                    message.includes("required") || message.includes("Failed")
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {message.includes("successfully") ? "✓ " : ""}
                  {message}
                </p>
              )}

              <button
                type="button"
                onClick={discardChanges}
                disabled={!hasChanges || saving}
                className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
