const Voting = artifacts.require("Voting");

module.exports = function (deployer, network, address) {
  const candidates = ["Nicole", "Jesse", "Gatsby"].map((name) =>
    web3.utils.asciiToHex(name)
  );
  deployer.deploy(Voting, candidates);
};
