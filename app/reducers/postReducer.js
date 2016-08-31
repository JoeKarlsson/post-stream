import { Map, List } from 'immutable';

const initialState = Map({
  isFetchingPosts: false,
  isFetchingComments: false,
  didInvalidate: false,
  lastUpdated: null,
  newPostBody: '',
  submittingPost: false,
  receivedAt: null,
  posts: List()
});

const postReducer = (state = initialState, action) => {

  switch(action.type) {
    case 'INVALIDATE_POSTS':
      return state.set('didInvalidate', true);

    case 'REQUEST_POSTS':
      return state.set('isFetchingPosts', true)
        .set('didInvalidate', false);

    case 'RECEIVE_POSTS':
      return state.updateIn(['posts'], (posts) => {
        return posts.clear().concat(
          action.posts.map((post) => {
            return Map(post)
            .set('showComments', false)
            .set('isParentset', true)
            .set('realName', 'Joe Karlsson')
            .set('username', 'joejoebinks3')
            .set('comments', [])
            .set('childId', 0)
            .set('childContext', {})
            .set('didInvalidate', false)
            .set('updatedPostBody', post.body)
            .set('editMode', false)
          })
        )
      })
      .set('isFetchingPosts', false)
      .set('didInvalidate', false)
      .set('lastUpdated', action.receivedAt);

    case 'HANDLE_NEW_POST_BODY_CHANGE':
      return state.set('newPostBody', action.body);

    case 'REQUEST_NEW_POSTS':
      return state.set('submittingPost', true);

    case 'RECEIVE_NEW_POST':
      return state.updateIn(['posts'], (posts) => {
        return posts.push(Map(action.newPost)
          .set('showComments', false)
          .set('isParentset', true)
          .set('realName', 'Joe Karlsson')
          .set('username', 'joejoebinks3')
          .set('comments', [])
          .set('childId', 0)
          .set('childContext', {})
          .set('didInvalidate', false)
          .set('updatedPostBody', action.newPost.body)
          .set('editMode', false)
        );
      })
      .set('submittingPost', false)
      .set('newPostBody', '');

    case 'TOGGLE_EDIT_MODE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('editMode', action.editState)
        })
      })

    case 'HANDLE_UPDATED_POST_BODY_CHANGE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('updatedPostBody', action.body)
        })
      })

    case 'REQUEST_UPDATED_POST':

      return state;

    case 'RECEIVE_UPDATED_POST':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('body', action.updatedPost.body)
            .set('editMode', false);
        })
      })

    case 'DESTROY_POST':
      // return state.updateIn(['posts'], (posts) => {
      //   return posts.updateIn([action.postId - 1], (post) => {
      //     console.log('action.postId: ', action.postId);
      //     console.log('post: ', post);
      //   })
      // });
      return state;

    case 'CONFIRMED_POST_DESTROYED':
      return state.updateIn(['posts'], (posts) => {
        return posts.delete(action.index);
      });

    case 'INVALIDATE_COMMENTS':
      return state.set('didInvalidate', true);

    case 'REQUEST_COMMENTS':
      return state.set('isFetchingComments', true)
        .set('didInvalidate', false);

    case 'RECEIVE_COMMENTS':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('showComments', true)
          .set('childContext', action.comments[0])
          .set('comments', action.comments);
        })
      })
      .set('isFetchingPosts', false)
      .set('didInvalidate', false);

    case 'TOGGLE_COMMENT':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('childId', action.newChildId)
          .set('childContext', post.get('comments')[action.newChildId]);
        })
      });

    default:
      return state;
  }
};

export default postReducer;
