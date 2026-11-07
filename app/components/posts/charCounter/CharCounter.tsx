import { MAX_POST_LENGTH } from "../../../slices/postSlice";
import { counterBar } from "../../../utils/plainText";
import styles from "./CharCounter.module.scss";

// [##########..........] 142/255 under a post box. The bar is decoration; the
// numbers are what a screen reader hears, through the textarea's aria-describedby.
const CharCounter = ({ id, length }: { id: string; length: number }) => (
  <p id={id} className={length >= MAX_POST_LENGTH ? styles.full : styles.counter}>
    <span aria-hidden="true">{counterBar(length, MAX_POST_LENGTH)} </span>
    {length}/{MAX_POST_LENGTH}
    <span className="sr-only"> characters</span>
  </p>
);

export default CharCounter;
