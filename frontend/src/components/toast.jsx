export default function ToastComponent({ transaction }) {
  return (
    <div>
      <p className="font-semibold">Transaction Update</p>
      {transaction.status === "Cancelled" ? (
        <p className="text-sm">
          {transaction.sender}{" "}
          <span
            className={`${
              transaction.status === "Accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {transaction.status}
          </span>{" "}
          their transfer request
        </p>
      ) : (
        <p className="text-sm">
          {transaction.receiver}{" "}
          <span
            className={`${
              transaction.status === "Accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {transaction.status}
          </span>{" "}
          your transfer request
        </p>
      )}
    </div>
  );
}
