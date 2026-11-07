import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readJsonOrThrow } from "../../slices/http";
import { authorColor } from "../../utils/authorColor";
import colors from "../shared/styles/authorColors.module.scss";
import styles from "./People.module.scss";

interface Person {
  username: string;
  first_name?: string | null;
  last_name?: string | null;
}

// Everyone on PostStream, A to Z. With no global feed, this is how you find
// people to follow. Names only: no follower counts, no "suggested".
const People = () => {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/auth/users")
      .then(readJsonOrThrow)
      .then(setPeople)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div>
      <title>people · PostStream</title>
      <h1>people</h1>
      {error && <p role="alert">{error}</p>}
      {!people && !error && <p>loading...</p>}
      {people && (
        <ul className={styles.people}>
          {people.map(({ username, first_name, last_name }) => (
            <li key={username}>
              &lt;
              <Link to={`/user/${username}`} className={colors[authorColor(username)]}>
                {username}
              </Link>
              &gt; {[first_name, last_name].filter(Boolean).join(" ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default People;
