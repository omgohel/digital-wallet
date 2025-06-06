import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Search,
} from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { api } from "../utils/api";
import toast, { Toaster } from "react-hot-toast"; // Import toast

const Transactions = () => {
  const navigate = useNavigate();
  const {
    user,
    transactions,
    setTransactions,
    setLoading,
    loading,
    setError,
    error,
  } = useWallet();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTransactions();
  }, [user, navigate]);

  // Show toast when error changes
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
  }, [error]);

  const fetchTransactions = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await api.getUserTransactions(user.id);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    try {
      const csvContent = [
        ["Date", "Type", "Amount", "Description"],
        ...filteredTransactions.map((t) => [
          formatDate(t.timestamp),
          t.type,
          t.amount,
          t.description || "",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${user.name}_transactions.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast.success("Transactions exported successfully!", {
        duration: 3000,
        position: "bottom-center",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#38a169",
        },
      });
    } catch (err) {
      toast.error("Failed to export transactions", {
        duration: 3000,
        position: "bottom-center",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#e53e3e",
        },
      });
    }
  };

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === "amount") {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      return 0;
    });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Toast Container */}
      <Toaster />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Transaction History
          </h1>

          <div></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* User Info */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-8 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-white/80">
                Current Balance:{" "}
                <span className="text-2xl font-bold">
                  {formatCurrency(user.balance || 0)}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/80">Total Transactions</p>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border border-white/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200"
                  placeholder="Search transactions..."
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Sort by:</span>
              <button
                onClick={() => setSortBy("date")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  sortBy === "date"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Calendar size={16} />
                <span>Date</span>
              </button>
              <button
                onClick={() => setSortBy("amount")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  sortBy === "amount"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <DollarSign size={16} />
                <span>Amount</span>
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No transactions found</p>
              {searchTerm && (
                <p className="text-sm mt-2">Try adjusting your search terms</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100/80 border-b-2 border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-gray-200 hover:bg-white/60 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white/40" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-800 font-medium">
                        {formatDate(transaction.timestamp)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.type.toUpperCase() === "CREDIT"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type.toUpperCase() === "CREDIT" ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          <span>{transaction.type.toUpperCase()}</span>
                        </span>
                      </td>
                      <td
                        className={`py-4 px-6 font-bold text-lg ${
                          transaction.type.toUpperCase() === "CREDIT"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type.toUpperCase() === "CREDIT"
                          ? "+"
                          : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {transaction.description || "No description"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center text-gray-600 bg-white/60 backdrop-blur-sm rounded-xl p-4">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
