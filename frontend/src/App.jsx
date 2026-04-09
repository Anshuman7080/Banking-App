
import './App.css'
import { Route, Routes } from 'react-router-dom'

import Index from './pages/base/Index'
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

import Overview from "./pages/dashboard/Overview"
import Transfer from "./pages/dashboard/transfer/TransferNew"
import Transfers from "./pages/dashboard/transfer/Transfers"
import KYC from "./pages/dashboard/kyc/KYC"
import FundWallet from "./pages/dashboard/wallet/FundWallet"

import TransactionsList from "./pages/transactions/TransactionsList"
import TransactionDetail from "./pages/transactions/TransactionsDetail"

import Beneficiaries from "./pages/dashboard/beneficiaries/Beneficiaries"
import Notifications from "./pages/dashboard/notification/Notifications"

import SavingsGoalNew from "./pages/dashboard/savings/SavingsGoalNew"
import SavingsGoalsList from "./pages/dashboard/savings/SavingGoalList"
import SavingsGoalDetail from "./pages/dashboard/savings/SavingsGoalDetail"

import OpenRoute from './components/openRoutes'
import PrivateRoute from './components/privateRoutes'

function App() {
  return (
    <div>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Index />} />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/transfers/new"
          element={
            <PrivateRoute>
              <Transfer />
            </PrivateRoute>
          }
        />

        {/* Uncomment if needed */}
        {/* 
        <Route
          path="/dashboard/transfers"
          element={
            <PrivateRoute>
              <Transfers />
            </PrivateRoute>
          }
        />
        */}

        <Route
          path="/dashboard/kyc"
          element={
            <PrivateRoute>
              <KYC />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/fund"
          element={
            <PrivateRoute>
              <FundWallet />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/transactions"
          element={
            <PrivateRoute>
              <TransactionsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/transaction/:reference"
          element={
            <PrivateRoute>
              <TransactionDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/beneficiaries"
          element={
            <PrivateRoute>
              <Beneficiaries />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/savings/new"
          element={
            <PrivateRoute>
              <SavingsGoalNew />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/savings"
          element={
            <PrivateRoute>
              <SavingsGoalsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/savings/:uuid"
          element={
            <PrivateRoute>
              <SavingsGoalDetail />
            </PrivateRoute>
          }
        />

      </Routes>
    </div>
  )
}

export default App

