const { ethers } = require("hardhat");

async function main() {
  const Freelancing = await ethers.getContractFactory("Freelancing");
  const freelancing = await Freelancing.deploy();

  console.log("Freelancing deployed to:", freelancing.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
