import React, { Component } from 'react';
import { connect } from 'react-redux';
const Remarkable = require('remarkable');
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

  render() {
    const {
      username,
      realName,
      createdAt,
    } = this.props;

    return (
      <div className={styles.post}>

        <div>
          { username} | {realName } | { new Date(createdAt).toLocaleTimeString() }
        </div>

        <div>
          <span dangerouslySetInnerHTML={ this.rawMarkup() } />
        </div>

        <hr/>
      </div>
    );
  }
};

Post.propTypes = {
  id: React.PropTypes.number,
  comments: React.PropTypes.arrayOf(React.PropTypes.object),
  showComments: React.PropTypes.bool,
  isParentPost: React.PropTypes.bool,
  realName: React.PropTypes.string,
  username: React.PropTypes.string,
  body: React.PropTypes.string,
  created_at: React.PropTypes.number,
  commentCount: React.PropTypes.number,
  childId: React.PropTypes.number,
  childContext: React.PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {

  }
};

export default connect(
  mapStateToProps
)(Post);
