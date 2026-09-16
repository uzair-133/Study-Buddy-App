import { useState, useContext } from "react";
import api from "../../../api/axios";
import { UserContext } from "../../../Context/UserContext";

const ProfileAccount = () => {
  const { user, loading, fetchUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  if (loading) {
    return (
      <div className="p-5 text-gray-500 font-sans bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 text-gray-500 font-sans bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
        Unable to load profile.
      </div>
    );
  }

  const avatarInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    setUploading(true);
    setError("");

    try {
      await api.patch("/api/user/profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchUser();
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError(
        err.response?.data?.message || "Failed to upload profile picture.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-4 text-center h-full">
      {user.profileImage ? (
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-violet/20 shadow-md">
          <img
            className="w-full h-full object-cover"
            src={user.profileImage}
            alt="Profile"
          />
        </div>
      ) : (
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-violet text-white font-bold font-display text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-md">
          {avatarInitial}
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-sans font-bold text-ink">
          {user.name}
        </h2>
        <p className="text-violet font-sans font-semibold text-[11px] px-3 py-1 rounded-full bg-violet/10 inline-block">
          {user.role}
        </p>
        <p className="text-ink-soft font-sans text-xs sm:text-sm">{user.email}</p>
      </div>

      {error && (
        <p className="text-red-500 font-sans text-xs bg-red-50 p-2 rounded-xl border border-red-200 w-full max-w-xs">
          {error}
        </p>
      )}

      <form className="pt-2 w-full flex justify-center">
        <label
          className="text-violet border-[1.5px] border-violet px-6 py-2 rounded-full font-semibold font-display text-xs sm:text-sm hover:bg-violet hover:text-white transition-all cursor-pointer inline-block text-center disabled:opacity-50"
          htmlFor="fileUpload"
        >
          {uploading ? "Uploading..." : "Change Photo"}
        </label>
        <input
          type="file"
          className="hidden"
          id="fileUpload"
          onChange={handleChange}
          accept="image/*"
        />
      </form>
    </section>
  );
};

export default ProfileAccount;
