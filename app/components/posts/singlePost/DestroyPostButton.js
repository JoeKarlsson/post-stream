import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { destroyPost } from '../../../actions/posts/destroyPostActions';
import styles from './DestroyPostButton.scss';

class DestroyPostButton extends Component {
  constructor() {
    super();
    this.handleDeletingPost = this.handleDeletingPost.bind(this);
  }

  handleDeletingPost() {
    const { dispatch, id, index } = this.props;
    dispatch(destroyPost(id, index));
  }

  render() {
    return (
      <div className={styles.destroyPost}>
        [ <span
          className={styles.destroyButton}
          onClick={this.handleDeletingPost}
        >destroy</span> ]
      </div>
    );
  }
};

DestroyPostButton.propTypes = {
  id: PropTypes.number,
};

const mapStateToProps = (state) => {
  return {

  }
};

export default connect(
  mapStateToProps
)(DestroyPostButton);
