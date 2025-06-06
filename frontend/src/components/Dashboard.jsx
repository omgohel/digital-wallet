import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, TrendingUp, User, Eye, LogOut } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast"; // Import toast

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    setLoading,
    loading,
    setError,
    setSuccess,
    error,
    success,
    clearMessages,
  } = useWallet();

  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    type: "Credit",
    description: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Show toast when error or success changes
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#e53e3e",
        },
      });
    }

    if (success) {
      toast.success(success, {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#38a169",
        },
      });
    }

    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, clearMessages]);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      const userData = await api.getUser(user.id);
      setUser((prev) => ({ ...prev, ...userData }));
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!transactionForm.amount || parseFloat(transactionForm.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.createTransaction({
        userId: user.id,
        amount: parseFloat(transactionForm.amount),
        type: transactionForm.type,
        description: transactionForm.description,
      });

      await fetchUserData();
      setTransactionForm({ amount: "", type: "Credit", description: "" });
      setSuccess(`${transactionForm.type} transaction added successfully!`);
    } catch (err) {
      setError(err.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      {/* Toast Container */}
      <Toaster />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Wallet Dashboard
          </h1>
          <button
            onClick={() => {
              setUser(null);
              navigate("/");
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <p className="text-white/80">Account Holder</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-white/80 mb-2">Current Balance</p>
              <p className="text-5xl font-bold">
                {formatCurrency(user.balance || 0)}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/transactions")}
                className="w-full flex items-center space-x-3 p-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105"
              >
                <Eye size={20} />
                <span>View Transactions</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center space-x-3 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
              >
                <TrendingUp size={20} />
                <span>Refresh Balance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Plus
              className="mr-3 p-2 bg-indigo-100 rounded-full text-indigo-600"
              size={32}
            />
            Add New Transaction
          </h3>

          <form onSubmit={handleAddTransaction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        amount: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-4 bg-white/60 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Transaction Type
                </label>
                <select
                  value={transactionForm.type}
                  onChange={(e) =>
                    setTransactionForm({
                      ...transactionForm,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-4 bg-white/60 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200"
                >
                  <option value="Credit">Credit (+)</option>
                  <option value="Debit">Debit (-)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <input
                type="text"
                value={transactionForm.description}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-4 bg-white/60 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200"
                placeholder="Transaction description (optional)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Processing..." : "Add Transaction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
