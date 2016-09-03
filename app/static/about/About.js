import React from 'react';
import styles from './About.scss';
const logo = require("./../../shared/img/PS.png");

class About extends React.Component {
  render() {
    return (
      <div className={styles.about}>
        <h1>what is PostStream?</h1>
        <p>
          PostStream is an undesigned social network. It is a text-based response to the majority of modern social media platforms. This is certainly not for everyone as you will be interacting with others exclusively through text posts. You will notice several features intentionally left out in order to promote meaningful engagement. We hope you enjoy something a little different!
        </p>

        <h3>Important concepts of PostStream</h3>
        <ul>
          <li>No public metrics</li>
          <li>No visible follower/following numbers</li>
          <li>No visible like/dislike numbers</li>
          <li>No global public feed</li>
          <li>No "moments" or news-related feeds</li>
          <li>No trending topics to browse</li>
          <li>Character limit</li>
          <li>Brevity</li>
          <li>Accessibilty</li>
          <li>Stream shows 256 characters with "read more" expandable to 2048 character limit</li>
          <li>No video/images/gifs</li>
          <li>Unicode support 🆗</li>
          <li>Contextual responses</li>
        </ul>
        <p>Site by Ray, Jacoby, and Joe</p>
        <img src={logo} />
      </div>
    );
  }
};

export default About;
