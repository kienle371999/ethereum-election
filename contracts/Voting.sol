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

    function strConcat(string _a, string _b, string _c, string _d, string _e) returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
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
      emit Notify("Start the election");
    }

    function finishVoting() onlyOwner() checkStage(Stage.START) {
      stage = Stage.FINISH;
      emit Notify("Finish the election");
    }

    function winning() public checkStage(Stage.FINISH) {
      uint winningCount = 0;
      string _winner;
      uint _voteCount;
      string memory result;
      
      for (uint i = 0; i < candidates.length; i++)
      {
        if (candidates[i].voteCount > winningCount)
          {
            winningCount = candidates[i].voteCount;
            _voteCount = winningCount;
            _winner = candidates[i].name;
          }
      }
      
      result = strConcat(_winner, " is the winner", "", "", "");
      emit Notify(result);
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