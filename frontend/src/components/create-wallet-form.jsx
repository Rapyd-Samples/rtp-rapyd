import axios from "axios";
import { useState } from "react";

const CreateWalletForm = ({ fetchUser }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    type: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create wallet
  const createWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/wallet/create",
        userData
      );
      localStorage.setItem("ewallet", response.data.wallet.id);
      await fetchUser();
    } catch (error) {
      console.error("Failed to create wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={createWallet}
      className="flex flex-col gap-4 w-80 bg-white p-6 shadow rounded mb-4"
    >
      <h2>Create your E-wallet</h2>
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        className="p-2 border rounded"
        value={userData.first_name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        className="p-2 border rounded"
        value={userData.last_name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="p-2 border rounded"
        value={userData.email}
        onChange={handleChange}
        required
      />
      <select
        name="type"
        className="p-2 border rounded"
        value={userData.type}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          {" "}
          Select Type{" "}
        </option>
        <option value="person">Person</option>
        <option value="company">Company</option>
      </select>
      <button
        disabled={loading}
        type="submit"
        className={`px-4 py-2 ${
          loading ? "bg-blue-300" : "bg-blue-600"
        }  text-white rounded`}
      >
        {loading ? "..." : " Create Wallet"}
      </button>
    </form>
  );
};

export default CreateWalletForm;
