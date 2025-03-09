import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import WalletInfo from "./components/wallet-info";
import TransferForm from "./components/transfer-form";
import TransactionList from "./components/transaction-list";
import CreateWalletForm from "./components/create-wallet-form";
import axios from "axios";
import ToastComponent from "./components/toast";

export default function App() {
  const [walletData, setWalletData] = useState(null);
  const [refreshUser, setRefreshUser] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState([]);

  { /* Add Websocket connection HERE */ }

  { /* Add fetchUser function HERE */ }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-4">Real Time Wallet App</h1>
      {walletData ? (
        <>
          <WalletInfo walletData={walletData} />
          {/* Transfer Form HERE */}
          {/* Transaction List HERE */}
        </>
      ) : (
        <>
          {/* Create Wallet Form HERE */}
        </>
      )}
      <ToastContainer />
    </div>
  );
}
