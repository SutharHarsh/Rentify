import { useEffect, useState } from "react";
import { ethers } from "ethers";
import marketplaceAbi from "../contracts/NFTRentalMarketplace.json";

const CONTRACT_ADDRESS = "0xef11D1c2aA48826D4c41e54ab82D1Ff5Ad8A64Ca";

function NFTCard({ wallet }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        marketplaceAbi.abi,
        wallet.provider
      );
      // Example: Check details for NFT with ID 1 (repeat for 2, 3, etc.)
      const details = await contract.getRentalDetails("0xef11D1c2aA48826D4c41e54ab82D1Ff5Ad8A64Ca", 1);
      setNfts([details]); // Add logic to loop through multiple NFTs
    };

    if (wallet) loadNFTs();
  }, [wallet]);

  return (
    <div>
      {nfts.map((nft, index) => (
        <div key={index}>
          <p>Renter: {nft.renter}</p>
          <p>Ends: {new Date(nft.endTime * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default NFTCard;
