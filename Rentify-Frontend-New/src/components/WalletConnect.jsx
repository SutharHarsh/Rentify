import { useState } from "react";
import { ethers } from "ethers";

function WalletConnect({ setWallet }) {
  const [address, setAddress] = useState("");

  const connect = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      setWallet({ provider, address: accounts[0] });
    } else {
      alert("Install MetaMask");
    }
  };

  return (
    <div>
      <button onClick={connect}>Connect Wallet</button>
      {address && <p>Connected: {address}</p>}
    </div>
  );
}

export default WalletConnect;
