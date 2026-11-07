import { Link } from "react-router-dom";

const Logout = () => (
  <div>
    <h1>you are now logged out</h1>
    <p>[ <Link to="/">back to the stream</Link> ]</p>
  </div>
);

export default Logout;
