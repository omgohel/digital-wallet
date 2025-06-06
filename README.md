# Digital Wallet 💳

A full-stack application for managing personal finances with a beautiful UI, transaction tracking, and balance management.

## 📋 Features

- **User Authentication** - Create and manage your wallet profile
- **Dashboard Overview** - View your current balance and quick actions
- **Transaction Management** - Add credit and debit transactions
- **Transaction History** - View, search, sort, and export transaction history
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Balance Updates** - Automatic balance calculation based on transactions
- **CSV Export** - Export transaction history for external analysis
- **Search & Filter** - Advanced filtering options for transaction management

## 🚀 Tech Stack

### Frontend
- **React** - UI library for building the user interface
- **Vite** - Next-generation frontend tooling for fast development
- **React Router** - Client-side routing for navigation
- **Tailwind CSS** - Utility-first CSS framework for responsive styling
- **Lucide React** - Beautiful and consistent icon library
- **React Hot Toast** - Elegant toast notifications

### Backend
- **.NET 6** - Modern backend framework
- **Entity Framework Core** - Object-relational mapping (ORM)
- **SQL Server** - Robust database for data persistence
- **RESTful API** - Standard API architecture for frontend-backend communication
- **CORS** - Cross-origin resource sharing configuration

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **.NET 6 SDK**
- **SQL Server** or **SQL Server Express**
- **Git** for version control

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omgohel/digital-wallet.git
   cd digital-wallet/backend
   ```

2. **Configure database connection:**
   - Open `appsettings.json`
   - Update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=WalletDB;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Install dependencies and apply migrations:**
   ```bash
   dotnet restore
   dotnet ef database update
   ```

4. **Run the backend server:**
   ```bash
   dotnet run
   ```
   - API will be available at `https://localhost:7123`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create `.env` file in the frontend directory:
   ```env
   VITE_API_URL=https://localhost:7123/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   - Application will be available at `http://localhost:5173`

## 🔧 Usage Guide

### Getting Started
1. **Initialize Your Wallet**
   - Open the application in your browser
   - Enter your name and optional initial balance
   - Click "Initialize Wallet" to create your profile

2. **Dashboard Navigation**
   - View current balance at a glance
   - Access quick action buttons for common tasks
   - Navigate between different sections

### Transaction Management
1. **Add New Transactions**
   - Click "Add Transaction" button
   - Select transaction type (Credit/Debit)
   - Enter amount and description
   - Submit to update balance automatically

2. **View Transaction History**
   - Navigate to "Transaction History" page
   - Search transactions by description or type
   - Sort by date, amount, or transaction type
   - Export filtered results to CSV format

### Advanced Features
- **Search Functionality** - Find specific transactions quickly
- **Date Range Filtering** - Filter transactions by custom date ranges
- **Balance Tracking** - Real-time balance updates with transaction history
- **Data Export** - Download transaction data for external analysis

## 🔒 API Documentation

### User Endpoints
- `POST /api/users` - Create a new user profile
- `GET /api/users/{id}` - Retrieve user details and current balance
- `PUT /api/users/{id}` - Update user information

### Transaction Endpoints
- `POST /api/transactions` - Create a new transaction
- `GET /api/users/{userId}/transactions` - Get all transactions for a specific user
- `GET /api/transactions/{id}` - Get specific transaction details
- `DELETE /api/transactions/{id}` - Delete a transaction

### Response Format
All API responses follow a consistent JSON structure:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

## 🛠️ Development

### Project Structure
```
digital-wallet/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── README.md
```

### Building for Production

**Frontend Build:**
```bash
cd frontend
npm run build
```

**Backend Build:**
```bash
cd backend
dotnet publish -c Release -o ./publish
```

### Development Commands
```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend development
dotnet run           # Start development server
dotnet watch run     # Start with hot reload
dotnet test          # Run unit tests
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Backend Testing
```bash
cd backend
dotnet test          # Run all tests
dotnet test --coverage  # Run tests with coverage
```

## 🚀 Deployment

### Frontend Deployment
- Build the application using `npm run build`
- Deploy the `dist` folder to your preferred hosting service
- Configure environment variables for production API URL

### Backend Deployment
- Publish the application using `dotnet publish`
- Deploy to your preferred cloud service (Azure, AWS, etc.)
- Configure production database connection string
- Set up HTTPS and CORS policies

---

**⭐ If you found this project helpful, please give it a star!**

*Note: This application is designed for personal financial management. Always ensure proper security measures when handling financial data in production environments.*
