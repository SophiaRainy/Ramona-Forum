const badWords = ['不当词1', '不当词2', '不当词3']; // 这里应该是一个更完整的不当词列表

const filterContent = (content) => {
  let filteredContent = content;
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredContent = filteredContent.replace(regex, '*'.repeat(word.length));
  });
  return filteredContent;
};

module.exports = filterContent;