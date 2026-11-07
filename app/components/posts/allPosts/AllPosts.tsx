import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NewPost from "../newPost/NewPost";
import PostList from "../postList/PostList";
import styles from "./AllPosts.module.scss";
import { WORDMARK } from "./wordmark";
import { fetchPosts } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";

const AllPosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, lastUpdated } = useSelector((state: RootState) => state.post);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    dispatch(fetchPosts(undefined));
  }, [dispatch]);

  return (
    <div>
      <title>PostStream</title>
      <h1>
        <span className={styles.wordmark} aria-hidden="true">
          {WORDMARK}
        </span>
        <span className="sr-only">PostStream</span>
      </h1>

      <p className={styles.lastUpdated}>
        stream was last updated at{" "}
        {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "never"}
      </p>

      {isAuthenticated && <NewPost />}
      <hr />

      <PostList posts={posts} />
    </div>
  );
};

export default AllPosts;
