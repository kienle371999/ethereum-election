import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import $ from "jquery";

import "./App.css";

class App extends Component {

  state = { web3: null, 
            accounts: null, 
            contract: null, 
            voter: null, 
            candidateName: null,  
            voterAddress: '0x',
            totalOfVoters: [],
            notice: null
          };
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(VotingContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      
      Contract.deployed().then(function(contract) {
        var candidatesCount = 20;
        var candidatesResults = $("#candidatesResults"); 
        var candidatesSelect = $('#candidatesSelect');
        for (var i = 0; i < candidatesCount; i++)
        {
              contract.candidates(i).then(function(candidate) {
                var id = '$';
                var name = candidate[0];
                var voteCount = candidate[1];
                var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
                candidatesResults.append(candidateTemplate);
                var candidateOption = "<option value='" + name + "'>" + name + "</ option>"
                candidatesSelect.append(candidateOption);
            })
        }
      })
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        "Failed to load web3, accounts, or contract. Check console for details."
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    contract.contract.events.Notify({}, (err, res) => {
      if(!err){
        console.log("EVENT", res)
        this.setState({ notice: res.returnValues.x })
        alert(this.state.notice);
      }
    });
  };

  // Submit Candidates
  handleChangeCandidate = event => {
    this.setState({ candidateName: event.target.value });
  };

  handleSubmitCandidate = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.addCandidate(this.state.candidateName, { from: accounts[0] });
  };
  
  // Submit Voters
  handleChangeVoter = event => {
    this.setState({ voterAddress: event.target.value });
  };

  handleSubmitVoter = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.addVoter(this.state.voterAddress, { from: accounts[0] });
    alert(this.state.voterAddress + " is submitted");
    const totalOfVoters = this.state.totalOfVoters;
    totalOfVoters.push(this.state.voterAddress);
  };
  // Vote for the candiadate
  handleSubmitVote = async (event) => {
    event.preventDefault();
    const { accounts, contract , totalOfVoters } = this.state;
    var name = $('#candidatesSelect').val();
    await contract.vote(name, { from: accounts[0], totalOfVoters });
    console.log(totalOfVoters);
  };
  // Start the election
  startVoting = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.startVoting({ from: accounts[0]});
    alert("Start the Election");
  };
  //Finish the election
  finishVoting = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.finishVoting({ from: accounts[0]});
    alert("Finish the Election");
  };
  // Reset the election
  resetVoting = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.resetVoting({ from: accounts[0] });
    alert("Reset the Election");
  };
  //Broadcast the winner
  winning = async (event) => {
    event.preventDefault();
    const { contract } = this.state;
    const winner = await contract.winning();
    alert(winner[0] + " is the winner with " + winner[1] + " ballots");
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Election Results</h1>
        <table class="table">
              <thead>
                <tr>
                <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Votes</th>
                </tr>
              </thead>
              <tbody id="candidatesResults">
              </tbody>
        </table>
        <div class = "selectCandidate">
          <form onSubmit = {this.handleSubmitCandidate}>
            <input type = "text"  onChange = {this.handleChangeCandidate}/> 
            <input class = "buttonCandidate" type = "submit" value = "Add Candidate" /> 
          </form>
        </div>
        <div class = "selectVoter">
          <form onSubmit = {this.handleSubmitVoter}>
            <input  type = "text"  onChange = {this.handleChangeVoter}/> 
            <input class = "buttonVoter" type = "submit" value = "Add Voter" /> 
          </form>
        </div>
        <div class = "vote">
          <form onSubmit = {this.handleSubmitVote}>
            <select id = "candidatesSelect" />
            <input class = "buttonVote" type = "submit" value = "Vote" /> 
          </form>
        </div>
        <div class = "listButton">
          <button onClick = {this.startVoting}>Start</button>
          <button onClick = {this.finishVoting}>Finish</button>
          <button onClick = {this.resetVoting}>Reset</button>
          <button onClick = {this.winning}>Winning</button>
        </div>
      </div>
    );
  };
}
export default App;