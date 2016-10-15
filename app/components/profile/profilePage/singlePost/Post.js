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

    const color = colors[Math.floor(Math.random()*colors.length)];
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
          <span className={ styles.username }>{ username}</span> | {realName } | <span className={ styles.timeStamp }>{ new Date(createdAt).toLocaleTimeString() }</span>
        </div>

        <div>
          <span className={ styles[color] } dangerouslySetInnerHTML={ this.rawMarkup() } />
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
