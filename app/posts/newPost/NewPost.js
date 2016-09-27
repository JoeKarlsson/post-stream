import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  submitNewPost,
  handleNewPostBodyChange
} from '../../actions/posts/newPostActions';
import styles from './NewPost.scss';

class NewPostForm extends Component {

  constructor() {
    super();
    this.handleSubmitPost = this.handleSubmitPost.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
  }

  handleBodyChange(e) {
    const { dispatch } = this.props;
    dispatch(handleNewPostBodyChange(e.target.value))
  }

  handleSubmitPost(e) {
    e.preventDefault();
    const { dispatch, newPostBody } = this.props;
    console.log(this.props)
    const { getProfile } = this.props.auth;
    const profile = getProfile();
    dispatch(submitNewPost(newPostBody, profile.user_id))
  };

  render() {
    return (
      <div className={styles.u_full_width}>
        <form>
          <label htmlFor="body">create a new post</label>
          <textarea
            ref="body"
            type='textarea'
            id='body'
            rows='5'
            className="u-full-width"
            placeholder='share it with the world...'
            value={this.props.newPostBody}
            onChange={this.handleBodyChange}
          ></textarea>
          <div>
            [<span className={styles.clickable} onClick={this.handleSubmitPost}> post </span>]
          </div>
        </form>
      </div>
    );
  }
};

NewPostForm.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    newPostBody: state.rootReducer.postReducer.get('newPostBody'),
  }
};

export default connect(
  mapStateToProps
)(NewPostForm);
