const { makeRequest } = require("../config/rapydClient");
const { notifyUsers } = require("../websocket");
const { validationResult } = require("express-validator");

// Utility function to handle errors
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message });
};

// Create Wallet
exports.createWallet = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract necessary fields from request body
    const { first_name, last_name, email, type } = req.body;

    // Generate a unique wallet reference ID using email prefix and timestamp
    const timestamp = Date.now();
    const emailPrefix = email.split("@")[0];
    const ewalletReferenceId = `${emailPrefix}_${timestamp}`;

    // Construct the wallet creation payload
    const walletData = {
      first_name,
      last_name,
      ewallet_reference_id: ewalletReferenceId,
      email,
      type,
      contact: {
        email,
        first_name,
        last_name,
        contact_type: `${type === "company" ? "business" : "personal"}`,
        country: "SG",
        address: {
          name: `${first_name} ${last_name}`,
          line_1: "123 Main Street",
          country: "SG",
        },
        country: "SG",
        date_of_birth: "2000-11-22",
        metadata: {
          merchant_defined: true,
        },
      },
    };

    // Send request to create the wallet
    const walletResponse = await makeRequest(
      "POST",
      "/v1/ewallets",
      walletData
    );
    const walletId = walletResponse.body.data.id;

    // Auto-fund the wallet with an initial deposit of 20 SGD
    const fundResponse = await makeRequest("POST", "/v1/account/deposit", {
      ewallet: walletId,
      currency: "SGD",
      amount: 20,
    });

    // Respond with wallet details and initial deposit transaction
    res.json({
      wallet: walletResponse.body.data,
      initial_deposit: fundResponse.body,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Retrieve Account
exports.retrieveWallet = async (req, res) => {
  try {
    const accountId = req.params.id;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    const result = await makeRequest("GET", `/v1/ewallets/${accountId}`);
    res.json(result.body.data);
  } catch (error) {
    handleError(res, error);
  }
};

// Transfer Funds
exports.transferFunds = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { senderWalletId, receiverWalletId, amount } = req.body;

    const response = await makeRequest("POST", "/v1/ewallets/transfer", {
      source_ewallet: senderWalletId,
      destination_ewallet: receiverWalletId,
      currency: "SGD",
      amount,
    });

    const transactionId = response.body.data.id;

    if (!transactionId) {
      return res.status(500).json({ error: "Transaction ID not found." });
    }

    // Notify connected WebSocket clients about the transaction
    notifyUsers({
      sender: senderWalletId,
      receiver: receiverWalletId,
      id: transactionId,
      currency: "SGD",
      amount,
      status: "pending",
      variant: "TRANSFER_FUNDS",
    });

    res.json({
      message: "Transfer initiated. Waiting for confirmation...",
      transactionId,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Respond to Transfer
exports.respondToTransfer = async (req, res) => {
  try {
    // Validate request body to ensure required fields are present
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract transfer ID and response status (accept, decline, or cancel)
    const { status, id } = req.body;

    // Ensure the provided status is one of the allowed values
    if (!["accept", "decline", "cancel"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be 'accept', 'decline', or 'cancel'.",
      });
    }

    // Send a request to Rapyd's API to respond to the transfer request
    const response = await makeRequest(
      "POST",
      "/v1/ewallets/transfer/response",
      {
        id,
        status,
      }
    );

    // Check if the API response indicates a successful operation
    if (response.body.status.status !== "SUCCESS") {
      return res.status(500).json({ error: `Failed to ${status} transfer.` });
    }

    // Notify connected WebSocket clients about the transaction response
    notifyUsers({
      sender: response.body.data.source_ewallet_id,
      receiver: response.body.data.destination_ewallet_id,
      id,
      currency: response.body.data.currency_code,
      amount: response.body.data.amount,
      status:
        status === "accept"
          ? "Accepted"
          : status === "decline"
          ? "Declined"
          : status === "cancel"
          ? "Cancelled"
          : status.charAt(0).toUpperCase() + status.slice(1),
      variant: "RESPONDS_TO_TRANSFER",
    });

    // Send confirmation response back to the client
    res.json({
      message: `Transfer ${status}ed successfully.`,
      status: response.body.data.status,
    });
  } catch (error) {
    handleError(res, error);
  }
};
