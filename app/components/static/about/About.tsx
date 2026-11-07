import styles from './About.module.scss';
import logo from './../../shared/img/PS.png';

const About = () => {
  return (
    <div>
      <title>about · PostStream</title>
      <h1>what is PostStream?</h1>
      <p className={styles.orange}>
        PostStream is an undesigned social network. it is a text-based response to the majority of modern social media platforms. this is certainly not for everyone as you will be interacting with others exclusively through text posts. you will notice several features intentionally left out in order to promote meaningful engagement. we hope you enjoy something a little different!
      </p>
      <p className={styles.yellow}><a href='https://github.com/JoeKarlsson/post-stream' target='_blank' rel='noopener noreferrer'>PostStream is completely open source</a>, feel free to fork it or contribute new features.</p>

      <h2>important concepts of PostStream</h2>
      <ul>
        <li className={styles.teal}>no public metrics</li>
        <li className={styles.yellow}>no visible follower/following numbers</li>
        <li className={styles.orange}>no visible like/dislike numbers</li>
        <li className={styles.pink}>no &lsquo;moments&rsquo; or news-related feeds</li>
        <li className={styles.lightGreen}>no trending topics to browse</li>
        <li className={styles.teal}>markdown support</li>
        <li className={styles.yellow}>brevity</li>
        <li className={styles.red}>accessibility</li>
        <li className={styles.forrestGreen}>posts top out at 255 characters</li>
        <li className={styles.orange}>no video/images/gifs</li>
        <li className={styles.lightGreen}>unicode support 🆗</li>
      </ul>

      <p className={styles.lightGreen}>we are always looking to improve - if you find a bug, please report it <a href='https://github.com/JoeKarlsson/post-stream/issues' target='_blank' rel='noopener noreferrer'>on GitHub</a>.</p>
      <img src={logo} alt='PostStream logo' width='58' height='58' />
    </div>
  );
};

export default About;
