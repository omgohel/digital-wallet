import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast"; // Import toast

const InitializeWallet = () => {
  const navigate = useNavigate();
  const { setUser, setLoading, loading, setError, setSuccess, error } =
    useWallet();
  const [formData, setFormData] = useState({ name: "", balance: "" });

  // Show toast when error changes
  React.useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
      });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = await api.createUser({
        name: formData.name,
        balance: parseFloat(formData.balance) || 0,
      });

      setUser(userData);
      toast.success("Wallet initialized successfully!", {
        duration: 1500,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        },
      });
      setSuccess("Wallet initialized successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      {/* Toast Container */}
      <Toaster />

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Wallet className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-white/80">Initialize your digital wallet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/90 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-white/50 focus:outline-none transition-all duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 font-medium mb-2">
              Initial Balance (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-white/50 focus:outline-none transition-all duration-200"
              placeholder="0.00"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30"
          >
            {loading ? "Creating Wallet..." : "Initialize Wallet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitializeWallet;
