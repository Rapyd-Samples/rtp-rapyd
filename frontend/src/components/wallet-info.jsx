const WalletInfo = ({ walletData }) => {
  if (!walletData) return null;

  return (
    <div className="mb-4 bg-white p-4 rounded-md max-w-[500px]">
      <div className="flex justify-between">
        <p className="font-semibold text-lg">
          {walletData?.first_name} {walletData?.last_name}
        </p>
        <p className="text-blue-400 font-semibold">
          {walletData?.accounts[0]?.balance} {walletData?.accounts[0]?.currency}
        </p>
      </div>
      <p>
        Your Wallet ID: <span className="text-gray-500">{walletData?.id}</span>
      </p>
    </div>
  );
};
export default WalletInfo;
