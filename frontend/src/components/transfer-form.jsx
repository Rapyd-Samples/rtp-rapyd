import axios from "axios";
import { useState } from "react";

const TransferForm = ({ walletData }) => {
  // States to manage transfer amount and recipient's wallet ID
  const [amount, setAmount] = useState("");
  const [receiverWallet, setReceiverWallet] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to handle fund transfer
  const transferFunds = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission
    setLoading(true);

    try {
      // Send a POST request to initiate the transfer
      await axios.post("http://localhost:4000/api/wallet/transfer", {
        senderWalletId: walletData.id, // Sender's wallet ID from props
        receiverWalletId: receiverWallet, // Recipient's wallet ID from state
        amount: Number(amount), // Ensure the amount is sent as a number
      });
    } catch (error) {
      console.error("Failed to transfer funds:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-md max-w-[500px]">
      <p className="font-semibold text-xl">Transfer Funds (SGD)</p>

      {/* Transfer Form */}
      <form onSubmit={transferFunds} className="my-2 grid grid-cols-4 gap-4">
        <input
          type="number"
          placeholder="Amount"
          required
          className="p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Receiver Wallet ID"
          className="p-2 border rounded col-span-2"
          value={receiverWallet}
          onChange={(e) => setReceiverWallet(e.target.value)}
        />
        <button
          disabled={loading}
          type="submit"
          className={`px-4 py-2 text-white rounded ${
            loading ? "bg-green-200" : "bg-green-500"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};
export default TransferForm;
