import React from 'react';
import styles from './About.module.scss';
import logo from './../../shared/img/PS.png';

const About = () => {
  return (
    <div className={styles.about}>
      <h1>what is PostStream?</h1>
      <p className={styles.orange}>
        PostStream is an undesigned social network. it is a text-based response to the majority of modern social media platforms. this is certainly not for everyone as you will be interacting with others exclusively through text posts. you will notice several features intentionally left out in order to promote meaningful engagement. we hope you enjoy something a little different!
      </p>
      <p className={styles.purple}><a href='https://github.com/JoeKarlsson/post-stream' target='_blank'>PostStream is completely open source</a>, feel free to fork it or contribute new features.</p>

      <h3>important concepts of PostStream</h3>
      <ul>
        <li className={styles.teal}>no public metrics</li>
        <li className={styles.purple}>no visible follower/following numbers</li>
        <li className={styles.orange}>no visible like/dislike numbers</li>
        <li className={styles.red}>no global public feed</li>
        <li className={styles.pink}>no 'moments' or news-related feeds</li>
        <li className={styles.lightGreen}>no trending topics to browse</li>
        <li className={styles.teal}>markdown support</li>
        <li className={styles.pink}>character limit</li>
        <li className={styles.purple}>brevity</li>
        <li className={styles.red}>accessibilty</li>
        <li className={styles.forrestGreen}>stream shows 256 characters with 'read more' expandable to 2048 character limit</li>
        <li className={styles.orange}>no video/images/gifs</li>
        <li className={styles.lightGreen}>unicode support 🆗</li>
        <li className={styles.purple}>contextual responses</li>
      </ul>

      <p className={styles.lightGreen}>we are always looking to improve - if you find a bug, please report it <a href='https://github.com/JoeKarlsson/post-stream/issues' target='_blank'>here</a>.</p>
      <a width='150' height='50' href='https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss' target='_blank' alt='Single Sign On & Token Based Authentication - Auth0'><img width='150' height='50' alt='JWT Auth for open source projects' src='//cdn.auth0.com/oss/badges/a0-badge-light.png' /></a>
      <p className={styles.pink}>site by
        <a href='http://www.rayfarias.com' target='_blank'> ray</a>,
        <a href='http://jacobyyoung.com/' target='_blank'> jacoby</a> and
        <a href='http://www.callmejoe.net/' target='_blank'> joe</a>
      </p>
      <img src={logo} />
    </div>
  );
};

export default About;
