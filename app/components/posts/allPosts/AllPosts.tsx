import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import NewPost from "../newPost/NewPost";
import PostList from "../postList/PostList";
import styles from "./AllPosts.module.scss";
import { fetchPosts } from "../../../slices/postSlice";
import { RootState } from "../../../slices";

interface AllPostsProps {
  auth?: unknown;
}

const AllPosts: React.FC<AllPostsProps> = ({ auth }) => {
  const dispatch = useDispatch();
  const post = useSelector((state: RootState) => state.post);
  const profile = useSelector((state: RootState) => state.profile);

  const posts = post.posts;
  const lastUpdated = post.lastUpdated;
  const isAuthenticated = profile.isAuthenticated;

  useEffect(() => {
    dispatch(fetchPosts() as any);
  }, [dispatch]);

  return (
    <div className={styles.allPosts}>
      <h1>PostStream</h1>

      <div className={styles.lastUpdated}>
        stream was last updated at{" "}
        {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "never"}.{" "}
      </div>

      {isAuthenticated && <NewPost />}
      <hr />

      <PostList posts={posts} auth={auth} />
    </div>
  );
};

AllPosts.propTypes = {
  auth: PropTypes.object,
};

export default AllPosts;
