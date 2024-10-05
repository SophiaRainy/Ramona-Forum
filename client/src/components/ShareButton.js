import React from 'react';

const ShareButton = ({ post }) => {
  const shareToFacebook = () => {
    FB.ui({
      method: 'share',
      href: `https://yourwebsite.com/posts/${post.id}`,
    }, function(response){});
  };

  return (
    <button onClick={shareToFacebook}>分享到 Facebook</button>
  );
};

export default ShareButton;