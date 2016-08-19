import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  submitNewPost,
  handleNewPostBodyChange
} from '../../actions/newPostActions';
import styles from './NewPost.scss';

class NewPostForm extends Component {

  constructor() {
    super();
    this.handleSubmitPost = this.handleSubmitPost.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
  }

  handleBodyChange(e) {
    const { dispatch } = this.props;
    console.log('e.target.value: ', e.target.value);
    dispatch(handleNewPostBodyChange(e.target.value))
  }

  handleSubmitPost(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    console.log('this.props.newPostBody: ', this.props.newPostBody);
    dispatch(submitNewPost(this.props.newPostBody))
  };

  render() {
    return (
      <div className={styles.newPost}>
        <form>
          <label htmlFor="body">Body</label>
          <input
            ref="body"
            type='text'
            id='body'
            placeholder='Share it with the world'
            value={this.props.newPostBody}
            onChange={this.handleBodyChange}
          />
          <div className="create-public-private-btns">
            <button onClick={this.handleSubmitPost}>Post</button>
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
    newPostBody: state.postReducer.get('newPostBody'),
  }
};

export default connect(
  mapStateToProps
)(NewPostForm);
