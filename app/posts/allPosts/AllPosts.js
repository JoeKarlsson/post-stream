import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from '../singlePost/Post';
import NewPost from '../newPost/NewPost';
import styles from './AllPosts.scss';
import { fetchPostsIfNeeded } from '../../actions/postActions';

class AllPosts extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPostsIfNeeded());
  };

  render() {
    const postNode = this.props.posts.map(( post, i ) => {
      return (
        <Post
          {...post}
          index={i}
          key={i}
        />
      );
    });

    return (
      <div className={styles.allPosts}>
        <h1>stream</h1>

        <NewPost />

        <span>
          Last updated at {new Date(this.props.lastUpdated).toLocaleTimeString()}.
          {' '}
        </span>

        <hr />

        {this.props.posts.length === 0 &&
          <h2>Loading...</h2>
        }

        {this.props.posts.length > 2 &&
          <div>
            {postNode}
          </div>
        }
      </div>
    );
  }
};

AllPosts.propTypes = {
  posts: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    posts: state.postReducer.get('posts').toJS(),
    isFetching: state.postReducer.get('isFetching'),
    lastUpdated: state.postReducer.get('lastUpdated')
  }
};

export default connect(
  mapStateToProps
)(AllPosts);
