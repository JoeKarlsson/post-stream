import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewPost from '../newPost/NewPost';
import PostList from '../postList/PostList';
import styles from './AllPosts.scss';
import { fetchPosts } from '../../../actions/posts/postActions';

class AllPosts extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPosts());
  };

  render() {
    const {
      posts,
      lastUpdated,
      isAuthenticated,
    } = this.props;

    return (
      <div className={styles.allPosts}>
        <h1>PostStream</h1>

        <div>
          stream was last updated at {new Date(lastUpdated).toLocaleTimeString()}.
          {' '}
        </div>

        { isAuthenticated &&
          <NewPost auth={this.props.auth}/>
        }
        <hr />

        <PostList
          posts={posts}
          isAuthenticated={isAuthenticated}
        />

      </div>
    );
  }
};

AllPosts.propTypes = {
  posts: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  console.log(state.root.post.get('posts').toJS());
  return {
    posts: state.root.post.get('posts').toJS(),
    isFetching: state.root.post.get('isFetching'),
    lastUpdated: state.root.post.get('lastUpdated'),
  }
};

export default connect(
  mapStateToProps
)(AllPosts);
