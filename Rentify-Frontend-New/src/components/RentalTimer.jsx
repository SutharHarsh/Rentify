// src/components/RentalTimer.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/NFTRentalMarketplace.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const RentalTimer = ({ provider, nftAddress, tokenId }) => {
  const [endTime, setEndTime] = useState(null);

  const loadEndTime = async () => {
    try {
      if (!provider || !nftAddress || !tokenId) return;

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

      // Safely call getRentalDetails
      const rental = await contract.getRentalDetails(nftAddress, tokenId);

      if (rental && rental.endTime > 0n) {
        setEndTime(Number(rental.endTime));
      } else {
        setEndTime(null); // not rented
      }
    } catch (err) {
      console.error("❌ Failed to fetch rental details:", err);
      setEndTime(null); // avoid breaking rendering
    }
  };

  useEffect(() => {
    loadEndTime();
  }, [nftAddress, tokenId]);

  if (endTime === null) return <p>This NFT is not currently rented.</p>;

  const remaining = Math.max(0, endTime - Math.floor(Date.now() / 1000));

  return (
    <div>
      <p>⏳ Time left: {remaining} seconds</p>
    </div>
  );
};

export default RentalTimer;


