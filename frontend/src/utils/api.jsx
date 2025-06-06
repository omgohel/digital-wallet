const API_BASE_URL = "https://localhost:7052/api";

export const api = {
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/User`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  },

  getUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/User/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },

  createTransaction: async (transactionData) => {
    const response = await fetch(`${API_BASE_URL}/Transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create transaction");
    }

    return response.json();
  },

  getUserTransactions: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/Transaction/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return response.json();
  },
};
