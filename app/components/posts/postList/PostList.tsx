import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../singlePost/Post";
import TextButton from "../../shared/textButton/TextButton";
import { clearError } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import { FeedPost } from "../../../slices/postSlice";
import styles from "./PostList.module.scss";

const PostList = ({ posts }: { posts: FeedPost[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isFetchingPosts: isFetching, error } = useSelector((state: RootState) => state.post);

  const errorNotice = error && (
    <p role="alert" className={styles.error}>
      {error} <TextButton onClick={() => dispatch(clearError())}>dismiss</TextButton>
    </p>
  );

  if (posts.length === 0) {
    return (
      <div className={styles.PostList}>
        {errorNotice}
        <p>{isFetching ? "Loading..." : "No posts yet."}</p>
      </div>
    );
  }

  return (
    <div className={styles.PostList}>
      {errorNotice}
      {posts.map((post, i) => (
        <Post {...post} index={i} key={post.id} />
      ))}
    </div>
  );
};

export default PostList;
