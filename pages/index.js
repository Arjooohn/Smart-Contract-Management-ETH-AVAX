// index.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [showSecondPage, setShowSecondPage] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected:", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
    setShowSecondPage(true); // Show the second page after connecting account
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
    }
  };

  const transferFunds = async () => {
    if (atm) {
      try {
        let tx = await atm.transfer(recipient, transferAmount);
        await tx.wait();
        getBalance();
        setRecipient("");
        setTransferAmount(0);
      } catch (error) {
        console.error("Error transferring funds:", error);
      }
    }
  };

  // Function to exit the program
  const exitProgram = () => {
    window.close(); // Close the current window/tab
  };

  const SecondPage = () => {
    return (
      <div className="neumorphic-card">
        <b><p>Your Account: {account}</p></b>
        <b><p>Your Balance: {balance}</p></b>
        <div>
          <input
            className="input-field"
            type="number"
            placeholder="Deposit Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button className="btn btn2" onClick={deposit}>
            Deposit
          </button>
        </div>
        <br />
        <div>
          <input
            className="input-field"
            type="number"
            placeholder="Withdraw Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button className="btn btn3" onClick={withdraw}>
            Withdraw
          </button>
        </div>
        <br />
        <div>
          <input
            className="input-field"
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            className="input-field"
            type="number"
            placeholder="Transfer Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <button className="btn btn4" onClick={transferFunds}>
            Transfer
          </button>
        </div>
        <br />
        <div>
          <button className="btn btn5" onClick={exitProgram}>
            <b>Exit</b>
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <center>
          <h1>Smart-Contract-Management-ETH-AVAX - ATM Project</h1>
          <h2>Project by: John Armand V. Yabut</h2>
        </center>
        
      </header>
      {!account ? (
        <div className="centered">
          <button className="btn btn1" onClick={connectAccount}>
            Connect Your Metamask Wallet
          </button>
        </div>
      ) : (
        showSecondPage && <SecondPage />
      )}
      <style jsx global>{`
        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #ff3c28, #ff6a00, #e8590c, #ffc800);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
        }

        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .centered {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        .btn {
          font-size: 16px;
          cursor: pointer;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          margin: 5px;
          background-color: #5f27cd;
          color: white;
          outline: none;
          transition: background-color 0.3s ease;
          font-family: 'Roboto', sans-serif;
          box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1),
                      -3px -3px 10px rgba(255, 255, 255, 0.5);
        }

        .btn:hover {
          background-color: #341f97;
        }

        .btn:active {
          transform: translateY(1px);
        }

        .input-field {
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
          margin-right: 10px;
          font-family: 'Roboto', sans-serif;
          box-shadow: inset 3px 3px 8px rgba(0, 0, 0, 0.1),
                      inset -3px -3px 8px rgba(255, 255, 255, 0.5);
        }

        .neumorphic-card {
          background: #e0e0e0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2),
                      -4px -4px 8px rgba(255, 255, 255, 0.5);
          margin: 20px;
          width: 80%;
          max-width: 600px;
        }
      `}
      </style>
    </main>
  );
}
