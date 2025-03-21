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

  useEffect(() => {
    // Establish a WebSocket connection to the server
    const socket = new WebSocket("ws://localhost:4000");

    // Listen for incoming messages (real-time transaction updates)
    socket.onmessage = (event) => {
      const transaction = JSON.parse(event.data); // Parse incoming transaction data

      if (
        transaction.sender === walletData.id ||
        transaction.receiver === walletData.id
      ) {
        // Update the pending transactions list with the new transaction data
        setPendingTransfers((prev) => {
          const index = prev.findIndex((tx) => tx.id === transaction.id);

          // If the transaction is new, add it to the list
          if (index === -1) {
            return [transaction, ...prev];
          } else {
            const updatedTransfers = [...prev];
            updatedTransfers[index] = transaction;
            return updatedTransfers;
          }
        });
      }

      if (transaction.variant === "RESPONDS_TO_TRANSFER") {
        // Notify the receiver only if the sender cancels the transaction
        if (
          transaction.receiver === walletData.id &&
          transaction.status === "Cancelled"
        ) {
          toast(<ToastComponent transaction={transaction} />);
        }

        // Notify the sender if the receiver accepts or declines the transfer
        if (
          transaction.sender === walletData.id &&
          (transaction.status === "Accepted" ||
            transaction.status === "Declined")
        ) {
          toast(<ToastComponent transaction={transaction} />);
        }
      }

      // Trigger a refresh of the user data to reflect any changes in the wallet balance
      setRefreshUser((prev) => !prev);
    };

    // Cleanup function: Close WebSocket connection when the component unmounts
    return () => socket.close();
  }, [walletData]);

  const fetchUser = useCallback(async () => {
    const ewallet = localStorage.getItem("ewallet"); // Retrieve the stored wallet ID from localStorage

    if (!ewallet) return; // If no wallet ID is found, exit the function early

    try {
      // Make a GET request to fetch wallet details using the stored ID
      const response = await axios.get(
        `http://localhost:4000/api/wallet/get/${ewallet}`
      );

      // Update the state with the fetched wallet data
      setWalletData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, refreshUser]);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-4">Real Time Wallet App</h1>
      {walletData ? (
        <>
          <WalletInfo walletData={walletData} />
          <TransferForm walletData={walletData} />
          <TransactionList
            pendingTransfers={pendingTransfers}
            walletData={walletData}
            setPendingTransfers={setPendingTransfers}
          />
        </>
      ) : (
        <>
          <CreateWalletForm fetchUser={fetchUser} />
        </>
      )}
      <ToastContainer />
    </div>
  );
}
