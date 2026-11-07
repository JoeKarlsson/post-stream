import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NewPost from "../newPost/NewPost";
import PostList from "../postList/PostList";
import styles from "./AllPosts.module.scss";
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
    <div className={styles.allPosts}>
      <h1>PostStream</h1>

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
