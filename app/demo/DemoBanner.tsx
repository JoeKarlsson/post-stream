import TextButton from "../components/shared/textButton/TextButton";
import { resetDemo } from "./demoApi";
import styles from "./DemoBanner.module.scss";

// Says plainly what the static demo is, on every page
const DemoBanner = () => (
  <p className={styles.banner}>
    {"archived demo: there's no server. you're signed in as a sample visitor, the other " +
      "people are simulated, and anything you do stays in this browser. "}
    <TextButton onClick={resetDemo}>reset demo</TextButton>
  </p>
);

export default DemoBanner;
