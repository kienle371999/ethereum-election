const Voting = artifacts.require("./Voting.sol");

contract("Voting", async (accounts) => {
  /* Negative test case */
  it("check revert if call function at invalid stage", async () => {
    let instance = await Voting.deployed();

    /*-------------------- INIT STAGE --------------------*/
    await instance.addCandidate("Candidate 1");
    await instance.addCandidate("Candidate 2");

    try {
      await instance.vote("Candidate 1", { from: accounts[0] });
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.finishVoting();
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.winning();
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    /*-------------------- START STAGE --------------------*/
    await instance.startVoting();

    try {
      await instance.addCandidate("Candidate 3");
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.addVoter(accounts[1]);
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.startVoting();
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.winning();
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    /*-------------------- FINISH STAGE --------------------*/
    await instance.vote("Candidate 1", { from: accounts[0] });
    await instance.finishVoting();

    try {
      await instance.addCandidate("Candidate 3");
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.addVoter(accounts[1]);
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.startVoting();
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.finishVoting();
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }

    try {
      await instance.vote("Candidate 1", { from: accounts[0] });
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("revert") >= 0, "error message must contain revert");
    }
  });

  /* Positive test case */
  it("check resetVoting", async () => {
    let instance = await Voting.deployed();
    await instance.resetVoting();

    let _numberOfVoter = await instance.numberOfVoter();
    let _totalVoteCount = await instance.totalVoteCount();
    assert.equal(_numberOfVoter, 1);
    assert.equal(_totalVoteCount, 0);

    try {
      await instance.candidates(0);
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("invalid opcode") >= 0, "error message must contain invalid opcode");
    }
  });
});