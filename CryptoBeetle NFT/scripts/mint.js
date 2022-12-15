const { ethers } = require("hardhat");
const cryptoBeetlesJSON = require("../artifacts/contracts/CryptoBeetles.sol/CryptoBeetles.json");

async function main() {
  const abi = cryptoBeetlesJSON.abi;
  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.GOERLI_PROJECT_ID
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const signer = wallet.connect(provider);
  const cryptoBeetles = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    signer
  );
  await cryptoBeetles.mint(
    "https://ipfs.io/ipfs/(HERE PASTE CID OF THAT IMAGE'S JSON FILE FROM PINATA THAT YOU WANT TO MINT)"
  );
  // EXAMPLE- "https://ipfs.io/ipfs/QmPFh9aiW8iwSDM2K1E9jXiqwG33zsf4xYeKJwb43PbHsA"
  console.log("NFT minted!");
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
