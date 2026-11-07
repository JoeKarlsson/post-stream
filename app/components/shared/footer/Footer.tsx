import { useState } from "react";
import TextButton from "../textButton/TextButton";
import { setShortcutsEnabled, shortcutsEnabled } from "../keyboard/shortcuts";
import styles from "./Footer.module.scss";

// Signed off like an email: "-- " then the signature
const Footer = () => {
  const [keysOn, setKeysOn] = useState(shortcutsEnabled);

  const toggleKeys = () => {
    setShortcutsEnabled(!keysOn);
    setKeysOn(!keysOn);
  };

  return (
    <footer className={styles.footer}>
      <p className={styles.delimiter} aria-hidden="true">
        --{" "}
      </p>
      <p>
        site by ray farias, jacoby young and{" "}
        <a href="https://www.joekarlsson.com/" target="_blank" rel="noopener noreferrer">
          joe karlsson
        </a>
      </p>
      <p>
        keys: j/k next/previous post, n new post, r reply{" "}
        <TextButton onClick={toggleKeys}>{keysOn ? "turn keys off" : "turn keys on"}</TextButton>
      </p>
    </footer>
  );
};

export default Footer;
