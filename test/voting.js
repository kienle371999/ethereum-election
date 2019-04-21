const Voting = artifacts.require("./Voting.sol");

  contract("Voting", async accounts => {
  
    it("check the deploying person", async () => {
      let instance = await Voting.deployed();
      let _chairPerson = await instance.chairPerson();
      assert.equal(_chairPerson, accounts[0]);
    });

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

    it("check the number of candidates", async () => {
      let instance = await Voting.deployed();
  
      await instance.addCandidate("Candidate 1");
      await instance.addCandidate("Candidate 2");
      let candidateLength = await instance.getCandidateLength();
  
      assert.equal(candidateLength, 2, "contains correct candiadtes");
    });

    it("check the voteCount of candidates", async () => {
      let instance = await Voting.deployed();
  
      await instance.addCandidate("Candidate 1");
      await instance.addCandidate("Candidate 2");
      await instance.startVoting();

      await instance.vote("Candidate 1", { from: accounts[0] });
      await instance.vote("Candidate 1", { from: accounts[1] });
      let candidate1 = await instance.candidates(0);

      assert.equal(candidate1[1], 2, "contains the correct votes count");
    });
  })
