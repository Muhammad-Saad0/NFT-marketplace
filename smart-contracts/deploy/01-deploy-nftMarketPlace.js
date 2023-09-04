module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  await deploy("NftMarket", {
    from: deployer,
    args: [],
    log: true,
  });
};
