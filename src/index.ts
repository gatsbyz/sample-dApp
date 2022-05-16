import Web3 from "web3";
import fs from "fs";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth.getAccounts(console.log);

const bytecode = fs.readFileSync("Voting_sol_Voting.bin").toString();
const abi = JSON.parse(fs.readFileSync("Voting_sol_Voting.abi").toString());

// compile the contract, load the bytecode and abi from the file system in to a string like below
const deployedContract = new web3.eth.Contract(abi);
const listOfCandidates = ["Rama", "Nick", "Jose"];

// deploy the contract
deployedContract
  .deploy({
    data: bytecode,
    arguments: [listOfCandidates.map((name) => web3.utils.asciiToHex(name))],
  })
  .send({
    from: "0xA9B590Ae81a8a95FfC6271967Cb4fB66c6bFa06B",
    gas: 1500000,
    gasPrice: web3.utils.toWei("0.00003", "ether"),
  })
  .then((newContractInstance) => {
    deployedContract.options.address = newContractInstance.options.address;
    console.log(newContractInstance.options.address);
  });

deployedContract.methods
  .totalVotesFor(web3.utils.asciiToHex("Rama"))
  .call(console.log);

deployedContract.methods
  .voteForCandidate(web3.utils.asciiToHex("Rama"))
  .send({ from: "0xA9B590Ae81a8a95FfC6271967Cb4fB66c6bFa06B" })
  .then((f: unknown) => console.log(f));

deployedContract.methods
  .totalVotesFor(web3.utils.asciiToHex("Rama"))
  .call(console.log);
