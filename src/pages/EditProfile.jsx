import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, User, Loader2 } from "lucide-react";

export default function EditProfile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");

    setLoading(true);
    try {
      const res = await axiosClient.patch("auth/updateprofile", {
        fullName: name,
      });

      setUser(res.data.user);
      toast.success("Profile updated successfully! 🎉");
      navigate("/profile?tab=settings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <div className="w-10"></div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-[#C5A059] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={loading}
            className="w-full bg-[#C5A059] hover:bg-[#b38f4d] disabled:opacity-70 text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#C5A059]/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Changes will be reflected across your entire account.
          </p>
        </div>
      </div>
    </div>
  );
}
