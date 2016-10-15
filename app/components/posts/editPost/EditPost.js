import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  submitUpdatedPost,
  handleUpdatedPostBodyChange,
  toggleEditMode,
} from '../../../actions/posts/editPostActions';
import styles from './EditPost.scss';

class EditPost extends Component {
  constructor() {
    super();
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmitUpdatedPost = this.handleSubmitUpdatedPost.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
  }

  handleCancel() {
    const { dispatch, index } = this.props;
    dispatch(toggleEditMode(index, false))
  }

  handleBodyChange(e) {
    const { dispatch, index } = this.props;
    dispatch(handleUpdatedPostBodyChange(e.target.value, index))
  }

  handleSubmitUpdatedPost(e) {
    e.preventDefault();
    const { dispatch, id, index, updatedPostBody } = this.props;
    dispatch(submitUpdatedPost(updatedPostBody, id, index))
  };

  render() {
    return (
      <div className={styles.editPost} >
        <form>
          <textarea
            ref='body'
            type='text'
            id='body'
            rows='3'
            className='u-full-width'
            placeholder='edit your post'
            value={this.props.updatedPostBody}
            onChange={this.handleBodyChange}
          ></textarea>
          <div>
            [<span className={ styles.saveButton }  onClick={this.handleSubmitUpdatedPost}> save </span> ]
          </div>
          <div>
            [ <span className={ styles.cancelButton } onClick={this.handleCancel}> cancel </span> ]
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
    updatedPostBody: state.root.post.get('posts').get(ownProps.index).get('updatedPostBody'),
  }
};

export default connect(
  mapStateToProps
)(EditPost);
