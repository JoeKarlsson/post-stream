import { Link } from "react-router-dom";

const NoMatch = () => (
  <div>
    <title>page not found · PostStream</title>
    <h1>404</h1>
    <p>sry, no page here. [ <Link to="/">back to the stream</Link> ]</p>
  </div>
);

export default NoMatch;
