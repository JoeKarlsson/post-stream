import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  submitUpdatedPost,
  handleUpdatedPostBodyChange
} from '../../actions/editPostActions';
import styles from './EditPost.scss';

class EditPost extends Component {
  constructor() {
    super();
    this.handleSubmitUpdatedPost = this.handleSubmitUpdatedPost.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
  }

  handleBodyChange(e) {
    const { dispatch, index } = this.props;
    dispatch(handleUpdatedPostBodyChange(e.target.value, index))
  }

  handleSubmitUpdatedPost(e) {
    e.preventDefault();
    const { dispatch, postId, index } = this.props;
    dispatch(submitUpdatedPost(this.props.newPostBody, postId, index))
  };

  render() {
    return (
      <div className={styles.editPost}>
        <form>
          <input
            ref='body'
            type='text'
            id='body'
            placeholder='edit your post'
            value={this.props.updatedPostBody}
            onChange={this.handleBodyChange}
          />
          <div className='create-public-private-btns'>
            <button onClick={this.handleSubmitUpdatedPost}>save</button>
          </div>
        </form>
      </div>
    );
  }
};

EditPost.propTypes = {
  id: React.PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  return {
    updatedPostBody: state.postReducer.get('posts').get(ownProps.index).get('updatedPostBody'),
  }
};

export default connect(
  mapStateToProps
)(EditPost);
