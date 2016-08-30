import React, { Component } from 'react';
import { connect } from 'react-redux';
import { destroyPostsIfNeeded } from '../../actions/destroyPostActions';
import styles from './DestroyPostButton.scss';

class DestroyPostButton extends Component {
  constructor() {
    super();
    this.handleDeletingPost = this.handleDeletingPost.bind(this);
  }

  handleDeletingPost() {
    const { dispatch, id } = this.props;
    dispatch(destroyPostsIfNeeded(id));
  }

  render() {
    return (
      <div className={styles.destroyPost}>
        <div
          className="removePost"
          onClick={this.handleDeletingPost}
        >
          [ Destroy Post ]
        </div>
      </div>
    );
  }
};

DestroyPostButton.propTypes = {
  id: React.PropTypes.number,
};

const mapStateToProps = (state) => {
  return {

  }
};

export default connect(
  mapStateToProps
)(DestroyPostButton);
