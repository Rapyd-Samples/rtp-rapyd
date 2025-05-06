# **P2P Wallet Transfer App with Rapyd API & WebSockets**  

A **real-time peer-to-peer (P2P) wallet transfer app** built with **Node.js, Rapyd API, and WebSockets**. Users can create wallets, and send money to each other with instant updates.  

## **Features**  
✔ **Create Wallets** – Users can register and generate digital wallets.  
✔ **Real-Time Transfers** – Send money between users with WebSocket updates.  
✔ **Rapyd API Integration** – Securely process payments using Rapyd's sandbox.  
✔ **Simple UI** – Basic frontend for testing wallet creation and transfers.  

---

## **Prerequisites**  
Before running the app, ensure you have:  
✅ **Node.js** (v14+)  
✅ **Rapyd Sandbox Account** ([Sign up here](https://dashboard.rapyd.net/sign-up))  
✅ **Rapyd API Keys** (`ACCESS_KEY` & `SECRET_KEY`)  

---

## **Setup & Installation**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/Giftea/rtp-rapyd.git
cd rtp-rapyd
```

### **2. Install Server Dependencies**  
```bash
cd backend
npm install
```

### **3. Set Up Environment Variables**  
Create a `.env` file in the `backend` directory:  
```env
RAPYD_ACCESS_KEY=your_access_key_here
RAPYD_SECRET_KEY=your_secret_key_here
```

### **4. Start the Server**  
Run the following command in the `backend` directory of your terminal to start the server:
  ```bash
  npm run dev
  ```

### **5. Open the App**  
In another terminal, navigate to the `frontend` directory and run the command to install dependencies:
```bash
cd frontend
npm install
```
Run `npm run dev` to run the React.js project.

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.  

---

## **How It Works**  

### **1. Create a Wallet**  
- Enter a **First Name**, **Last Name**, **Email**, and **Wallet Type**.  
- Click **"Create Wallet"** to generate a Rapyd e-wallet.  

### **2. Transfer Funds**  
- Enter **Receiver e-wallet ID** and **Amount**.  
- Click **"Send"** to send money in real time.  
- Both users receive **WebSocket notifications** instantly.  

---

## **Tech Stack**  
🔹 **Backend**: Node.js, Express  
🔹 **Payments**: Rapyd API  
🔹 **Real-Time Updates**: WebSockets  
🔹 **Frontend**: Vite (React.js)  

---

## **Need Help?**  
📄 **Rapyd API Docs**: [https://docs.rapyd.net](https://docs.rapyd.net/en/index-en.html)  
🤝 **Rapyd Dev Community**: [https://community.rapyd.net](https:communty.rapyd.net)   
🐞 **Report Issues**: [GitHub Issues](https://github.com/Giftea/rtp-rapyd/issues)  
