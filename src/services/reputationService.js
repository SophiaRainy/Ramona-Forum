const User = require('../models/User');

const updateReputation = async (userId, action) => {
  const user = await User.findById(userId);
  if (!user) return;

  switch (action) {
    case 'post_created':
      user.reputation += 5;
      break;
    case 'post_liked':
      user.reputation += 2;
      break;
    case 'comment_created':
      user.reputation += 3;
      break;
    case 'comment_liked':
      user.reputation += 1;
      break;
    case 'followed':
      user.reputation += 2;
      break;
    default:
      break;
  }

  user.updateLevel();
  await user.save();
};

module.exports = { updateReputation };