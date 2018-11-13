const Voting = artifacts.require("./Voting.sol");

contract("Voting", async (accounts) => {
  /* Positive test case */
  it("vote and announce the winner", async () => {
    let instance = await Voting.deployed();

    await instance.addCandidate("Candidate 1");
    await instance.addCandidate("Candidate 2");
    await instance.addVoter(accounts[1]);
    await instance.addVoter(accounts[2]);

    await instance.startVoting();

    await instance.vote("Candidate 1", { from: accounts[1] });
    await instance.vote("Candidate 1", { from: accounts[2] });

    await instance.finishVoting();

    let result = await instance.winning();
    assert.equal(result[0], "Candidate 1", "contains the correct name");
    assert.equal(result[1], 2, "contains the correct voteCount");

    await instance.resetVoting();
  });

  /* Negative test case */
  it("vote by invalid voter", async () => {
    let instance = await Voting.deployed();

    await instance.addCandidate("Candidate 1");
    await instance.addCandidate("Candidate 2");

    await instance.startVoting();

    await instance.vote("Candidate 1", { from: accounts[1] });

    let candidate = await instance.candidates(0);
    assert.equal(candidate[1], 0, "contains the correct voteCount");
    
    await instance.resetVoting();
  });

  /* Negative test case */
  it("duplicate voting", async () => {
    let instance = await Voting.deployed();

    await instance.addCandidate("Candidate 1");
    await instance.addCandidate("Candidate 2");
    await instance.addVoter(accounts[1]);

    await instance.startVoting();

    await instance.vote("Candidate 1", { from: accounts[1] });
    await instance.vote("Candidate 1", { from: accounts[1] });

    let candidate = await instance.candidates(0);
    assert.equal(candidate[1], 1, "contains the correct voteCount");
  });
});