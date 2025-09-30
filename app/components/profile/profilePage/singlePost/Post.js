import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Remarkable } from 'remarkable';
const emojione = require('emojione');
import styles from './Post.scss';

class Post extends Component {

  rawMarkup() {
    const { body } = this.props;
    var md = new Remarkable();
    var rawMarkup = md.render(body.toString());
    let output = emojione.shortnameToImage(rawMarkup);
    return { __html: output };
  };

  getRandomColor() {
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
  }

  render() {
    const {
      username,
      realName,
      createdAt,
    } = this.props;

    const color = this.getRandomColor();

    return (
      <div className={styles.post}>

        <div>
          <span className={styles.username}>{username}</span> | {realName} | <span className={styles.timeStamp}>{new Date(createdAt).toLocaleTimeString()}</span>
        </div>

        <div>
          <span className={styles[color]} dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>

        <hr />
      </div>
    );
  }
};

Post.propTypes = {
  id: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.object),
  showComments: PropTypes.bool,
  isParentPost: PropTypes.bool,
  realName: PropTypes.string,
  username: PropTypes.string,
  body: PropTypes.string,
  created_at: PropTypes.number,
  commentCount: PropTypes.number,
  childId: PropTypes.number,
  childContext: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {

  }
};

export default connect(
  mapStateToProps
)(Post);
