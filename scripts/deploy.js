async function main() {
  const Merchant = await ethers.getContractFactory("Merchant")

  // Start deployment, returning a promise that resolves to a contract object
  const Merchanta = await Merchant.deploy()
  await Merchanta.deployed()
  console.log("Contract deployed to address:", Merchanta.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
