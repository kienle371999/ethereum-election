import React, { Component } from 'react';
import VotingContract from './contracts/Voting.json';
import getWeb3 from './utils/getWeb3';
import $ from 'jquery';

import './App.css';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    voter: null,
    candidateName: null,
    voterAddress: "0x",
    totalOfVoters: [],
    notice: null,
    candidate: [
      {
        name: null,
        voteCount: null
      }
    ]
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const addresses = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      var candidateLength = await instance.methods.getCandidateLength().call();
      var candidatesResults = $("#candidatesResults"); 
      var candidatesSelect = $('#candidatesSelect');
    
      for (var i = 0; i < candidateLength; i++)
      {
        var candidate = await instance.methods.candidates(i).call(); 
        var id = "$";
        var name = candidate.name;
        var voteCount = candidate.voteCount;
        candidatesResults.append("<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>");
        candidatesSelect.append("<option value='" + name + "'>" + name + "</ option>");
      }

      // Set web3, accounts, and contract to the state
      this.setState({ web3, accounts: addresses, contract: instance }, this.notifyEvent);
    } catch (error) {
      alert(
        "Failed to load web3, accounts, or contract. Check console for details."
      );
      console.log(error);
    }
  };

  // Notify event
  notifyEvent = async () => {
    const { contract } = this.state;
    contract.events.Notify({}, (err, res) => {
      if(!err){
        alert(res.returnValues.x);
      }
    });
  };

  // Submit Candidates
  handleChangeCandidate = event => {
    this.setState({ candidateName: event.target.value });
  };

  handleSubmitCandidate = async event => {
    event.preventDefault();
    const { contract, candidateName, accounts } = this.state;
    await contract.methods.addCandidate(candidateName).send({ from: accounts[0] });
    window.location.reload();
  };

  // Vote for the candiadate
  handleSubmitVote = async event => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    var name = $("#candidatesSelect").val();
    await contract.methods.vote(name).send({ from: accounts[0] });
    window.location.reload();
  };
  // Start the election
  startVoting = async event => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.methods.startVoting().send({ from: accounts[0] });
  };
  //Finish the election
  finishVoting = async event => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.methods.finishVoting().send({ from: accounts[0] });
  };
  
  //Broadcast the winner
  winning = async event => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.methods.winning().send({ from: accounts[0] });
  };

  render() {
    return (
      <div className="App">
        <h1>Election Results</h1>
        <table className="table">
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
        <div className="selectCandidate">
          <form onSubmit={this.handleSubmitCandidate}>
            <input type="text" onChange={this.handleChangeCandidate} />
            <input
              className="buttonCandidate"
              type="submit"
              value="Add Candidate"
            />
          </form>
        </div>
        <div className="vote">
          <form onSubmit={this.handleSubmitVote}>
            <select id="candidatesSelect" />
            <input className="buttonVote" type="submit" value="Vote" />
          </form>
        </div>
        <div className="listButton">
          <button onClick={this.startVoting}>Start</button>
          <button onClick={this.finishVoting}>Finish</button>
          <button onClick={this.winning}>Winning</button>
        </div>
      </div>
    );
  }
}
export default App;
