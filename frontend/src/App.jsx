import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Index from './pages/base/Index'
import Login  from "./pages/auth/Login"
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
      <Route path="/" element={<Index/>}/>

      <Route path="/login" element={
        <OpenRoute>
        <Login/>
        </OpenRoute>
}/>
      <Route path='/signup' element={
        <OpenRoute> <Signup/></OpenRoute>
      }/>
       <Route path='/dashboard' element={<Overview/>}/>
       <Route path="/dashboard/transfers/new" element={<Transfer/>}/>
       <Route path="/dashboard/kyc" element={<KYC/>}/>
       <Route path="/dashboard/fund" element={<FundWallet/>}/>
       <Route path="/dashboard/transactions" element={<TransactionsList />}/>
       <Route path="/dashboard/transaction/:reference" element={<TransactionDetail/>}/>
       {/* <Route path="/dashboard/transfers" element={<Transfers/>}/> */}
       <Route path="/dashboard/beneficiaries" element={<Beneficiaries/>}/>
        <Route path="/dashboard/notifications" element={<Notifications/>}/>
        <Route path="/dashboard/savings/new" element={<SavingsGoalNew/>}/>
        <Route path="/dashboard/savings/" element={<SavingsGoalsList/>}/>
        <Route path="/dashboard/savings/:uuid" element={<SavingsGoalDetail/>}/>

    </Routes>
   </div>
  )
}

export default App
