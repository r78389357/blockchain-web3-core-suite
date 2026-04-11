class GovernanceContract {
  constructor() {
    this.proposals = [];
    this.votes = new Map();
    this.minVotingPower = 100;
    this.votingPeriod = 7 * 24 * 60 * 60;
  }

  createProposal(creator, title, description, options) {
    const proposal = {
      id: `PROP_${Date.now()}`,
      creator,
      title,
      description,
      options,
      startTime: Math.floor(Date.now() / 1000),
      endTime: Math.floor(Date.now() / 1000) + this.votingPeriod,
      votes: options.map(() => 0),
      status: 'ACTIVE'
    };
    this.proposals.push(proposal);
    return proposal;
  }

  vote(proposalId, voter, optionIndex, votingPower) {
    if (votingPower < this.minVotingPower) throw new Error('Insufficient voting power');
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');
    const now = Math.floor(Date.now() / 1000);
    if (now > proposal.endTime) throw new Error('Voting ended');
    if (optionIndex < 0 || optionIndex >= proposal.options.length) throw new Error('Invalid option');

    const voteKey = `${proposalId}_${voter}`;
    if (this.votes.has(voteKey)) throw new Error('Already voted');

    this.votes.set(voteKey, { optionIndex, votingPower });
    proposal.votes[optionIndex] += votingPower;
    return true;
  }

  getProposalResult(proposalId) {
    const proposal = this.proposals.find(p => p.id === proposalId);
    if (!proposal) return null;
    const maxVotes = Math.max(...proposal.votes);
    const winnerIndex = proposal.votes.indexOf(maxVotes);
    return {
      winner: proposal.options[winnerIndex],
      votes: proposal.votes,
      status: proposal.status
    };
  }
}

module.exports = GovernanceContract;
