// const fs = require("fs");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let account;
web3.eth.getAccounts().then((f) => {
  account = f[0];
});

abi = JSON.parse(
  '[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'
);

const contract = new web3.eth.Contract(abi);
contract.options.address = "0x71789831d83d4C8325b324eA9B5fFB27525480b5";

const candidates = {
  Nicole: "candidate-1",
  Jesse: "candidate-2",
  Gatsby: "candidate-3",
};

function voteForCandidate(candidate) {
  const candidateName = $("#candidate").val();
  console.log(candidateName);

  contract.methods
    .voteForCandidate(web3.utils.asciiToHex(candidateName))
    .send({ from: account })
    .then((f) => {
      let div_id = candidates[candidateName];
      contract.methods
        .totalVotesFor(web3.utils.asciiToHex(candidateName))
        .call()
        .then((f) => {
          $("#" + div_id).html(f);
        });
    });
}

$(document).ready(function () {
  candidateNames = Object.keys(candidates);

  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];

    contract.methods
      .totalVotesFor(web3.utils.asciiToHex(name))
      .call()
      .then((f) => {
        $("#" + candidates[name]).html(f);
      });
  }
});
