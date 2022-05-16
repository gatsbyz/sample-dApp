import Web3 from "web3";
import fs from "fs";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const bytecode = fs.readFileSync("voting_sol_Voting.bin").toString();
const abi = JSON.parse(fs.readFileSync("voting_sol_Voting.abi").toString());

web3.eth
  .getAccounts()
  .then((accounts) => {
    const ACCOUNT_ADDRESS = accounts[0];

    // compile the contract, load the bytecode and abi from the file system in to a string like below
    const deployedContract = new web3.eth.Contract(abi);
    const listOfCandidates = ["Nicole", "Jesse", "Gatsby", "Lovey", "Beta"];

    // deploy the contract
    deployedContract
      .deploy({
        data: bytecode,
        arguments: [
          listOfCandidates.map((name) => web3.utils.asciiToHex(name as string)),
        ],
      })
      .send({
        from: ACCOUNT_ADDRESS,
        gas: 1500000,
        gasPrice: web3.utils.toWei("0.00003", "ether"),
      })
      .then((newContractInstance) => {
        deployedContract.options.address = newContractInstance.options.address;
        return deployedContract;
      })
      .then((deployedContract) => {
        deployedContract.methods
          .totalVotesFor(web3.utils.asciiToHex("Nicole"))
          .call(console.log);
        return deployedContract;
      })
      .then((deployedContract) => {
        deployedContract.methods
          .voteForCandidate(web3.utils.asciiToHex("Nicole"))
          .send({ from: ACCOUNT_ADDRESS })
          .then((f: unknown) => console.log(f));
        return deployedContract;
      })
      .then((deployedContract) => {
        deployedContract.methods
          .totalVotesFor(web3.utils.asciiToHex("Nicole"))
          .call(console.log);
      });
  })
  .catch((e) => {
    throw Error(e);
  });
