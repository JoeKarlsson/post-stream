import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import twemoji from 'twemoji';
import styles from './Post.module.scss';

const Post = ({ username, realName, createdAt, body }) => {
  const rawMarkup = useMemo(() => {
    const md = new Remarkable();
    const rawMarkup = md.render(body.toString());
    const output = twemoji.parse(rawMarkup, {
      folder: 'svg',
      ext: '.svg'
    });
    return { __html: output };
  }, [body]);

  const getRandomColor = () => {
    const colors = [
      'teal',
      'red',
      'purple',
      'orange',
      'pink',
      'lightGreen',
      'forrestGreen'
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  const color = getRandomColor();

  return (
    <div className={styles.post}>

      <div>
        <span className={styles.username}>{username}</span> | {realName} | <span className={styles.timeStamp}>{new Date(createdAt).toLocaleTimeString()}</span>
      </div>

      <div>
        <span className={styles[color]} dangerouslySetInnerHTML={rawMarkup} />
      </div>

      <hr />
    </div>
  );
};

Post.propTypes = {
  id: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.object),
  showComments: PropTypes.bool,
  isParentPost: PropTypes.bool,
  realName: PropTypes.string,
  username: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.number,
  commentCount: PropTypes.number,
  childId: PropTypes.number,
  childContext: PropTypes.object
};

export default Post;
