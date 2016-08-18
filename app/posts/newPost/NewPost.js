import React, { Component } from 'react';
import styles from './NewPost.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      body: '',
    };
    this.onPostData = this.onPostData.bind(this);
    this.onPostError = this.onPostError.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmitPost = this.handleSubmitPost.bind(this);
  }

  onPostData(data) {
    const parsedData = JSON.parse(data.currentTarget.response);
    this.props.onNewPost(parsedData)
  };

  onPostError(err) {
    console.error('new post', status, err.toString());
  };

  handleSubmitPost(e) {
    e.preventDefault();

    const oReq = new XMLHttpRequest();
    oReq.open("POST", '/post/new', true);
    oReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    oReq.addEventListener("load", this.onPostData);
    oReq.addEventListener("error", this.onPostError);
    oReq.send(`body=${this.state.body}`);
    this.setState({
      body: '',
    });
  };

  handleBodyChange(e) {
    this.setState({
      body: e.target.value,
    });
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
            value={this.state.body}
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

export default App;
