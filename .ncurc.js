module.exports = {
  target: (dependencyName) => {
    if (dependencyName === 'bencode')
      return 'minor';
    return 'latest';
  }
}
