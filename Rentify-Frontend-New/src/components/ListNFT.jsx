// src/components/ListNFT.jsx
import { useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/NFTRentalMarketplace.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const ListNFT = ({ provider }) => {
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [rentFee, setRentFee] = useState("");
  const [rentDuration, setRentDuration] = useState("");

  const handleList = async () => {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

      const tx = await contract.listNFTForRent(
        nftAddress,
        tokenId,
        ethers.parseEther(rentFee),       // e.g. "0.01"
        rentDuration                      // in seconds
      );
      await tx.wait();
      alert("NFT listed for rent!");
    } catch (err) {
      console.error(err);
      alert("Error listing NFT");
    }
  };

  return (
    <div className="border p-4 m-2 rounded">
      <h2>List NFT for Rent</h2>
      <input placeholder="NFT Contract Address" value={nftAddress} onChange={e => setNftAddress(e.target.value)} />
      <input placeholder="Token ID" value={tokenId} onChange={e => setTokenId(e.target.value)} />
      <input placeholder="Rent Fee (ETH)" value={rentFee} onChange={e => setRentFee(e.target.value)} />
      <input placeholder="Duration (sec)" value={rentDuration} onChange={e => setRentDuration(e.target.value)} />
      <button onClick={handleList}>List NFT</button>
    </div>
  );
};

export default ListNFT;