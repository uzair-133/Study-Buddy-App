import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../Context/UserContext";
import api from "../../../api/axios";

const UpdateDetail = () => {
  const { user, setUser, fetchUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await api.put(
        "/api/user/update",
        { name },
        {
          withCredentials: true,
        },
      );

      setMessage(res.data.message || "Name updated successfully");
      if (res.data.user) {
        setUser(res.data.user);
      } else if (fetchUser) {
        await fetchUser();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h2 className="text-ink font-semibold font-display text-lg">
          Profile Information
        </h2>
        <p className="text-ink-soft font-sans text-xs sm:text-sm mt-1">
          Update your personal details.
        </p>

        {error && (
          <div className="mt-3 text-red-500 font-sans text-xs bg-red-50 p-2.5 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-3 text-emerald-600 font-sans text-xs bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="font-semibold font-sans text-ink text-sm block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              placeholder="Enter your full name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-sm rounded-xl bg-violet text-white font-sans font-semibold hover:bg-violet/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateDetail;
