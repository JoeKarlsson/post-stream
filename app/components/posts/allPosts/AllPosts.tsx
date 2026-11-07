import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import NewPost from "../newPost/NewPost";
import PostList from "../postList/PostList";
import styles from "./AllPosts.module.scss";
import { WORDMARK } from "./wordmark";
import { fetchPosts } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import { formatTimestamp } from "../../../utils/plainText";

// The home page. Logged in: your feed (people you follow, plus you).
// Logged out: what PostStream is. There's no public feed to show.
const AllPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, lastUpdated, isFetchingPosts } = useSelector((state: RootState) => state.post);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPosts(undefined));
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div>
      <title>PostStream</title>
      <h1>
        <span className={styles.wordmark} aria-hidden="true">
          {WORDMARK}
        </span>
        <span className="sr-only">PostStream</span>
      </h1>

      {isAuthenticated ? (
        <>
          <p className={styles.lastUpdated}>
            your feed: you and the people you follow. updated{" "}
            {lastUpdated ? formatTimestamp(new Date(lastUpdated)) : "never"}
          </p>
          <NewPost />
          <hr />
          {!isFetchingPosts && posts.length === 0 ? (
            <p>
              nothing here yet. find people to follow on the [ <Link to="/people">people</Link> ]
              page.
            </p>
          ) : (
            <PostList posts={posts} />
          )}
        </>
      ) : (
        <>
          <p>an undesigned, text-only social network.</p>
          <p>
            there is no public feed. sign in to see posts from the people you follow, or look
            around first.
          </p>
          <p>
            [ <Link to="/login">sign in</Link> ] [ <Link to="/people">people</Link> ] [{" "}
            <Link to="/about">about</Link> ]
          </p>
        </>
      )}
    </div>
  );
};

export default AllPosts;
