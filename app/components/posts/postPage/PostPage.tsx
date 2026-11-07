import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPost } from "../../../slices/postSlice";
import { AppDispatch, RootState } from "../../../slices";
import PostList from "../postList/PostList";

// A post's permalink: /p/12, with replies at /p/12#c34
const PostPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { postId = "" } = useParams();
  const { posts, error } = useSelector((state: RootState) => state.post);
  const post = posts[0];

  useEffect(() => {
    dispatch(fetchPost(Number(postId)));
  }, [dispatch, postId]);

  // Scroll to a reply once it has rendered, for links like /p/12#c34
  useEffect(() => {
    if (post && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, [post]);

  const title = post ? `post ${post.id} by ${post.userID}` : `post ${postId}`;

  return (
    <div>
      <title>{`${title} · PostStream`}</title>
      <h1>{title}</h1>
      {post || !error ? <PostList posts={posts} /> : <p role="alert">{error}</p>}
    </div>
  );
};

export default PostPage;
