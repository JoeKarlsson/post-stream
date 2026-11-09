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

    <h2>ARTIST STATEMENT</h2>
    <p>
      Every social network puts a number on everything you post: likes, followers, shares,
      what&rsquo;s trending. PostStream is an undesigned social network, built without any of them.
    </p>
    <p>
      Most of the work was deciding what to leave out. It shows no like counts and no follower
      counts, so you can&rsquo;t see how popular anyone is. There&rsquo;s no global feed, no
      trending topics and no news to browse, and you can&rsquo;t post images, video or GIFs.
    </p>
    <p>
      Ben Grosser&rsquo;s Facebook Demetricator, a browser extension from 2012, hides the like and
      friend counts on Facebook, and PostStream was built without them in the first place.
    </p>
    <p>
      Replies work the same way. You don&rsquo;t write them, you pick one: agree, disagree, agree
      or disagree because of something, tell me more about something, thank you for sharing, or
      brilliant.
    </p>

    <h2>CONCEPTS</h2>
    <ul>
      <li>no public metrics</li>
      <li>no visible follower/following numbers</li>
      <li>no visible like/dislike numbers</li>
      <li>no global public feed: you see the people you follow</li>
      <li>no &lsquo;moments&rsquo; or news-related feeds</li>
      <li>no trending topics to browse</li>
      <li>markdown support</li>
      <li>brevity: the stream shows 256 characters, &lsquo;read more&rsquo; shows up to 2048</li>
      <li>accessibility</li>
      <li>no video/images/gifs</li>
      <li>unicode support 🆗</li>
      <li>
        contextual responses: reply with agree, disagree (with or without a reason), tell me
        more, thank you for sharing, or brilliant
      </li>
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

    <h2>FILES</h2>
    <p>
      every profile is also plain text: <code>/user/&lt;name&gt;.txt</code>, for example{" "}
      <a href="/user/janedoe343.txt">/user/janedoe343.txt</a>. every post has a permalink: its
      timestamp.
    </p>

    <h2>AUTHORS</h2>
    <p>Joe Karlsson, with Ray Farias and Jacoby Young.</p>

    <h2>SEE ALSO</h2>
    <p>
      PostStream is{" "}
      <a href="https://github.com/JoeKarlsson/post-stream" target="_blank" rel="noopener noreferrer">
        completely open source
      </a>
      , feel free to fork it or contribute new features. More about it on{" "}
      <a href="https://www.joekarlsson.com/work/poststream/">its page on joekarlsson.com</a>.
    </p>
  </div>
);

export default About;
