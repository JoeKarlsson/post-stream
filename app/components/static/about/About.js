import React from 'react';
import styles from './About.scss';
const logo = require("./../../shared/img/PS.png");

class About extends React.Component {
  render() {
    return (
      <div className={ styles.about }>
        <h1>what is PostStream?</h1>
        <p>
          PostStream is an undesigned social network. It is a text-based response to the majority of modern social media platforms. This is certainly not for everyone as you will be interacting with others exclusively through text posts. You will notice several features intentionally left out in order to promote meaningful engagement. We hope you enjoy something a little different!
        </p>
        <p><a href='https://github.com/JoeKarlsson1/post-stream' target="_blank">PostStream is completely open source</a>, feel free to fork it or contribute new features.</p>

        <h3>Important concepts of PostStream</h3>
        <ul>
          <li>No public metrics</li>
          <li>No visible follower/following numbers</li>
          <li>No visible like/dislike numbers</li>
          <li>No global public feed</li>
          <li>No "moments" or news-related feeds</li>
          <li>No trending topics to browse</li>
          <li>Markdown support</li>
          <li>Character limit</li>
          <li>Brevity</li>
          <li>Accessibilty</li>
          <li>Stream shows 256 characters with "read more" expandable to 2048 character limit</li>
          <li>No video/images/gifs</li>
          <li>Unicode support 🆗</li>
          <li>Contextual responses</li>
        </ul>

        <p>We are always looking to improve - if you find a bug, please report it <a href='https://github.com/JoeKarlsson1/post-stream/issues' target="_blank">here</a>.</p>
        <a width="150" height="50" href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0"><img width="150" height="50" alt="JWT Auth for open source projects" src="//cdn.auth0.com/oss/badges/a0-badge-light.png"/></a>
        <p>site by
          <a href='http://www.rayfarias.com' target="_blank">ray</a>,
          <a href='http://jacobyyoung.com/' target="_blank">jacoby</a> and
          <a href='http://www.callmejoe.net/' target="_blank">joe</a>
        </p>
        <img src={ logo } />
      </div>
    );
  }
};

export default About;
