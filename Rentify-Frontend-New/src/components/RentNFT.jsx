
const rentNFT = async () => {
  const signer = await wallet.provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, marketplaceAbi.abi, signer);

  const rentPrice = ethers.parseEther("0.1"); // Match rent price in contract
  await contract.rentNFT("NFT_CONTRACT_ADDRESS", 1, { value: rentPrice });
};
