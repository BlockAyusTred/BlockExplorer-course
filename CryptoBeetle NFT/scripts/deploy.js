const { ethers } = require("hardhat");

async function main() {
  const CryptoBeetles = await ethers.getContractFactory("CryptoBeetles");
  const cryptoBeetles = await CryptoBeetles.deploy("CryptoBeetles", "CBEET");

  const mintNFT = async () => {
    try {
      const newItemId = await cryptoBeetles.mint(
        "https://ipfs.io/ipfs/(HERE PASTE CID OF THAT IMAGE'S JSON FILE FROM PINATA THAT YOU WANT TO MINT)"
      );
      console.log(`NFT minted successfully :: ${newItemId}`);
    } catch (err) {
      console.log(`Minting error: ${err.message}`);
    }
  };

  try {
    await cryptoBeetles.deployed();
    console.log(`Contract succesfully deployed to ${cryptoBeetles.address}`);
    await mintNFT();
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
