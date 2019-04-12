pragma solidity ^0.4.24;

contract Voting {
    struct Candidate {
      string name;
      uint voteCount;
    }

    enum Stage {
      INIT,
      START,
      FINISH
    }

    address public chairPerson;
    Candidate[] public candidates;
    address[] public voters;
    Stage public stage;
    uint public totalVoteCount;

    event Notify(string x);

    constructor () public {
      chairPerson = msg.sender;
      stage = Stage.INIT;
    }

    modifier onlyOwner() {
      if (msg.sender != chairPerson) {
        emit Notify("Only owner can do it");
        return;
      }
      _;
    }

    modifier checkStage(Stage _stage) {
      if (_stage != stage) {
        emit Notify("Current stage is invalid");
        return;
      }
      _;
    }


    function addCandidate(string _candidate) onlyOwner() checkStage(Stage.INIT) {
      for(uint i = 0; i < candidates.length; i++) {
        if(keccak256(_candidate) == keccak256(candidates[i].name)) {
          emit Notify("This candidate is existed");
          return;
        }
      }
      candidates.push(Candidate(_candidate, 0));
      emit Notify("Add candidate successfully");
    }

    function startVoting() onlyOwner() checkStage(Stage.INIT) {
      if(candidates.length < 2) {
        emit Notify("Voting only start with at least two candidates");
        return;
      }
      stage = Stage.START;
    }

    function finishVoting() onlyOwner() checkStage(Stage.START) {
      stage = Stage.FINISH;
    }

    function winning() public checkStage(Stage.FINISH) constant returns (string _winner, uint _voteCount) {
      uint winningCount = 0;
      for (uint i = 0; i < candidates.length; i++)
      {
        if (candidates[i].voteCount > winningCount)
          {
            winningCount = candidates[i].voteCount;
            _voteCount = winningCount;
            _winner = candidates[i].name;
          }
        }
    }

    function getCandidateLength() public constant returns (uint lengthCandidate) {
          lengthCandidate = candidates.length;
    }

    function vote(string _candidate) checkStage(Stage.START) {
      for (uint i = 0; i < voters.length; i++) {
        if (msg.sender == voters[i]) {
          emit Notify("This voters was existed");
          return;
        }
      }
      for(i = 0; i < candidates.length; i++) {
        string memory tempName = candidates[i].name;
        if(keccak256(_candidate) == keccak256(tempName)) {
            candidates[i].voteCount++;
            totalVoteCount++;
            break;
        }
      }
      voters.push(msg.sender);
      emit Notify("Vote successfully");
    }
}