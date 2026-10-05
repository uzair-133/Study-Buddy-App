import { useState, useContext, useEffect } from "react";
import api from "../../../api/axios";
import { UserContext } from "../../../Context/UserContext";

const ProfileAccount = () => {
  const { user, setUser, loading, fetchUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setImgError(false);
  }, [user?.profileImage]);

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
  const displayImage = preview || user?.profileImage;

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      e.target.value = "";
      return;
    }

    // Instant local preview
    const localPreviewUrl = URL.createObjectURL(selectedFile);
    setPreview(localPreviewUrl);
    setImgError(false);

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.patch("/api/user/profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.user) {
        setUser(res.data.user);
      } else if (fetchUser) {
        await fetchUser(false);
      }

      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setPreview(null);
      setError(
        err.response?.data?.message || "Failed to upload profile picture. Please try again.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-4 text-center h-full">
      {displayImage && !imgError ? (
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-violet/30 shadow-md">
          <img
            key={displayImage}
            className="w-full h-full object-cover"
            src={displayImage}
            alt="Profile"
            onError={() => {
              if (!preview) setImgError(true);
            }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-ink/40 flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
              Uploading...
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-violet text-white font-bold font-display text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-md">
          {avatarInitial}
          {uploading && (
            <div className="absolute inset-0 bg-ink/40 rounded-full flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
              Uploading...
            </div>
          )}
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-sans font-bold text-ink">
          {user.name}
        </h2>
        <p className="text-violet font-sans font-semibold text-[11px] px-3 py-1 rounded-full bg-violet/10 inline-block capitalize">
          {user.role}
        </p>
        <p className="text-ink-soft font-sans text-xs sm:text-sm">{user.email}</p>
      </div>

      {error && (
        <p className="text-red-500 font-sans text-xs bg-red-50 p-2.5 rounded-xl border border-red-200 w-full max-w-xs">
          {error}
        </p>
      )}

      {success && (
        <p className="text-emerald-600 font-sans text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 w-full max-w-xs">
          {success}
        </p>
      )}

      <form className="pt-2 w-full flex justify-center">
        <label
          className={`text-violet border-[1.5px] border-violet px-6 py-2 rounded-full font-semibold font-display text-xs sm:text-sm hover:bg-violet hover:text-white transition-all cursor-pointer inline-block text-center ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
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
          disabled={uploading}
        />
      </form>
    </section>
  );
};

export default ProfileAccount;
