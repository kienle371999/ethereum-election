const Voting = artifacts.require("./Voting.sol");

contract("Voting", async (accounts) => {
  /* Positive test case */
  it("check initial values", async () => {
    let instance = await Voting.deployed();
    let _chairPerson = await instance.chairPerson();
    let _numberOfVoter = await instance.numberOfVoter();
    let _totalVoteCount = await instance.totalVoteCount();
    assert.equal(_chairPerson, accounts[0]);
    assert.equal(_numberOfVoter, 1);
    assert.equal(_totalVoteCount, 0);
  });

  /* Positive test case */
  it("add two candidates and check their values", async () => {
    let instance = await Voting.deployed();
    await instance.addCandidate("Candidate 1");
    await instance.addCandidate("Candidate 2");
    let candidate1 = await instance.candidates(0);
    let candidate2 = await instance.candidates(1);

    assert.equal(candidate1[0], "Candidate 1", "contains the correct name");
    assert.equal(candidate1[1], 0, "contains the correct votes count");

    assert.equal(candidate2[0], "Candidate 2", "contains the correct name");
    assert.equal(candidate2[1], 0, "contains the correct votes count");
  });

  /* Negative test case */
  it("add two candidates that have the same name", async () => {
    let instance = await Voting.deployed();
    await instance.addCandidate("Candidate 3");
    await instance.addCandidate("Candidate 3");
    try {
      await instance.candidates(3);
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("invalid opcode") >= 0, "error message must contain invalid opcode");
    }
  });

  /* Negative test case */
  it("add a candidate that have null name", async () => {
    let instance = await Voting.deployed();
    try {
      await instance.addCandidate(null);
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("null") >= 0, "error message must contain null");
    }
  });

  /* Positive test case */
  it("add two voters and check their values", async () => {
    let instance = await Voting.deployed();
    await instance.addVoter(accounts[1]);
    await instance.addVoter(accounts[2]);
    let voter1 = await instance.voters(1);
    let voter2 = await instance.voters(2);
    
    assert.equal(voter1[0], accounts[1], "contains the correct address");
    assert.equal(voter1[1], false, "contains the correct voted");
    assert.equal(voter1[2], "", "contains the correct vote");

    assert.equal(voter2[0], accounts[2], "contains the correct address");
    assert.equal(voter2[1], false, "contains the correct voted");
    assert.equal(voter2[2], "", "contains the correct vote");
  });

  /* Negative test case */
  it("add two voters that have the same address", async () => {
    let instance = await Voting.deployed();
    let tempVoter;
    await instance.addVoter(accounts[3]);
    await instance.addVoter(accounts[3]);
    tempVoter = await instance.voters(4);
    assert.equal(tempVoter[0], 0, "contains the correct address");
  });

  /* Negative test case */
  it("add a voter that have wrong format address", async () => {
    let instance = await Voting.deployed();
    try {
      await instance.addVoter(true);
      assert.fail();
    } catch(err) {
      assert(err.message.indexOf("not a number") >= 0, "error message must contain not a number");
    }
  });
});