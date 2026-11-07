import styles from "./Footer.module.scss";

const Footer = () => (
  <footer className={styles.footer}>
    <p>
      site by ray farias, jacoby young and{" "}
      <a href="https://www.joekarlsson.com/" target="_blank" rel="noopener noreferrer">
        joe karlsson
      </a>
    </p>
  </footer>
);

export default Footer;
