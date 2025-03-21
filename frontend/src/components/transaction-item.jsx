const TransactionItem = ({ tx, walletData, loading, respondToTransfer }) => {
  // If the user is the receiver of the transaction
  if (walletData.id === tx.receiver) {
    return (
      <div className="border-[#eee] border rounded-md p-2 px-4 my-2">
        <p>
          <span className="text-gray-400">{tx.sender}</span> wants to send
          <span className="font-bold text-blue-400">
            {" "}
            +{tx.amount} {tx.currency}
          </span>{" "}
          to you
        </p>

        {/* If the transaction is pending and it's a fund transfer, show action buttons */}
        {tx.status === "pending" && tx.variant === "TRANSFER_FUNDS" ? (
          <div className="flex gap-2 mt-2">
            {/* Accept transfer button */}
            <button
              onClick={() => respondToTransfer(tx.id, "accept")}
              disabled={loading}
              className={`px-3 py-1 ${
                loading ? "bg-green-200" : "bg-green-500"
              } text-white rounded`}
            >
              Accept
            </button>

            {/* Decline transfer button */}
            <button
              onClick={() => respondToTransfer(tx.id, "decline")}
              disabled={loading}
              className={`px-3 py-1 ${
                loading ? "bg-red-200" : "bg-red-500"
              } text-white rounded`}
            >
              Decline
            </button>
          </div>
        ) : (
          /* Display transaction status if it's not pending */
          <p className="my-2">
            Status:{" "}
            <span
              className={`border border-dashed rounded-md p-2 ${
                tx.status === "Accepted"
                  ? "border-green-500 text-green-500"
                  : tx.status === "Declined" || tx.status === "Cancelled"
                  ? "border-red-500 text-red-500"
                  : "border-yellow-500 text-yellow-500"
              } mt-2 uppercase`}
            >
              {tx.status}
            </span>
          </p>
        )}
      </div>
    );
  }

  // If the user is the sender of the transaction
  else if (walletData.id === tx.sender) {
    return (
      <div className="border border-[#eee] rounded-md p-2 px-4 my-2">
        <p>
          You sent{" "}
          <span className="font-bold text-red-400">
            {" "}
            -{tx.amount} {tx.currency}
          </span>{" "}
          to
          <span className="text-gray-400"> {tx.receiver} </span>
        </p>
        <div className="flex justify-between items-center">
          {/* Display transaction status */}
          <p className="my-2">
            Status:{" "}
            <span
              className={`border border-dashed rounded-md p-2 ${
                tx.status === "Accepted"
                  ? "border-green-500 text-green-500"
                  : tx.status === "Declined" || tx.status === "Cancelled"
                  ? "border-red-500 text-red-500"
                  : "border-yellow-500 text-yellow-500"
              } mt-2 uppercase`}
            >
              {tx.status}
            </span>
          </p>

          {/* Cancel transfer button */}
          {tx.status === "pending" && (
            <button
              onClick={() => respondToTransfer(tx.id, "cancel")}
              disabled={loading}
              className={`px-3 py-1 ${
                loading ? "bg-red-200" : "bg-red-500"
              } text-white rounded`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // If the user is neither the sender nor receiver, return nothing
  return null;
};

export default TransactionItem;
