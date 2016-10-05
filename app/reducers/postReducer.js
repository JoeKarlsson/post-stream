import {
  POST_REQUEST, POST_SUCCESS, POST_FAILURE
} from '../actions/posts/postActions';

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

const post = (state = initialState, action) => {

  switch(action.type) {
    case POST_FAILURE:
      return state.set('didInvalidate', true);

    case POST_REQUEST:
      return state.set('isFetchingPosts', true)
        .set('didInvalidate', false);

    case POST_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        return posts.clear().concat(
          JSON.parse(action.response).map((post) => {
            return Map(post)
            .set('showComments', false)
            .set('isParentPost', true)
            .set('realName', `Joe Karlsson`)
            .set('username', 'JoeJoeBinks131')
            .set('comments', List())
            .set('childId', 0)
            .set('childContext', {})
            .set('didInvalidate', false)
            .set('updatedPostBody', post.body)
            .set('editMode', false)
            .set('replyMode', false)
            .set('replyBody', '')
          })
        )
      })
      .set('isFetchingPosts', false)
      .set('didInvalidate', false)
      .set('lastUpdated', Date.now());

    case 'HANDLE_NEW_POST_BODY_CHANGE':
      return state.set('newPostBody', action.body);

    case 'REQUEST_NEW_POSTS':
      return state.set('submittingPost', true);

    case 'RECEIVE_NEW_POST':
      return state.updateIn(['posts'], (posts) => {
        return posts.unshift(Map(action.newPost)
          .set('showComments', false)
          .set('isParentPost', true)
          .set('realName', 'Joe Karlsson')
          .set('username', 'joejoebinks3')
          .set('comments', List())
          .set('childId', 0)
          .set('childContext', Map())
          .set('didInvalidate', false)
          .set('updatedPostBody', action.newPost.body)
          .set('editMode', false)
          .set('replyMode', false)
          .set('replyBody', '')
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
          return post.updateIn(['comments'], (comments) => {
            return comments.clear().concat(
              action.comments.map((comment) => {
                return Map(comment)
                  .set('childId', 0)
                  .set('showComments', false)
                  .set('isParentPost', false)
              })
            );
          })
          .set('showComments', true)
          .set('childContext', action.comments[0])
        })
      })
      .set('isFetchingPosts', false)
      .set('didInvalidate', false);

    case 'TOGGLE_COMMENT':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('childId', action.newChildId)
          .set('childContext', post.get('comments').get(action.newChildId).toJS());
        })
      });

    case 'TOGGLE_SHOW_COMMENT':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('showComments', action.showCommentState)
        })
      })

    case 'TOGGLE_REPLY_MODE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('replyMode', !post.get('replyMode'));
        })
      });

    case 'HANDLE_REPLY_BODY_CHANGE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('replyBody', action.body);
        })
      });

    case 'REQUEST_NEW_REPLY':
      return state;

    case 'RECEIVE_NEW_REPLY':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('commentCount', post.get('commentCount') + 1)
            .set('replyBody', '')
            .set('comments', post.get('comments').unshift(action.reply))
            .set('replyMode', false)
        })
      });

    default:
      return state;
  }
};

export default post;
