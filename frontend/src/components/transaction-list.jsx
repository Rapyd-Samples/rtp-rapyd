import { useState } from "react";
import TransactionItem from "./transaction-item";

const TransactionList = ({ pendingTransfers, walletData }) => {
  const [loading, setLoading] = useState(false);

  // Function to respond to a transaction (Accept, Decline, or Cancel)
  const respondToTransfer = async (transactionId, action) => {
    setLoading(true);

    try {
      // Send a POST request to the API to respond to the transfer
      await fetch("http://localhost:4000/api/wallet/respond-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: transactionId,
          status: action, // "accept", "decline", or "cancel"
        }),
      });
    } catch (error) {
      console.error("Failed to respond to transfer:", error);
    }

    setLoading(false);
  };

  // If there are no pending transactions, don't render the component
  if (pendingTransfers.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-md max-w-[500px] mt-6">
      {/* Section Title */}
      <h2 className="text-lg font-bold mb-2">Transactions</h2>

      {/* Render each pending transaction using TransactionItem */}
      {pendingTransfers.map((tx) => (
        <TransactionItem
          key={tx.id}
          tx={tx}
          walletData={walletData}
          loading={loading}
          respondToTransfer={respondToTransfer}
        />
      ))}
    </div>
  );
};

export default TransactionList;
