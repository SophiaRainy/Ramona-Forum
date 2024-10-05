const badWords = ['不当词1', '不当词2', '不当词3']; // 这里应该是一个更完整的不当词列表

const moderateContent = (content) => {
  return badWords.some(word => content.includes(word));
};

module.exports = (req, res, next) => {
  if (req.body.content && moderateContent(req.body.content)) {
    return res.status(400).json({ msg: '内容包含不当词汇' });
  }
  next();
};