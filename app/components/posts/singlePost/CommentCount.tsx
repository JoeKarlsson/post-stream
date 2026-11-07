const CommentCount = ({ numOfComments }: { numOfComments: number }) => {
  if (numOfComments === 0) return <>no comments</>;
  if (numOfComments === 1) return <>1 comment</>;
  return <>{numOfComments} comments</>;
};

export default CommentCount;
