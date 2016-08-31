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
        <p>Site by Ray, Jacoby, and Joe</p>
        <img src={logo} />
      </div>
    );
  }
};

export default About;
