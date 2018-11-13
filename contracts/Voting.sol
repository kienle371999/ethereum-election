pragma solidity ^0.4.24;

contract Voting {

    /* Struct to hold details of Voter */
    struct Voter {
        address account;
        bool voted;
        string vote;
    }
    
    /* Struct to hold details of Candidate */
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
    mapping(uint => Voter) public voters;
    Candidate[] public candidates;
    Stage public stage;
    uint public numberOfVoter;
    uint public totalVoteCount;

    event Notify(string x);

    constructor () public {
        /* Người xuất bản là chủ tọa */
        chairPerson = msg.sender;
        voters[numberOfVoter].account = chairPerson;
        stage = Stage.INIT;
        numberOfVoter = 1;
    }

    modifier onlyOwner() {
        if (msg.sender != chairPerson) {
            return;
        }
        emit Notify("Only owner can do it");
        _;
    }

    modifier checkStage(Stage _stage) {
        if (_stage != stage) {
            return;
        }
        emit Notify("Current stage is invalid");
        _;
    }

    /* Chỉ có chủ tọa được thêm ứng viên */    
    /* Chủ tọa thêm tên từng ứng viên */
    function addCandidate(string _candidate) onlyOwner() checkStage(Stage.INIT) {
        /* Không có 2 ứng viên tên giống nhau */
        for(uint i = 0; i < candidates.length; i++) {
            string memory tempName = candidates[i].name;
            if(keccak256(_candidate) == keccak256(tempName)) {
                emit Notify("This candidate is existed");
                return;
            }
        }
        candidates.push(Candidate(_candidate, 0));
        emit Notify("Add candidate successfully");
    }

    /* Chỉ có chủ tọa được thêm cử tri */
    /* Chủ tọa thêm từng cử chi (địa chỉ tài khoản) */
    function addVoter(address _voter) onlyOwner() checkStage(Stage.INIT) {
        /* Mỗi cử tri chỉ được thêm vào 1 lần duy nhất */
        for(uint i = 0; i < numberOfVoter; i++) {
            if(voters[i].account == _voter) {
                emit Notify("This voter is existed");
                return;
            }
        }

        /* Địa chỉ của cử tri phải khác 0 */
        if(_voter == 0) {
            emit Notify("This address of voter is invalid");
            return;
        }

        voters[numberOfVoter].account = _voter;
        numberOfVoter++;
        emit Notify("Add voter successfully");
    }

    /* Chủ tọa bắt đầu việc bầu cử */
    /* Chỉ có chủ tọa bắt đầu việc bầu cử */
    function startVoting() onlyOwner() checkStage(Stage.INIT) {
        /* Chỉ được phép bầu cử nếu có ít nhất 2 ứng viên */
        if(candidates.length < 2) {
            emit Notify("Voting only start with at least two candidates");
            return;
        }
        stage = Stage.START;
    }

    /* Chủ tọa kết thúc việc bầu cử */
    /* Chỉ có chủ tọa kết thúc việc bầu cử */
    function finishVoting() onlyOwner() checkStage(Stage.START) {
        /* Chỉ được phép kết thúc bầu cử nếu có ít 50% cử tri đã bầu */
        if(totalVoteCount * 2 < numberOfVoter) {
            emit Notify("Voting finish only if at least 50% voter voted");
            return;
        }
        stage = Stage.FINISH;
    }

    /* Công bố ứng viên thắng cuộc */
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
        // TODO: Event thông báo người đắc cử
    }

    /* Chủ tọa reset việc bầu cử (xóa tất cả thông tin ứng viên và cử tri)*/
    /* Chỉ có chủ tọa reset việc bầu cử */
    function resetVoting() onlyOwner() {
        stage = Stage.INIT;
        for(uint i = 0; i < numberOfVoter; i++) {
            voters[i].account = 0;
            voters[i].voted = false;
            voters[i].vote = "";
        }
        numberOfVoter = 1;
        totalVoteCount = 0;
        candidates.length = 0;
    }

    /* Cử tri bầu cử */
    function vote(string _candidate) checkStage(Stage.START) {
        /* Chỉ có cử tri có tên được bầu cử */
        bool valid = false;
        for(uint i = 0; i < numberOfVoter; i++) {
            if(voters[i].account == msg.sender) {
                valid = true;
                break;
            }
        }
        if(valid == false) {
            emit Notify("Only registered voter can vote");
            return;
        }

        /* Mỗi cử tri được bầu 1 lần */
        if(voters[i].voted == true) {
            emit Notify("Each voter only vote one times");
            return;
        }
        voters[i].voted = true;

        for(i = 0; i < candidates.length; i++) {
            string memory tempName = candidates[i].name;
            if(keccak256(_candidate) == keccak256(tempName)) {
                candidates[i].voteCount++;
                totalVoteCount++;
                break;
            }
        }
        emit Notify("Vote successfully");
    }
}