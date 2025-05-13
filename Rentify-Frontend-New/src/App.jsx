// src/App.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ListNFT from "./components/ListNFT";
import RentalTimer from "./components/RentalTimer";

function App() {
  const [provider, setProvider] = useState(null);

  // const connectWallet = async () => {
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   await provider.send("eth_requestAccounts", []);
  //   setProvider(provider);
  // };


  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
  };

  useEffect(() => {
    connectWallet(); // Auto-connect
  }, []);

  useEffect(() => {
    const checkNetwork = async () => {
      if (!provider) return;
      const network = await provider.getNetwork();
      console.log("Connected to network:", network);
      if (network.chainId !== 31337) {
        alert("⚠️ You are not connected to the local Hardhat network (chainId 31337). Please switch your MetaMask to Localhost 8545.");
      }
    };
    checkNetwork();
  }, [provider]);

  return (
    <div className="p-6">
      <h1>NFT Rental Marketplace</h1>
      {provider ? (
        <>
          <ListNFT provider={provider} />
          {/* Example token (change to your own address + tokenId) */}
          <RentalTimer provider={provider} nftAddress="0xef11d1c2aa48826d4c41e54ab82d1ff5ad8a64ca" tokenId="1" />
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
