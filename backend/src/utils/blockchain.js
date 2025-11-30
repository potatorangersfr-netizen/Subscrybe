// Blockchain utility functions

function generateTxHash() {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function generateContractAddress() {
  return `addr1qxy${generateTxHash().slice(0, 54)}`;
}

module.exports = {
  generateTxHash,
  generateContractAddress
};
