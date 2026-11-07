import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../singlePost/Post";
import TextButton from "../../shared/textButton/TextButton";
import { clearError, fetchMorePosts } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import { FeedPost } from "../../../slices/postSlice";
import styles from "./PostList.module.scss";

// username: whose posts these are (profile page), so "show more" asks for the same list
const PostList = ({ posts, username }: { posts: FeedPost[]; username?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isFetchingPosts: isFetching, hasMore, error } = useSelector((state: RootState) => state.post);

  const errorNotice = error && (
    <p role="alert" className={styles.error}>
      {error} <TextButton onClick={() => dispatch(clearError())}>dismiss</TextButton>
    </p>
  );

  if (posts.length === 0) {
    return (
      <div className={styles.PostList}>
        {errorNotice}
        <p>{isFetching ? "loading..." : "no posts yet"}</p>
      </div>
    );
  }

  return (
    <div className={styles.PostList}>
      {errorNotice}
      {posts.map((post, i) => (
        <Post {...post} index={i} key={post.id} />
      ))}
      {hasMore && (
        <TextButton
          disabled={isFetching}
          onClick={() => dispatch(fetchMorePosts({ username, offset: posts.length }))}
        >
          {isFetching ? "loading..." : "show more"}
        </TextButton>
      )}
    </div>
  );
};

export default PostList;
