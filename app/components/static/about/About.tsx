import styles from "./About.module.scss";

// The about page, laid out like a Unix man page
const About = () => (
  <div className={styles.man}>
    <title>about · PostStream</title>
    <h1>about PostStream</h1>
    <p className={styles.manHeader} aria-hidden="true">
      <span>POSTSTREAM(7)</span>
      <span>PostStream Manual</span>
    </p>

    <h2>NAME</h2>
    <p>poststream - an undesigned, text-only social network</p>

    <h2>DESCRIPTION</h2>
    <p>
      PostStream is an undesigned social network. it is a text-based response to the majority of
      modern social media platforms. this is certainly not for everyone as you will be interacting
      with others exclusively through text posts. you will notice several features intentionally
      left out in order to promote meaningful engagement. we hope you enjoy something a little
      different!
    </p>

    <h2>CONCEPTS</h2>
    <ul>
      <li>no public metrics</li>
      <li>no visible follower/following numbers</li>
      <li>no visible like/dislike numbers</li>
      <li>no &lsquo;moments&rsquo; or news-related feeds</li>
      <li>no trending topics to browse</li>
      <li>markdown support</li>
      <li>brevity: posts top out at 255 characters</li>
      <li>accessibility</li>
      <li>no video/images/gifs</li>
      <li>unicode support 🆗</li>
    </ul>

    <h2>KEYS</h2>
    <dl className={styles.keys}>
      <dt>j, k</dt>
      <dd>next, previous post</dd>
      <dt>n</dt>
      <dd>new post</dd>
      <dt>r</dt>
      <dd>reply to the selected post</dd>
    </dl>
    <p>turn them off at the bottom of any page.</p>

    <h2>BUGS</h2>
    <p>
      we are always looking to improve. if you find a bug, please report it{" "}
      <a href="https://github.com/JoeKarlsson/post-stream/issues" target="_blank" rel="noopener noreferrer">
        on GitHub
      </a>
      .
    </p>

    <h2>SEE ALSO</h2>
    <p>
      PostStream is{" "}
      <a href="https://github.com/JoeKarlsson/post-stream" target="_blank" rel="noopener noreferrer">
        completely open source
      </a>
      , feel free to fork it or contribute new features.
    </p>
  </div>
);

export default About;
